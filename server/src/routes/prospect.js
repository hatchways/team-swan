const router = require("express").Router();
const ProspectController = require("../controllers/prospects");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validate-request");
const requireAuth = require("../middleware/require-auth");

/**
 * A route that finds prospects for a given user id

 */
router.get(
  "/api/user/:id/prospects",
  ProspectController.userProspects
);


router.patch(
  "/api/prospect/:id",
  [
    body("status")
      .isIn(["open", "responded", "unsubscribed"])
      .withMessage("Invalid status type")
  ],
  validateRequest,
  requireAuth,
  ProspectController.updateProspect
);


router.delete(
  "/api/prospect/:id",
  requireAuth,
  ProspectController.deleteProspect
);

module.exports = router;