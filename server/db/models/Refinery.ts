'use strict';
import Sequelize = require('sequelize'); 
import { getListFieldObj } from '../../lib/ModelUtils'; 

module.exports = function(sequelize, DataTypes:Sequelize.DataTypes) {
  const Refinery = sequelize.define('Refinery', {
        name: {
          type: DataTypes.STRING,
          allowNull: true
        }, 
        address: {
          type: DataTypes.STRING,
          allowNull: true
        }, 
		telephones_text: {
			type: DataTypes.TEXT,
			allowNull: true,
            invisible: true 
		},
        telephones: getListFieldObj('telephones_text'),
        capacity: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        info: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    }, 
    {  
        underscored: true,
        tableName: 'refineries'
    }
  );
  return Refinery;
};