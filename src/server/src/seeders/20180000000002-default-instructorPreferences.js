'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('InstructorPreferences', [
            {
                headerId: 1,
                instructorId: 1,
                lessons: [
                    'Starfish',
                    'Duck',
                    'Sea Turtle',
                    'Sea Otter',
                    'Salamander',
                    'Sunfish',
                    'Crocodile',
                    'Whale'
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                headerId: 1,
                instructorId: 2,
                lessons: [
                    'Level 1',
                    'Level 2',
                    'Level 3',
                    'Level 4',
                    'Level 5',
                    'Level 6',
                    'Level 7',
                    'Level 8',
                    'Level 9',
                    'Level 10'
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                headerId: 1,
                instructorId: 3,
                lessons: [
                    'Basics I',
                    'Basics II',
                    'Strokes'
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('InstructorPreferences', null, {});
    }
};
