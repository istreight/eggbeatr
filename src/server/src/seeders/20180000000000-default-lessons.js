'use strict';

var defaultValue = process.env.DEFAULTVALUE || 1;

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Lessons', [
            {
                title: 'Starfish',
                quantity: defaultValue,
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                title: 'Duck',
                quantity: 0,
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                title: 'Sea Turtle',
                quantity: 0,
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                title: 'Sea Otter',
                quantity: defaultValue,
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                title: 'Salamander',
                quantity: 0,
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                title: 'Sunfish',
                quantity: 0,
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                title: 'Crocodile',
                quantity: 0,
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                title: 'Whale',
                quantity: 0,
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                title: 'Level 1',
                quantity: defaultValue,
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                title: 'Level 2',
                quantity: 0,
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                title: 'Level 3',
                quantity: 0,
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                title: 'Level 4',
                quantity: 0,
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                title: 'Level 5',
                quantity: 0,
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                title: 'Level 6',
                quantity: defaultValue,
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                title: 'Level 7',
                quantity: 0,
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                title: 'Level 8',
                quantity: 0,
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                title: 'Level 9',
                quantity: 0,
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                title: 'Level 10',
                quantity: 0,
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                title: 'Basics I',
                quantity: defaultValue,
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                title: 'Basics II',
                quantity: 0,
				createdAt: new Date(),
				updatedAt: new Date()
            },
            {
                title: 'Strokes',
                quantity: 0,
				createdAt: new Date(),
				updatedAt: new Date()
            }
        ], {});
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Lessons', null, {});
    }
};
