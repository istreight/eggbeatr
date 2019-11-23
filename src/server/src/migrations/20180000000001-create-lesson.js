/** @format */
"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("Lessons", {
            id: {
                allowNull: false
                , autoIncrement: true
                , primaryKey: true
                , type: Sequelize.INTEGER
            }
            , headerId: {
                allowNull: false
                , type: Sequelize.INTEGER
                , onDelete: "CASCADE"
                , references: {
                    model: "Headers"
                    , key: "id"
                    , as: "headerId"
                }
            }
            , quantity: {
                defaultValue: 0
                , type: Sequelize.INTEGER
            }
            , title: {
                allowNull: false
                , type: Sequelize.STRING
            }
            , createdAt: {
                allowNull: false
                , defaultValue: Date.now()
                , type: Sequelize.DATE
            }
            , updatedAt: {
                allowNull: false
                , defaultValue: Date.now()
                , type: Sequelize.DATE
            }
        });
    }
    , down: (queryInterface) => {
        return queryInterface.dropTable("Lessons");
    }
};