'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Grids', [{
            start_time: new Date(Date.UTC(0, 0, 0, 9, 0, 0)),
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Grids', null, {});
    }
};
