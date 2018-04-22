'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Instructors', [
            {
                instructor: 'Alfa',
                date_of_hire: new Date('Feb 01 2011'),
                wsi_expiration_date: new Date('Apr 03 2021'),
                createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                instructor: 'Beta',
                date_of_hire: new Date('Jun 05 2012'),
                wsi_expiration_date: new Date('Aug 07 2022'),
                createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                instructor: 'Charlie',
                date_of_hire: new Date('Oct 09 2013'),
                wsi_expiration_date: new Date('Dec 11 2023'),
                createdAt: new Date(),
				updatedAt: new Date()
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Instructors', null, {});
    }
};
