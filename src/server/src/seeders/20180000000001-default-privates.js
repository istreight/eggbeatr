'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Privates', [
            {
                instructorId: 1,
                time: new Date(Date.UTC(0, 0, 0, 9, 0, 0)),
                duration: 30,
                createdAt: new Date(),
        		updatedAt: new Date()
            },
            {
                instructorId: 2,
                time: new Date(Date.UTC(0, 0, 0, 9, 30, 0)),
                duration: 30,
                createdAt: new Date(),
        		updatedAt: new Date()
            },
            {
                instructorId: 3,
                time: new Date(Date.UTC(0, 0, 0, 10, 0, 0)),
                duration: 30,
                createdAt: new Date(),
        		updatedAt: new Date()
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Privates', null, {});
    }
};
