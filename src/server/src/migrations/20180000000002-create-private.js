'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Privates', {
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
            duration: {
                allowNull: false,
                defaultValue: 30,
                type: Sequelize.INTEGER
            },
            time: {
                allowNull: false,
                type: Sequelize.TIME
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
    down: (queryInterface) => {
        return queryInterface.dropTable('Privates');
    }
};
