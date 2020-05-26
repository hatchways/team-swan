"use strict";
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Steps", {
      order: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      campaignId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "Campaigns",
          key: "id"
        }
      },
      subject: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: '"Subject" is required'
          }
        }
      },
      body: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: '"Body" is required'
          }
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
    }),

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Steps");
  }
};
