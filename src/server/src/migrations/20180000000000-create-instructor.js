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
            date_of_hire: {
                defaultValue: Sequelize.NOW,
                type: Sequelize.DATEONLY
            },
            wsi_expiration_date: {
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
