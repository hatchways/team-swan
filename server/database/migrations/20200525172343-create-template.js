"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Templates", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      stepId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Steps",
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
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Templates");
  }
};
