"use strict";
module.exports = (sequelize, DataTypes) => {
  const Files = sequelize.define(
    "Files",
    {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
      }
    },
    {}
  );
  Files.associate = function (models) {

    Files.belongsTo(models.User)

  };
  return Files;
};
