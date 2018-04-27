'use strict';

module.exports = (sequelize, DataTypes) => {
    var Grid = sequelize.define('Grid', {
        lessonTimes: DataTypes.ARRAY(DataTypes.STRING)
    }, {});

    Grid.associate = (models) => {
        // associations can be defined here
    };

    return Grid;
};
