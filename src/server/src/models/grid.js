'use strict';

module.exports = (sequelize, DataTypes) => {
    var Grid = sequelize.define('Grid', {
        startTime: DataTypes.TIME
    }, {});

    Grid.associate = (models) => {
        // associations can be defined here
    };

    return Grid;
};
