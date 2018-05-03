'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Grids', [{
            lessonTimes: ["9:00:00", "9:30:00", "10:00:00", "10:30:00", "11:00:00"],
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Grids', null, {});
    }
};
