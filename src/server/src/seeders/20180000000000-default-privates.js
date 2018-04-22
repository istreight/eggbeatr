'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Privates', [
            {
                instructor: 'Alfa',
                time: new Date(Date.UTC(0, 0, 0, 9, 0, 0)),
                duration: 30,
                include: false,
                createdAt: new Date(),
        		updatedAt: new Date()
            },
            {
                instructor: 'Beta',
                time: new Date(Date.UTC(0, 0, 0, 9, 30, 0)),
                duration: 30,
                include: false,
                createdAt: new Date(),
        		updatedAt: new Date()
            },
            {
                instructor: 'Charlie',
                time: new Date(Date.UTC(0, 0, 0, 10, 0, 0)),
                duration: 30,
                include: false,
                createdAt: new Date(),
        		updatedAt: new Date()
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Privates', null, {});
    }
};
