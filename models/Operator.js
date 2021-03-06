'use strict';
module.exports = (sequelize, DataTypes) => {
  const Operator = sequelize.define('Operator', {
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
  }, {});
  Operator.associate = function(models) {
    Operator.hasMany(models.LotPart, {
      foreignKey: 'operatorId',
      sourceKey: 'id',
      as: 'lotParts'
    });
  };
  return Operator;
};