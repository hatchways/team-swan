"use strict";
module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    "Token",
    {
      access_token: DataTypes.STRING,
      refresh_token: DataTypes.STRING,
      scope: DataTypes.STRING,
      token_type: DataTypes.STRING,
      expiry_date: DataTypes.BIGINT,
      userId: DataTypes.INTEGER,
    },
    {}
  );
  Token.associate = function (models) {
    // associations can be defined here
  };
  return Token;
};
