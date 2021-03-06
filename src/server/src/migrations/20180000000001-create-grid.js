'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Grids', {
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
            duration: {
                allowNull: false,
                type: Sequelize.FLOAT
            },
            lessonTimes: {
                allowNull: false,
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
    down: (queryInterface) => {
        return queryInterface.dropTable('Grids');
    }
};
