'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Instructors', [
            {
                instructor: 'Alfa',
                dateOfHire: new Date('Feb 01 2011'),
                wsiExpirationDate: new Date('Apr 03 2021'),
                createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                instructor: 'Beta',
                dateOfHire: new Date('Jun 05 2012'),
                wsiExpirationDate: new Date('Aug 07 2022'),
                createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                instructor: 'Charlie',
                dateOfHire: new Date('Oct 09 2013'),
                wsiExpirationDate: new Date('Dec 11 2023'),
                createdAt: new Date(),
				updatedAt: new Date()
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Instructors', null, {});
    }
};
