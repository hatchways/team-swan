const router = require("express").Router();
const CampaignController = require("../controllers/campaign");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validate-request");
const requireAuth = require("../middleware/require-auth");

router.get("/api/campaign", requireAuth, CampaignController.getCampaigns);

router.get("/api/campaign/:id", requireAuth, CampaignController.getCampaign);

router.post(
  "/api/campaign",
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

router.post(
  "/api/campaign/:id/addProspects",
  [body("prospects").notEmpty().withMessage("Prospects is required")],
  validateRequest,
  requireAuth,
  CampaignController.addProspects
);

router.post(
  "/api/campaign/:id/step",
  requireAuth,
  [
    body("subject").notEmpty().withMessage("Subject is required"),
    body("body").notEmpty().withMessage("Body is required")
  ],
  validateRequest,
  CampaignController.addStep
);

router.put(
  "/api/step/:id",
  requireAuth,
  [
    body("subject").notEmpty().withMessage("Subject is required"),
    body("body").notEmpty().withMessage("Body is required")
  ],
  validateRequest,
  CampaignController.updateStep
);

//DELETE THIS
const db = require("../../database/models");
router.get("/api/step", async (req, res) => {
  const steps = await db.Step.findAll({ include: db.Template });
  const campaigns = await db.Campaign.findAll({ include: db.Step });

  console.log(db.Campaign);
  res.send(campaigns);
});

module.exports = router;
