'use strict';
module.exports = (sequelize, DataTypes) => {
  var Instructor = sequelize.define('Instructor', {
    instructor: DataTypes.STRING,
    date_of_hire: DataTypes.DATEONLY,
    wsi_expiration_date: DataTypes.DATEONLY
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
