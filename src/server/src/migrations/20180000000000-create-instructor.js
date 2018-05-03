'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Instructors', {
                id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            instructor: {
                allowNull: false,
                type: Sequelize.STRING
            },
            dateOfHire: {
                allowNull: false,
                defaultValue: Sequelize.NOW,
                type: Sequelize.DATEONLY
            },
            wsiExpiration: {
                allowNull: false,
                defaultValue: Sequelize.NOW,
                type: Sequelize.DATEONLY
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
        return queryInterface.dropTable('Instructors');
    }
};
