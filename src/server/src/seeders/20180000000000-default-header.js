'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Headers', [
          {
              setTitle: 'Saturday',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              setTitle: 'Sunday',
              createdAt: new Date(),
              updatedAt: new Date()
          }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Headers', null, {});
  }
};
