'use strict';

module.exports = (sequelize, DataTypes) => {
    var InstructorPreference = sequelize.define('InstructorPreference', {
        lessons: DataTypes.ARRAY(DataTypes.STRING)
    }, {});

    InstructorPreference.associate = (models) => {
        InstructorPreference.belongsTo(models.Instructor, {
            foreignKey: 'instructorId',
            onDelete: 'CASCADE'
        });
    };

    return InstructorPreference;
};
