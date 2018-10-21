'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('InstructorPreferences', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            headerId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: 'CASCADE',
                references: {
                    model: 'Headers',
                    key: 'id',
                    as: 'headerId',
                }
            },
            instructorId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: 'CASCADE',
                references: {
                    model: 'Instructors',
                    key: 'id',
                    as: 'instructorId',
                }
            },
            lessons: {
                defaultValue: [],
                type: Sequelize.ARRAY(Sequelize.STRING)
            },
            createdAt: {
                allowNull: false,
                defaultValue: Date.now(),
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                defaultValue: Date.now(),
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('InstructorPreferences');
    }
};
