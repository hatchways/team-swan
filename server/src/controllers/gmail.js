const { google } = require("googleapis");
const DataBaseConnectionError = require("../errors/database-connection-error");
const db = require("../../database/models/index");
const EmailQueue = require("../utils/queue");
const Mail = require("../utils/mail");
const Socket = require("../utils/socketmanager");
const Cache = require("../utils/cache");

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
    const SCOPES = ["https://mail.google.com"];

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
          topicName:
            "projects/quickstart-1591716148538/topics/receiveEmailResponse",
        },
      });

      console.log(gmailWatchResponse.data);

      await db.Token.create({
        ...token,
        userId: req.currentUser.id,
        googleEmailAddress: gmailProfileResponse.data.emailAddress,
        gmailStartHistoryId: gmailWatchResponse.data.historyId,
      });

      res.send({ message: "User authenticated" });
    });
  };

  static getAuthorizedClient = async (token) => {
    try {
      const auth = this.get_oAuthClient();
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

  static getToken = async (id) => {
    try {
      const token = await db.Token.findOne({
        where: {
          userId: id,
        },
      });
      if (!token) throw new Error("No token found!");
      const returnToken = JSON.parse(JSON.stringify(token));
      return {
        access_token: returnToken.access_token,
        refresh_token: returnToken.refresh_token,
        scope: returnToken.scope,
        token_type: returnToken.token_type,
        expiry_date: returnToken.expiry_date,
      };
    } catch (error) {
      console.log("Error authorizing Gmail Client\n", error);
      Promise.reject(error.message);
    }
  };

  static getGmailAddress = async (id) => {
    const token = await this.getToken(id);
    const gmail = await this.getAuthorizedClient(token);
    const gmailUserClient = gmail.users;
    const { emailAddress } = (
      await gmailUserClient.getProfile({
        userId: "me",
      })
    ).data;

    return emailAddress;
  };

  static sendEmail = async (email, token) => {
    try {
      const gmail = await this.getAuthorizedClient(token);
      const sent = gmail.users.messages.send({
        userId: "me",
        requestBody: { raw: email },
      });
      return sent;
    } catch (err) {
      console.log(err.message);
      Promise.reject(err.message);
    }
  };

  // Gmail notifications webhook action
  static emailResponse = async (req, res) => {
    const buffer = new Buffer(req.body.message.data, "base64");
    const messageData = JSON.parse(buffer.toString("utf8"));
    console.log(messageData);
    const token = await db.Token.findOne({
      where: {
        googleEmailAddress: messageData.emailAddress,
      },
    });
    console.log("START HISTORY FROM : ", token.gmailStartHistoryId);

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

    const gmailHistoryResponse = await gmail.users.history.list({
      userId: "me",
      startHistoryId: 11524,
    });

    let historyData = gmailHistoryResponse.data.history;

    if (Array.isArray(historyData)) {
      const latestHistory = historyData[historyData.length - 1];

      console.dir(latestHistory, { depth: null, colors: true });
      if (Array.isArray(latestHistory.messagesAdded)) {
        console.log("Found latest history");

        const threadId = latestHistory.messages[0].threadId;
        console.log(threadId);

        // Update step prospect replied to true that are associated to that threadId
        // const cp = await db.CampaignProspect.findOne({ where: { threadId } });
        // if (cp) {
        //   const sp = await db.StepProspect.findOne({
        //     where: { campaignProspectId: cp.id },
        //   });
        //   sp.replied = true;
        //   sp.save();
        // }
        await db.sequelize.query(
          `UPDATE "StepProspects" AS sp SET "replied" = :replied
           FROM "CampaignProspects" AS cp
           JOIN "Campaigns" as c
           ON cp."campaignId" = c."id"
           WHERE sp."campaignProspectId" = cp."id"
           AND cp."threadId" = :threadId
           AND c."userId" = :userId
           AND sp."currentStep" = true`,
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

  // DELETE LATER - debugging to stop getting notification
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

  static addToQueue = async (encodedEmails, userId, campaignProspectIds) => {
    let time = 5000;
    const addTime = 5000;
    const token = await this.getToken(userId);
    encodedEmails.forEach((encodedEmail, index) => {
      const campaignProspectId = campaignProspectIds[index];
      const data = { encodedEmail, token, campaignProspectId, userId };
      const options = {
        delay: time,
      };
      time = time + addTime;
      EmailQueue.add(data, options);
    });
  };

  static createEmailsAndAddToQueue = async (
    emails,
    userName,
    userId,
    body,
    subject,
    campaignProspectIds
  ) => {
    const gmailAddress = await this.getGmailAddress(userId);
    const from = `${userName} \u003c${gmailAddress}\u003e`;
    if (Array.isArray(emails) && emails.length > 0) {
      const encodedEmails = emails.map((email) => {
        const parsedEmail = Mail.parseMail(body);
        const encodedEmail = Mail.encodeEmail(
          email,
          from,
          subject,
          parsedEmail
        );
        return encodedEmail;
      });
      this.addToQueue(encodedEmails, userId, campaignProspectIds);
    }
  };

  static sendEmailRoute = async (req, res) => {
    const stepId = req.body.id;
    const step = await db.Step.findOne({ where: { id: stepId } });
    const stepProspects = await db.StepProspect.findAll({ where: { stepId } });
    const campaignProspects = await Promise.all(
      stepProspects.map(async (stepProspect) => {
        return await db.CampaignProspect.findOne({
          where: {
            id: stepProspect.campaignProspectId,
            // contacted: false,
          },
        });
      })
    );
    const prospects = await Promise.all(
      campaignProspects.map(async (campaignProspect) => {
        return await db.Prospect.findOne({
          where: { id: campaignProspect.prospectId },
        });
      })
    );
    const emails = prospects.map((prospect) => prospect.email);
    const campaignProspectIds = stepProspects.map(
      (stepProspect) => stepProspect.campaignProspectId
    );
    const socketObj = {
      open: true,
      sent: 0,
      total: emails.length,
      newQueue: true,
    };
    Cache.setSocketObj(req.currentUser.id, socketObj);
    console.log("CurrentUser ", req.currentUser.id, "Obj ", socketObj);
    const userName = `${req.currentUser.firstName} ${req.currentUser.lastName}`;
    const userId = req.currentUser.id;
    const body = step.body;
    const subject = step.subject;
    console.log("Emails", emails, "\n\n\n");
    this.createEmailsAndAddToQueue(
      emails,
      userName,
      userId,
      body,
      subject,
      campaignProspectIds
    );
    return res.send("ok");
  };
}

EmailQueue.process(async (job, done) => {
  console.log("Job found!");
  const sentMail = await Gmail.sendEmail(job.data.encodedEmail, job.data.token);
  const threadId = sentMail.data.threadId;
  const StepProspect = await db.StepProspect.findOne({
    where: {
      campaignProspectId: job.data.campaignProspectId,
    },
  });
  StepProspect.contacted = true;
  await StepProspect.save();
  console.log(
    "Step prospect updated: ",
    JSON.parse(JSON.stringify(StepProspect))
  );
  const CampaignProspect = await db.CampaignProspect.findOne({
    where: {
      id: job.data.campaignProspectId,
    },
  });
  CampaignProspect.threadId = threadId;
  console.log(
    "Campaign prospect updated",
    JSON.parse(JSON.stringify(CampaignProspect))
  );
  await CampaignProspect.save();
  console.log("New Thread: ", threadId);
  const io = Socket.getInstance();
  const obj = Cache.getSocketObj(job.data.userId);
  obj.sent += 1;
  Cache.setSocketObj(job.data.userId, obj);
  io.to(job.data.userId).emit("sendEmail", obj);
  io.to(job.data.userId).emit("update", true);
  if (obj.sent === obj.total) {
    Cache.deleteSocketObj(job.data.userId);
  }
  done();
});

EmailQueue.on("completed", (job, result) => {
  job.remove();
});

module.exports = Gmail;
