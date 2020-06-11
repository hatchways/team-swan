// A router that handles all gmail auth routes
const router = require("express").Router();
const Gmail = require("../controllers/gmail");
const requireAuth = require("../middleware/require-auth");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validate-request");

router.get("/gmail/authurl", requireAuth, Gmail.getAuthURL);
router.post("/gmail/token", requireAuth, Gmail.generateToken);
// This is a temporary route future requests should directly use the controller rather than this route
router.post("/gmail/sendEmails", requireAuth, Gmail.tempRouteSendEmail);

router.post("/api/gmail/emailResponse", Gmail.emailResponse);

// DELETE LATER - debugging to stop getting notification
router.get("/api/gmail/stop", Gmail.stop);

module.exports = router;
