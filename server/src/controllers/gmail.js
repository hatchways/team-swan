const { google } = require('googleapis')
const DataBaseConnectionError = require('../errors/database-connection-error')

// The controller for Gmail Client
class Gmail {

    // Get an OAuthClient with configurations
    static get_oAuthClient = () => {
        const client_id = process.env.CLIENT_ID
        const client_secret = process.env.CLIENT_SECRET
        const redirect_uris = 'http://localhost:3000/gmailauth'

        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris);

        return oAuth2Client
    }

    // Responds to route that gets the Authroriztion URL from google
    static getAuthURL = async (req, res) => {

        const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

        try {
            const authUrl = this.get_oAuthClient().generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES,
            });
            return res.send({ route: authUrl });

        } catch (error) {
            console.log(error)
            throw new DataBaseConnectionError
        }
    }

    // Generate token from the code the client gets after authorizing the app
    static generateToken = async (req, res) => {

        const { code } = req.body

        this.get_oAuthClient().getToken(code, (err, token) => {
            if (err) {
                console.error('Error retrieving access token', err);
                return res.status(400).send({
                    "errors": [{
                        "message": "Error Signing In"
                    }]
                })
            }

            req.session = {
                ...req.session,
                token: token
            }

            res.send({ "message": "User authenticated" })
        });
    }

    // Check if there is a token present in session
    static isSignedIn = async (req, res) => {
        if (req.session.token) {
            return res.send({ "message": true })
        } else {
            return res.send({ "message": false })
        }
    }

}

module.exports = Gmail