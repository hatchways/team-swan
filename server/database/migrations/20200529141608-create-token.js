"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Tokens", {
      googleEmailAddress: {
        type: Sequelize.STRING,
      },
      access_token: {
        type: Sequelize.STRING,
      },
      refresh_token: {
        type: Sequelize.STRING,
      },
      scope: {
        type: Sequelize.STRING,
      },
      token_type: {
        type: Sequelize.STRING,
      },
      expiry_date: {
        type: Sequelize.BIGINT,
      },
      gmailStartHistoryId: {
        type: Sequelize.INTEGER,
      },
      userId: {
        primaryKey: true,
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable("Tokens");
  },
};
