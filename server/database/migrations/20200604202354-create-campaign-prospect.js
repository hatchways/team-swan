"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("CampaignProspects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      prospectId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Prospects",
          key: "id",
        },
      },
      campaignId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Campaigns",
          key: "id",
        },
      },
      state: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: "pending",
        validate: {
          isIn: {
            args: [["pending", "active"]],
            msg: "Invalid status type",
          },
        },
      },
      threadId: {
        allowNull: true,
        type: Sequelize.STRING,
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
