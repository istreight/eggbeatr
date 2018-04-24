'use strict';

module.exports = (sequelize, DataTypes) => {
    var Lesson = sequelize.define('Lesson', {
        title: DataTypes.STRING,
        quantity: DataTypes.INTEGER
    }, {});

    Lesson.associate = (models) => {
        // associations can be defined here
    };

    return Lesson;
};
