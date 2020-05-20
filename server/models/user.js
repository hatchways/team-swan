'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstName: {
      type: Sequelize.STRING,
        allowNull: false,   
        validate: {
            notEmpty: {
                msg: '"First Name" is required'
            },
        },   
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,  
      validate: {
          notEmpty: {
              msg: '"Last Name" is required'
          },
      },    
    },
    email: {
      type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: '"Email Address" is required'
            },
            isEmail: {
                msg: '"Email Address" is not valid'
            }, 
        }, 
        unique: {
            args: true,
            msg: 'Email address already in use!'
        },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,   
      validate: {
          notEmpty: {
              msg: '"Password" is required'
          },
      },   
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
 }, {
  sequelize,
  modelName: 'User'
 });
  User.associate = function(models) {
    User.hasMany(models.Prospect)
  };
  return User;
};