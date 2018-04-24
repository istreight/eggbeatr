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
            instructorId: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Instructors',
                    key: 'id',
                    as: 'instructorId',
                }
            },
            instructor: {
                allowNull: false,
                type: Sequelize.STRING
            },
            time: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.TIME
            },
            duration: {
                defaultValue: 30,
                type: Sequelize.INTEGER
            },
            include: {
                defaultValue: false,
                type: Sequelize.BOOLEAN
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Privates');
    }
};