/** @format */
"use strict";
module.exports = (sequelize, DataTypes) => {
    var Private = sequelize.define("Private", {
        duration: DataTypes.INTEGER
        , time: DataTypes.TIME
    }, {});
    Private.associate = (models) => {
        Private.belongsTo(models.Header, {
            foreignKey: "headerId"
            , onDelete: "CASCADE"
        });
        Private.belongsTo(models.Instructor, {
            foreignKey: "instructorId"
            , onDelete: "CASCADE"
        });
    };
    return Private;
};