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
}

module.exports = CampaignController;
