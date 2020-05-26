const db = require("../../database/models/index");
const BadRequestError = require("../errors/bad-request-error");
const Op = db.Sequelize.Op;

class CampaignController {
  static getCampaigns = async (req, res) => {
    const campaigns = await db.Campaign.findAll({
      where: {
        userId: req.currentUser.id
      }
    });

    res.send(campaigns);
  };

  static getCampaign = async (req, res) => {
    const campaign = await db.Campaign.findOne({
      where: {
        id: req.params.id,
        userId: req.currentUser.id
      },
      include: db.Prospect
    });

    if (!campaign) {
      throw new BadRequestError("Campaign does not exist");
    }

    res.send(campaign);
  };

  static createCampaign = async (req, res) => {
    const newCampaign = await db.Campaign.create({
      name: req.body.name,
      userId: req.currentUser.id
    });

    res.status(201).send(newCampaign);
  };

  static addProspects = async (req, res) => {
    const campaign = await db.Campaign.findOne({
      where: {
        id: req.params.id,
        userId: req.currentUser.id
      }
    });

    if (!campaign) {
      throw new BadRequestError("Campaign does not exist");
    }

    const prospects = await db.Prospect.findAll({
      where: {
        id: {
          [Op.in]: req.body.prospects
        },
        userId: req.currentUser.id
      }
    });

    const newCampaignProspects = await campaign.addProspects(prospects);

    res.send(newCampaignProspects);
  };

  static deleteCampaign = async (req, res) => {
    const campaign = await db.Campaign.findOne({
      where: {
        id: req.params.id,
        userId: req.currentUser.id
      }
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
        id: req.params.id
      },
      include: db.Step
    });

    if (!campaign) {
      throw new BadRequestError("Campaign does not exist");
    }

    let nextOrder = 1;
    if (campaign.Steps.length > 0) {
      const stepOrders = campaign.Steps.map((step) => step.order);
      nextOrder = Math.max(...stepOrders) + 1;
    }

    const step = await db.Step.create({
      order: nextOrder,
      campaignId: campaign.id
    });

    const template = await db.Template.create({
      subject: req.body.subject,
      body: req.body.body,
      stepId: step.id
    });

    res.status(201).send(step); //Should not send a an object just 201
  };

  static updateStep = async (req, res) => {
    const step = await db.Step.findOne({
      where: {
        id: req.params.id
      },
      include: db.Template
    });

    if (!step) {
      throw new BadRequestError("Step does not exist");
    }

    const template = await step.Template.update({
      subject: req.body.subject,
      body: req.body.body
    });

    res.send(template);
  };
}

module.exports = CampaignController;
