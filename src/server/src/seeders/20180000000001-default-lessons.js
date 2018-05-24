'use strict';

var defaultValue = process.env.DEFAULTVALUE || 1;

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Lessons', [
            {
                headerId: 1,
                quantity: defaultValue,
                title: 'Starfish',
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                headerId: 1,
                quantity: 0,
                title: 'Duck',
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                headerId: 1,
                quantity: 0,
                title: 'Sea Turtle',
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                headerId: 1,
                quantity: defaultValue,
                title: 'Sea Otter',
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                headerId: 1,
                quantity: 0,
                title: 'Salamander',
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                headerId: 1,
                quantity: 0,
                title: 'Sunfish',
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                headerId: 1,
                quantity: 0,
                title: 'Crocodile',
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                headerId: 1,
                quantity: 0,
                title: 'Whale',
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                headerId: 1,
                quantity: defaultValue,
                title: 'Level 1',
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                headerId: 1,
                quantity: 0,
                title: 'Level 2',
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                headerId: 1,
                quantity: 0,
                title: 'Level 3',
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                headerId: 1,
                quantity: 0,
                title: 'Level 4',
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                headerId: 1,
                quantity: 0,
                title: 'Level 5',
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                headerId: 1,
                quantity: defaultValue,
                title: 'Level 6',
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                headerId: 1,
                quantity: 0,
                title: 'Level 7',
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                headerId: 1,
                quantity: 0,
                title: 'Level 8',
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                headerId: 1,
                quantity: 0,
                title: 'Level 9',
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                headerId: 1,
                quantity: 0,
                title: 'Level 10',
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                headerId: 1,
                quantity: defaultValue,
                title: 'Basics I',
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                headerId: 1,
                quantity: 0,
                title: 'Basics II',
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                headerId: 1,
                quantity: 0,
                title: 'Strokes',
				createdAt: new Date(),
				updatedAt: new Date()
            }
        ], {});
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Lessons', null, {});
    }
};
