const db = require("../../database/models/index");
const BadRequestError = require("../errors/bad-request-error");
const Op = db.Sequelize.Op;

class CampaignController {
  static getCampaigns = async (req, res) => {
    const user = await db.User.findOne({
      where: {
        id: req.params.userId
      }
    });

    if (!user) {
      throw new BadRequestError("User does not exist");
    }

    const campaigns = await user.getCampaigns();

    res.send(campaigns);
  };

  static getCampaign = async (req, res) => {
    const campaign = await db.Campaign.findOne({
      where: {
        id: req.params.id
      },
      include: db.Prospect
    });

    if (!campaign) {
      throw new BadRequestError("Campaign does not exist");
    }

    res.send(campaign);
  };

  static createCampaign = async (req, res) => {
    const user = await db.User.findOne({
      where: {
        id: req.params.userId
      }
    });

    if (!user) {
      throw new BadRequestError("User does not exist");
    }

    const newCampaign = await db.Campaign.create({
      name: req.body.name,
      userId: user.id
    });

    res.status(201).send(newCampaign);
  };

  static addProspects = async (req, res) => {
    const campaign = await db.Campaign.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!campaign) {
      throw new BadRequestError("Campaign does not exist");
    }

    const prospects = await db.Prospect.findAll({
      where: {
        id: {
          [Op.in]: req.body.prospects
        }
      }
    });

    const newCampaignProspects = await campaign.addProspects(prospects);

    res.send(newCampaignProspects);
  };

  static deleteCampaign = async (req, res) => {
    const campaign = await db.Campaign.findOne({
      where: {
        id: req.params.id
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
