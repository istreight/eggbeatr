'use strict';

module.exports = (sequelize, DataTypes) => {
    var InstructorPreference = sequelize.define('InstructorPreference', {
        instructor: DataTypes.STRING,
        lessons: DataTypes.ARRAY(DataTypes.STRING)
    }, {});

    InstructorPreference.associate = (models) => {
        InstructorPreference.belongsTo(models.Instructor, {
            foreignKey: 'instructorId'
        });
    };

    return InstructorPreference;
};
