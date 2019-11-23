/** @format */
"use strict";
module.exports = (sequelize, DataTypes) => {
    var Lesson = sequelize.define("Lesson", {
        quantity: DataTypes.INTEGER
        , title: DataTypes.STRING
    }, {});
    Lesson.associate = (models) => {
        Lesson.belongsTo(models.Header, {
            foreignKey: "headerId"
            , onDelete: "CASCADE"
        });
    };
    return Lesson;
};