"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("CampaignProspects", {
      prospectId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        onDelete: "CASCADE",
        references: {
          model: "Prospects",
          key: "id",
        },
      },
      campaignId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        onDelete: "CASCADE",
        references: {
          model: "Campaigns",
          key: "id",
        },
      },
      step: {
        allowNull: true,
        type: Sequelize.INTEGER,
        onDelete: "SET NULL",
        references: {
          model: "Steps",
          key: "id",
        },
      },
      state: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          isIn: {
            args: [["pending", "active"]],
            msg: "Invalid status type",
          },
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("CampaignProspects");
  },
};
