const Password = require("../../src/utils/password");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const getMaxUserIdQuery = await queryInterface.sequelize.query(
      `SELECT MAX(id) FROM "Users";`
    );

    const userId = getMaxUserIdQuery[0][0].max + 1;

    //Insert a user
    await queryInterface.bulkInsert("Users", [
      {
        id: userId,
        firstName: "John",
        lastName: "Doe",
        email: "demo@demo.com",
        password: await Password.toHash("john_doe"),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    //Insert campaign associated to that user
    return await queryInterface.bulkInsert("Campaigns", [
      {
        name: "Campaign1",
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Campaign2",
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Campaign3",
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Campaigns", null, {});
    return await queryInterface.bulkDelete("Users", null, {});
  }
};
