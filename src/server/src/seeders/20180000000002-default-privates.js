'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Privates', [
            {
                headerId: 1,
                instructorId: 1,
                duration: 30,
                time: new Date(Date.UTC(0, 0, 0, 9, 0, 0)),
                createdAt: new Date(),
        		updatedAt: new Date()
            },
            {
                headerId: 1,
                instructorId: 2,
                duration: 30,
                time: new Date(Date.UTC(0, 0, 0, 9, 30, 0)),
                createdAt: new Date(),
        		updatedAt: new Date()
            },
            {
                headerId: 1,
                instructorId: 3,
                duration: 30,
                time: new Date(Date.UTC(0, 0, 0, 10, 0, 0)),
                createdAt: new Date(),
        		updatedAt: new Date()
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Privates', null, {});
    }
};
