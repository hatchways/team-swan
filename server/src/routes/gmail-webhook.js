const router = require("express").Router();
const Gmail = require("../controllers/gmail");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validate-request");
const requireAuth = require("../middleware/require-auth");

router.get("/api/gmail/emailResponse", Gmail.emailResponse);

module.exports = router;
