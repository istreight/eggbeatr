'use strict';

module.exports = (sequelize, DataTypes) => {
    var Grid = sequelize.define('Grid', {
        lessonTimes: DataTypes.ARRAY(DataTypes.STRING)
    }, {});

    Grid.associate = (models) => {
        Grid.belongsTo(models.Header, {
            foreignKey: 'headerId',
            onDelete: 'CASCADE'
        });
    };

    return Grid;
};
