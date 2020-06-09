const { google } = require("googleapis");
const DataBaseConnectionError = require("../errors/database-connection-error");
const db = require("../../database/models/index");
const EmailQueue = require("../utils/queue");
const Mail = require("../utils/mail");

// The controller for Gmail Client
class Gmail {
  // Get an OAuthClient with configurations
  static get_oAuthClient = () => {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const redirect_uris = "http://localhost:3000/gmailauth";

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris
    );

    return oAuth2Client;
  };

  // Responds to route that gets the Authroriztion URL from google
  static getAuthURL = async (req, res) => {
    const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

    try {
      const authUrl = this.get_oAuthClient().generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
      });
      return res.send({ route: authUrl });
    } catch (error) {
      console.log(error);
      throw new DataBaseConnectionError();
    }
  };

  // Generate token from the code the client gets after authorizing the app
  static generateToken = async (req, res) => {
    const { code } = req.body;

    this.get_oAuthClient().getToken(code, async (err, token) => {
      if (err) {
        console.error("Error retrieving access token", err);
        return res.status(400).send({
          errors: [
            {
              message: "Error Signing In",
            },
          ],
        });
      }

      let oAuthClient = this.get_oAuthClient();
      oAuthClient.setCredentials(token);

      const gmail = google.gmail({
        version: "v1",
        auth: oAuthClient,
      });

      // To get the email address
      const gmailProfileResponse = await gmail.users.getProfile({
        userId: "me",
      });

      // To recieve gmail notifications
      const gmailWatchResponse = await gmail.users.watch({
        userId: "me",
        requestBody: {
          labelIds: [
            "SPAM",
            "TRASH",
            "STARRED",
            "SENT",
            "DRAFT",
            "CATEGORY_SOCIAL",
            "CATEGORY_PROMOTIONS",
            "CATEGORY_UPDATES",
            "CATEGORY_FORUMS",
          ],
          labelFilterAction: "exclude",
          topicName: "projects/quickstart-1591716148538/topics/emailResponse",
        },
      });

      await db.Token.create({
        ...token,
        userId: req.currentUser.id,
        googleEmailAddress: gmailProfileResponse.data.emailAddress,
        gmailStartHistoryId: gmailWatchResponse.data.historyId,
      });

      res.send({ message: "User authenticated" });
    });
  };

  static getAuthorizedClient = async (userId) => {
    try {
      const auth = this.get_oAuthClient();
      const token = await db.Token.findOne({
        where: {
          userId: userId,
        },
      });
      if (!token) throw new Error("No token found!");

      auth.setCredentials({
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        scope: token.scope,
        token_type: token.token_type,
        expiry_date: token.expiry_date,
      });
      const gmail = google.gmail({ version: "v1", auth });
      return gmail;
    } catch (error) {
      console.log("Error authorizing Gmail Client\n", error);
      Promise.reject(error.message);
    }
  };

  static getGmailAddress = async (id) => {
    const gmail = await this.getAuthorizedClient(id);
    const gmailUserClient = gmail.users;
    const { emailAddress } = (
      await gmailUserClient.getProfile({
        userId: "me",
      })
    ).data;

    return emailAddress;
  };

  static sendEmail = async (email, userId) => {
    try {
      const gmail = await this.getAuthorizedClient(userId);
      gmail.users.messages.send({
        userId: "me",
        requestBody: { raw: email },
      });
    } catch (err) {
      console.log(err);
      Promise.reject(err.message);
    }
  };

  static emailResponse = async (req, res) => {
    let buffer = new Buffer(req.body.message.data, "base64");
    let messageData = JSON.parse(buffer.toString("utf8"));

    const token = await db.Token.findOne({
      where: {
        googleEmailAddress: messageData.emailAddress,
      },
    });

    let gmail = await this.getAuthorizedClient(token.userId);

    const gmailHistoryResponse = await gmail.users.history.list({
      userId: "me",
      startHistoryId: token.gmailStartHistoryId,
    });

    let historyData = gmailHistoryResponse.data.history;

    if (Array.isArray(historyData)) {
      const latestHistory = historyData[historyData.length - 1];

      console.dir(latestHistory, { depth: null, colors: true });

      if (Array.isArray(latestHistory.messagesAdded)) {
        const threadId = latestHistory.messages[0].threadId;
        console.log(threadId);

        // Update step prospect replied to true associated to that threadId
        await db.sequelize.query(
          `UPDATE "StepProspects" AS sp SET "replied" = :replied
           FROM "Steps" AS s 
           JOIN "Campaigns" as c
           ON s."campaignId" = c.id
           WHERE sp."stepId" = s."id"
           AND "threadId" = :threadId
           AND c."userId" = :userId `,
          {
            replacements: {
              replied: true,
              threadId: threadId,
              userId: token.userId,
            },
            type: db.Sequelize.QueryTypes.UPDATE,
          }
        );
      }
    }

    res.status(200).send();
  };

  // DELETE LATER
  static stop = async (req, res) => {
    const token = await db.Token.findOne({
      where: {
        googleEmailAddress: "johnsample000395777@gmail.com",
      },
    });

    let oAuthClient = this.get_oAuthClient();
    oAuthClient.setCredentials({
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      scope: token.scope,
      token_type: token.token_type,
      expiry_date: token.expiry_date,
    });

    const gmail = google.gmail({
      version: "v1",
      auth: oAuthClient,
    });

    const gmailStopResponse = await gmail.users.stop({
      userId: "johnsample000395777@gmail.com",
    });

    res.status(200).send();
  };

  static addToQueue = async (encodedEmails, userId) => {
    let time = 5000;
    const addTime = 5000;
    encodedEmails.forEach((endodedEmail) => {
      const data = { endodedEmail, userId };
      const options = {
        delay: time,
      };
      time = time + addTime;
      EmailQueue.add(data, options);
    });
  };

  static parseEmails = async (emails, userName, userId, body, subject) => {
    const gmailAddress = await this.getGmailAddress(userId);
    const from = `${userName} \u003c${gmailAddress}\u003e`;
    const encodedEmails = emails.map((email) => {
      const parsedEmail = Mail.parseMail(body);
      const encodedEmail = Mail.encodeEmail(email, from, subject, parsedEmail);
      return encodedEmail;
    });
    this.addToQueue(encodedEmails, userId);
  };

  static tempRouteSendEmail = async (req, res) => {
    const emails = req.body.emails;
    const userName = "Donald Trump";
    const userId = req.currentUser.id;
    const body = "This is a very important message";
    const subject = "Hello world";
    this.parseEmails(emails, userName, userId, body, subject);
    res.send("ok");
  };
}

EmailQueue.process(async (job, done) => {
  await Gmail.sendEmail(job.data.endodedEmail, job.data.userId);
  done();
});

EmailQueue.on("completed", (job, result) => {});

module.exports = Gmail;
