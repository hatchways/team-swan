const db = require("../../database/models/index");
const BadRequestError = require("../errors/bad-request-error");
const Op = db.Sequelize.Op;

class CampaignController {
  static getCampaigns = async (req, res) => {
    const campaigns = await db.Campaign.findAll({
      where: {
        userId: req.currentUser.id,
      },
      attributes: {
        include: [
          [
            db.Sequelize.literal(`(
              SELECT COUNT(*) FROM "Steps" 
              WHERE "Steps"."campaignId" = "Campaign"."id")`),
            "stepCount",
          ],
          [
            db.Sequelize.literal(`(
              SELECT COUNT(*) FROM "CampaignProspects" 
              WHERE "CampaignProspects"."campaignId" = "Campaign"."id")`),
            "prospectCount",
          ],
        ],
      },
      order: [["createdAt", "DESC"]],
    });

    res.send(campaigns);
  };

  static getCampaign = async (req, res) => {
    const campaign = await db.Campaign.findOne({
      where: {
        id: req.params.id,
        userId: req.currentUser.id,
      },
      attributes: {
        include: [
          [
            db.Sequelize.literal(`(
              SELECT COUNT(*) FROM "CampaignProspects" 
              WHERE "CampaignProspects"."campaignId" = "Campaign"."id" 
              AND  "CampaignProspects"."state" = 'pending' )`),
            "pendingCount",
          ],
          [
            db.Sequelize.literal(`(
              SELECT COUNT(*) FROM "CampaignProspects" 
              WHERE "CampaignProspects"."campaignId" = "Campaign"."id" 
              AND  "CampaignProspects"."state" = 'active' )`),
            "activeCount",
          ],
          [
            db.Sequelize.literal(`(
              SELECT COUNT(*) FROM "StepProspects"
              JOIN "CampaignProspects"
              ON "CampaignProspects"."id" = "StepProspects"."campaignProspectId"
              WHERE "CampaignProspects"."campaignId" = "Campaign"."id"
              AND  "StepProspects"."replied" = true )`),
            "repliedCount",
          ],
          [
            db.Sequelize.literal(`(
              SELECT COUNT(*) FROM "StepProspects"
              JOIN "CampaignProspects"
              ON "CampaignProspects"."id" = "StepProspects"."campaignProspectId"
              WHERE "CampaignProspects"."campaignId" = "Campaign"."id"
              AND  "StepProspects"."contacted" = true )`),
            "contactedCount",
          ],
        ],
      },
      include: [
        { model: db.Prospect },
        {
          model: db.Step,
          attributes: {
            include: [
              [
                db.Sequelize.literal(`(
                  SELECT COUNT(*) FROM "StepProspects" 
                  WHERE "StepProspects"."stepId" = "Steps"."id" 
                  AND "StepProspects"."currentStep" = true)`),
                "prospectCount",
              ],
              [
                db.Sequelize.literal(`(
                  SELECT COUNT(*) FROM "StepProspects" 
                  WHERE "StepProspects"."stepId" = "Steps"."id" 
                  AND "StepProspects"."replied" = true)`),
                "repliedCount",
              ],
              [
                db.Sequelize.literal(`(
                  SELECT COUNT(*) FROM "StepProspects" 
                  WHERE "StepProspects"."stepId" = "Steps"."id" 
                  AND "StepProspects"."contacted" = true)`),
                "contactedCount",
              ],
            ],
          },
        },
      ],
      order: [[db.Step, "order", "ASC"]],
    });

    if (!campaign) {
      throw new BadRequestError("Campaign does not exist");
    }

    res.send(campaign);
  };

  static createCampaign = async (req, res) => {
    const newCampaign = await db.Campaign.create({
      name: req.body.name,
      userId: req.currentUser.id,
    });

    res.status(201).send(newCampaign);
  };

  static addProspects = async (req, res) => {
    const campaign = await db.Campaign.findOne({
      where: {
        id: req.params.id,
        userId: req.currentUser.id,
      },
    });

    if (!campaign) {
      throw new BadRequestError("Campaign does not exist");
    }

    const prospects = await db.Prospect.findAll({
      where: {
        id: {
          [Op.in]: req.body.prospects,
        },
        userId: req.currentUser.id,
      },
    });

    const newCampaignProspects = await campaign.addProspects(prospects);

    res.send(newCampaignProspects);
  };

  static deleteCampaign = async (req, res) => {
    const campaign = await db.Campaign.findOne({
      where: {
        id: req.params.id,
        userId: req.currentUser.id,
      },
    });

    if (!campaign) {
      throw new BadRequestError("Campaign does not exist");
    }

    await campaign.destroy();

    res.status(200).send();
  };

  static addStep = async (req, res) => {
    const campaign = await db.Campaign.findOne({
      where: {
        id: req.params.id,
        userId: req.currentUser.id,
      },
      include: db.Step,
    });

    if (!campaign) {
      throw new BadRequestError("Campaign does not exist");
    }

    let nextOrder = 1;
    if (campaign.Steps.length > 0) {
      nextOrder = campaign.Steps.length + 1;
    }

    if (nextOrder === 1) {
      if (!req.body.subject.trim()) {
        throw new BadRequestError("Subject is required for the first step");
      }
    }

    const step = await db.Step.create({
      order: nextOrder,
      campaignId: campaign.id,
      subject: req.body.subject,
      body: req.body.body,
    });

    res.status(201).send(step);
  };

  static updateStep = async (req, res) => {
    const step = await db.Step.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!step) throw new BadRequestError("Step does not exist");

    const updatedStep = await step.update({
      subject: req.body.subject,
      body: req.body.body,
    });

    res.send(updatedStep);
  };

  static getStep = async (req, res) => {
    const step = await db.Step.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!step) throw new BadRequestError("Step does not exist");

    res.send(step);
  };

  static movePropectsToStep = async (req, res) => {
    const step = await db.Step.findOne({
      where: {
        id: req.params.stepId,
      },
    });

    if (!step) throw new BadRequestError("Step does not exist");

    let campaignProspects = [];

    if (step.order === 1) {
      // Get the campaign prospects that are in pending
      campaignProspects = await db.CampaignProspect.findAll({
        attributes: ["id"],
        where: {
          campaignId: req.params.campaignId,
          state: "pending",
        },
        include: [
          {
            model: db.StepProspect,
            attributes: [],
            include: [{ model: db.Step, attributes: [] }],
          },
        ],
      });
    } else {
      const previousStep = step.order - 1;

      // Get the campaign prospects that are in the previous steps
      campaignProspects = await db.CampaignProspect.findAll({
        attributes: ["id"],
        where: {
          campaignId: req.params.campaignId,
          [Op.and]: [
            { "$StepProspects.currentStep$": true },
            { "$StepProspects.replied$": true },
            { "$StepProspects.Step.order$": previousStep },
          ],
        },
        include: [
          {
            model: db.StepProspect,
            attributes: [],
            include: [{ model: db.Step, attributes: [] }],
          },
        ],
      });
    }

    if (campaignProspects.length === 0)
      throw new BadRequestError("No prospects on previous steps to move");

    // Build Instances of step prospect model
    const stepProspects = campaignProspects.map((campaignProspect) => {
      return {
        campaignProspectId: campaignProspect.id,
        stepId: step.id,
        contacted: false,
        replied: false,
        currentStep: true,
      };
    });

    // Set prospect to next step
    const newStepProspects = await db.StepProspect.bulkCreate(stepProspects, {
      returning: true,
    });

    // Update campaign prospect from pending to active
    await db.CampaignProspect.update(
      { state: "active" },
      {
        where: {
          id: {
            [Op.in]: campaignProspects.map(
              (campaignProspect) => campaignProspect.id
            ),
          },
        },
      }
    );

    // Update previous step currentStep to false
    await db.StepProspect.update(
      { currentStep: false },
      {
        where: {
          campaignProspectId: {
            [Op.in]: campaignProspects.map(
              (campaignProspect) => campaignProspect.id
            ),
          },
          stepId: {
            [Op.not]: step.id,
          },
        },
      }
    );

    res.send(campaignProspects);
  };
}

module.exports = CampaignController;
