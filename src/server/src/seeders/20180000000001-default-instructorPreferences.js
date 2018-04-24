'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('InstructorPreferences', [
            {
                lessons: [
                    'Starfish',
                    'Duck',
                    'Sea Turtle',
                    'Salamander',
                    'Sunfish',
                    'Crocodile',
                    'Whale'
                ],
                createdAt: new Date(),
                updatedAt: new Date(),
                instructor: 'Alfa',
                instructorId: 1
            },
            {
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
                updatedAt: new Date(),
                instructor: 'Beta',
                instructorId: 2
            },
            {
                lessons: [
                    'Basics 1',
                    'Basics 2',
                    'Strokes'
                ],
                createdAt: new Date(),
                updatedAt: new Date(),
                instructor: 'Charlie',
                instructorId: 3
            }
        ], {});
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('InstructorPreferences', null, {});
    }
};
