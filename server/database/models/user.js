// This is the user model which is used to access the Users table
const Password = require("../../src/utils/password");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"First Name" is required'
          }
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"Last Name" is required'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"Email Address" is required'
          },
          isEmail: {
            msg: '"Email Address" is not valid'
          }
        },
        unique: {
          args: true,
          msg: "Email address already in use!"
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"Password" is required'
          }
        }
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      modelName: "User"
    }
  );
  User.associate = function (models) {
    User.hasMany(models.Campaign, { foreignKey: "userId" });
  };

  /**
   * The beforeSave() hook allows us to manipulate data before it is entered in the database
   * It works when the user tries to create a new entry or when the user tries to update an existing entry
   * So before any changes are saved the password is hashed and then set in the database using the Password utility class
   */
  User.beforeSave(async (user) => {
    const hashed = await Password.toHash(user.password);
    user.password = hashed;
  });

  /**
   * The prototype.toJSON is a function that controls what is returned to user when a query is made
   * By default we don't want to share more information from here but
   * If we need to get any field value we could always refernce .dataValues property after the call or
   * remove it from here to be applied on every query made
   */
  User.prototype.toJSON = function () {
    var values = Object.assign({}, this.get());
    delete values.password;
    delete values.createdAt;
    delete values.updatedAt;
    delete values.lastName;
    delete values.firstName;
    return values;
  };

  return User;
};
