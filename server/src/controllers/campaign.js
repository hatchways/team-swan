const db = require("../../database/models/index");
const BadRequestError = require("../errors/bad-request-error");

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
      }
    });

    if (!campaign) {
      throw new BadRequestError("Campaign does not exist");
    }

    //TODO also get the prospects (use eager loading)

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

    //TODO also delete the prospects many to many relationship

    res.status(200).send();
  };
}

module.exports = CampaignController;
