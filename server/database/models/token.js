"use strict";
module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    "Token",
    {
      googleEmailAddress: DataTypes.STRING,
      access_token: DataTypes.STRING,
      refresh_token: DataTypes.STRING,
      scope: DataTypes.STRING,
      token_type: DataTypes.STRING,
      expiry_date: DataTypes.BIGINT,
      gmailStartHistoryId: DataTypes.INTEGER,
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {}
  );
  Token.associate = function (models) {
    // associations can be defined here
  };
  return Token;
};
