const db = require('../../database/models/index');
const BadRequestError = require('../errors/bad-request-error');
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
      include: [db.Prospect, db.Step],
      order: [[db.Step, 'order', 'ASC']]
    });

    if (!campaign) {
      throw new BadRequestError('Campaign does not exist');
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
      throw new BadRequestError('Campaign does not exist');
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
      throw new BadRequestError('Campaign does not exist');
    }

    await campaign.destroy();

    res.status(200).send();
  };

  static addStep = async (req, res) => {
    const campaign = await db.Campaign.findOne({
      where: {
        id: req.params.id,
        userId: req.currentUser.id
      },
      include: db.Step
    });

    if (!campaign) {
      throw new BadRequestError('Campaign does not exist');
    }

    let nextOrder = 1;
    if (campaign.Steps.length > 0) {
      nextOrder = campaign.Steps.length + 1;
    }

    const step = await db.Step.create({
      order: nextOrder,
      campaignId: campaign.id,
      subject: req.body.subject,
      body: req.body.body
    });

    res.status(201).send(step);
  };

  static updateStep = async (req, res) => {
    const campaign = await db.Campaign.findOne({
      where: {
        id: req.params.id,
        userId: req.currentUser.id
      },
      include: {
        model: db.Step,
        required: false,
        where: {
          order: req.params.order
        }
      }
    });

    if (!campaign) throw new BadRequestError('Campaign does not exist');

    const step = campaign.Steps[0];

    if (!step) throw new BadRequestError('Step does not exist');

    const updatedStep = await step.update({
      subject: req.body.subject,
      body: req.body.body
    });

    res.send(updatedStep);
  };

  static getStep = async (req, res) => {
    const step = await db.Step.findOne({
      where: {
        order: req.params.order,
        campaignId: req.currentUser.id
      }
    });

    if (!step) throw new BadRequestError('Step does not exist');

    res.send(step);
  };
}

module.exports = CampaignController;
