"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert(
      "Prospects",
      [
        {
          email: "demo@demo.com",
          status: "open",
          firstName: "John",
          lastName: "Doe",
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: "agadberr@gmail.com",
          status: "responded",
          firstName: "Aidan",
          lastName: "Gadberry",
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Prospects", null, {});
  }
};
