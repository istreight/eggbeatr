'use strict';

module.exports = (sequelize, DataTypes) => {
    var Private = sequelize.define('Private', {
        time: DataTypes.TIME,
        duration: DataTypes.INTEGER
    }, {});

    Private.associate = (models) => {
        Private.belongsTo(models.Instructor, {
            foreignKey: 'instructorId',
            onDelete: 'CASCADE'
        });
    };

    return Private;
};
