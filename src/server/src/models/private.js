'use strict';
module.exports = (sequelize, DataTypes) => {
  var Private = sequelize.define('Private', {
    instructor: DataTypes.STRING,
    time: DataTypes.TIME,
    duration: DataTypes.INTEGER,
    include: DataTypes.BOOLEAN
  }, {});
  Private.associate = (models) => {
      Private.belongsTo(models.Instructor, {
          foreignKey: 'instructorId',
          onDelete: 'CASCADE'
      });
  };
  return Private;
};
