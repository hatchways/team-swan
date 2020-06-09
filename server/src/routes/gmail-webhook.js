const router = require("express").Router();
const Gmail = require("../controllers/gmail");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validate-request");
const requireAuth = require("../middleware/require-auth");

router.post("/api/gmail/emailResponse", Gmail.emailResponse);

//DELETE LATER
router.get("/api/gmail/stop", Gmail.stop);

module.exports = router;
