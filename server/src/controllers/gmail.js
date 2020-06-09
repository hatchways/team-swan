const { google } = require("googleapis");
const DataBaseConnectionError = require("../errors/database-connection-error");
const db = require("../../database/models/index");

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
          labelIds: ["UNREAD"],
          labelFilterAction: "include",
          topicName: "projects/exercisereactredux/topics/gmailResponse",
        },
      });

      await db.Token.create({
        ...token,
        userId: req.currentUser.id,
        googleEmailAddress: gmailProfileResponse.data.emailAddress,
        gmailStartHistoryId: gmailWatchResponse.data.historyId,
      });

      console.log(gmailWatchResponse.data);
      res.send({ message: "User authenticated" });
    });
  };

  // Check if there is a token present in session
  static isSignedIn = async (req, res) => {
    const token = await db.Token.findOne({
      where: {
        userId: req.currentUser.id,
      },
    });

    if (token) {
      console.log("True");
      return res.send({ message: true });
    } else {
      return res.send({ message: false });
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
      startHistoryId: token.gmailStartHistoryId,
    });

    const latestHistory =
      gmailHistoryResponse.data.history[
        gmailHistoryResponse.data.history.length - 1
      ];

    console.dir(latestHistory, { depth: null, colors: true });

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
}

module.exports = Gmail;
