'use strict';
import Sequelize = require('sequelize');
import { getListFieldObj } from '../../lib/ModelUtils';

module.exports = function (sequelize, DataTypes: Sequelize.DataTypes) {
  const Terminal = sequelize.define('Terminal', {
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('ONSHORE', 'OFFSHORE'),
      allowNull: false
    }, 
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    info: { 
      type: DataTypes.TEXT, 
      allowNull: true
    },
  },
    {
      underscored: true,
      tableName: 'terminals'
    }
  );
  return Terminal;
};