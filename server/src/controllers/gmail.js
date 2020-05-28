const { google } = require('googleapis')

// The controller for Gmail Client
class Gmail {

    // Get an OAuthClient with configurations
    static get_oAuthClient = () => {
        const client_id = '965872046245-vp27117p6epf8l47lkcgp5vluupushet.apps.googleusercontent.com'
        const client_secret = 'rndhg5Avyv38L5c3jttixG7U'
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