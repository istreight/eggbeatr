'use strict';

module.exports = (sequelize, DataTypes) => {
    var Instructor = sequelize.define('Instructor', {
        instructor: DataTypes.STRING,
        dateOfHire: DataTypes.DATEONLY,
        wsiExpiration: DataTypes.DATEONLY
    }, {});

    Instructor.associate = (models) => {
        Instructor.hasMany(models.InstructorPreference, {
            foreignKey: 'instructorId',
            as: 'instructorPreferences'
        });
        Instructor.hasMany(models.Private, {
            foreignKey: 'instructorId',
            as: 'privates'
        });
    };

    return Instructor;
};
