// A router that handles all gmail auth routes
const router = require("express").Router();
const Gmail = require("../controllers/gmail");
const requireAuth = require("../middleware/require-auth");

router.get("/gmail/authurl", requireAuth, Gmail.getAuthURL);
router.post("/gmail/token", requireAuth, Gmail.generateToken);
router.get("/gmail/authenticated", requireAuth, Gmail.isSignedIn);

module.exports = router;
