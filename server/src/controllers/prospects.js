const db = require("../../database/models/index");
const BadRequestError = require("../errors/bad-request-error");
require("dotenv").config();

class ProspectController {
  // The userProspects route controller
  static userProspects = async (req, res) => {
    console.log("prospect controller");
    const { id } = req.params;

    const user = await db.User.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new BadRequestError("User not found");
    }

    const prospects = await user.getProspects();
    return res.status(200).send(prospects);
  };

  // The updateProspect route controller
  static updateProspect = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const prospect = await db.Prospect.findOne({
      where: {
        id,
      },
    });
    const user = await db.User.findOne({
      where: {
        id,
      },
    });

    if (!prospect) {
      throw new BadRequestError("Prospect not found");
    }

    try {
      const updatedProspect = await prospect.update({
        status,
      });

      return res.status(200).send(updatedProspect);
    } catch (err) {
      throw new BadRequestError("Prospect update failed");
    }
  };

  // The deleteProspect route controller
  static deleteProspect = async (req, res) => {
    const { id } = req.params;

    const prospect = await db.Prospect.findOne({
      where: {
        id,
      },
    });

    if (!prospect) {
      throw new BadRequestError("Prospect not found");
    }

    try {
      const result = await prospect.destroy();
      console.log(result);
      return res.status(200).send(`Prospect with id ${id} deleted`);
    } catch (err) {
      throw new BadRequestError("Prospect deletion failed");
    }
  };
}

module.exports = ProspectController;
