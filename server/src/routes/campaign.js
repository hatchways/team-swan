const router = require("express").Router();
const CampaignController = require("../controllers/campaign");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validate-request");
const requireAuth = require("../middleware/require-auth");

router.get(
  "/api/user/:userId/campaign",
  requireAuth,
  CampaignController.getCampaigns
);

router.get("/api/campaign/:id", requireAuth, CampaignController.getCampaign);

router.post(
  "/api/user/:userId/campaign",
  requireAuth,
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 30 })
      .withMessage("Name should not be greater than 30 characters")
  ],
  validateRequest,
  CampaignController.createCampaign
);

router.delete(
  "/api/campaign/:id",
  requireAuth,
  CampaignController.deleteCampaign
);

module.exports = router;
