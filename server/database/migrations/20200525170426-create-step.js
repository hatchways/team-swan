"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Steps", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      campaignId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Campaigns",
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    return await queryInterface.addIndex("Steps", ["order", "campaignId"], {
      unique: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Steps");
  }
};
