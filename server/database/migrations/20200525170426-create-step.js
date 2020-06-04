"use strict";
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Steps", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      order: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      campaignId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Campaigns",
          key: "id",
        },
      },
      subject: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: '"Subject" is required',
          },
        },
      },
      body: {
        allowNull: false,
        type: Sequelize.TEXT,
        validate: {
          notEmpty: {
            msg: '"Body" is required',
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
    }),

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Steps");
  },
};
