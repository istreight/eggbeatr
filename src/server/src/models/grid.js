/** @format */
"use strict";
module.exports = (sequelize, DataTypes) => {
    var Grid = sequelize.define("Grid", {
        duration: DataTypes.INTEGER
        , lessonTimes: DataTypes.ARRAY(DataTypes.STRING)
    }, {});
    Grid.associate = (models) => {
        Grid.belongsTo(models.Header, {
            foreignKey: "headerId"
            , onDelete: "CASCADE"
        });
    };
    return Grid;
};