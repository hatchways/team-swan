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

      await db.Token.create({
        ...token,
        userId: req.currentUser.id,
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
