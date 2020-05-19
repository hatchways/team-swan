'use strict';
module.exports = (sequelize, DataTypes) => {
  const Prospect = sequelize.define('Prospect', {
    email: DataTypes.STRING,
    status: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  Prospect.associate = function(models) {
    // associations can be defined here
  };
  return Prospect;
};