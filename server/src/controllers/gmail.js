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

      await db.Token.create({
        ...token,
        userId: req.currentUser.id,
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
      return returnToken;
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
      console.log(err);
      Promise.reject(err.message);
    }
  };

  static addToQueue = async (encodedEmails, userId, stepProspectIds) => {
    let time = 5000;
    const addTime = 5000;
    const token = await this.getToken(userId);
    encodedEmails.forEach(async (endodedEmail, index) => {
      const stepProspectId = stepProspectIds[index];
      const data = { endodedEmail, token, stepProspectId, userId };
      const options = {
        delay: time,
        attempts: 1,
      };
      time = time + addTime;
      await EmailQueue.add(data, options);
    });
  };

  static createEmailsAndAddToQueue = async (
    emails,
    userName,
    userId,
    body,
    subject,
    stepProspectIds
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
      this.addToQueue(encodedEmails, userId, stepProspectIds);
    }
  };

  static sendEmailRoute = async (req, res) => {
    console.log(`\n\n\n---------------\n${req.body}\n\n\n`);
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
    const stepProspectIds = stepProspects.map(
      (stepProspect) => stepProspect.stepId
    );
    const socketObj = {
      open: true,
      sent: 0,
      total: emails.length,
      newQueue: true,
    };
    Cache.setSocketObj(req.currentUser.id, socketObj);
    console.log(emails);
    const userName = `${req.currentUser.firstName} ${req.currentUser.lastName}`;
    const userId = req.currentUser.id;
    const body = step.body;
    const subject = step.subject;
    this.createEmailsAndAddToQueue(
      emails,
      userName,
      userId,
      body,
      subject,
      stepProspectIds
    );
    res.send("ok");
  };
}

EmailQueue.process(async (job, done) => {
  console.log("Job found!");
  const sentMail = await Gmail.sendEmail(job.data.endodedEmail, job.data.token);
  const threadId = sentMail.data.threadId;
  const StepProspect = await db.StepProspect.findOne({
    where: { stepId: job.data.stepProspectId },
  });
  StepProspect.contacted = true;
  await StepProspect.save();
  const CampaignProspect = await db.CampaignProspect.findOne({
    where: { id: StepProspect.campaignProspectId },
  });
  CampaignProspect.threadId = threadId;
  CampaignProspect.save();
  const io = Socket.getInstance();
  const obj = Cache.getSocketObj(job.data.userId);
  console.log("Cache Obj", obj);
  obj.sent += 1;
  Cache.setSocketObj(job.data.userId, obj);
  io.to(job.data.userId).emit("update", true);
  io.to(job.data.userId).emit("send email", obj);
  done();
});

EmailQueue.on("error", (job, result) => {
  job.remove();
});

EmailQueue.on("failed", (job, result) => {
  Cache.deleteSocketObj(job.data.userId);
  job.remove();
});

EmailQueue.on("completed", (job, result) => {
  Cache.clearObj();
  job.remove();
});

module.exports = Gmail;
