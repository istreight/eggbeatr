'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Grids', [{
            headerId: 1,
            lessonTimes: ['9:00', '9:30', '10:00', '10:30', '11:00'],
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Grids', null, {});
    }
};
