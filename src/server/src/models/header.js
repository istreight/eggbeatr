'use strict';

module.exports = (sequelize, DataTypes) => {
    var Header = sequelize.define('Header', {
        setTitle: DataTypes.STRING
    }, {});

    Header.associate = (models) => {
        Header.hasMany(models.Grid, {
            foreignKey: 'headerId',
            as: 'grid'
        });
        Header.hasMany(models.Instructor, {
            foreignKey: 'headerId',
            as: 'instructors'
        });
        Header.hasMany(models.InstructorPreference, {
            foreignKey: 'headerId',
            as: 'instructorPreferences'
        });
        Header.hasMany(models.Lesson, {
            foreignKey: 'headerId',
            as: 'lessons'
        });
        Header.hasMany(models.Private, {
            foreignKey: 'headerId',
            as: 'privates'
        });
    };

    return Header;
};
