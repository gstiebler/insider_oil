'use strict';

import Sequelize = require('sequelize');
import { getListFieldObj } from '../../lib/ModelUtils';

module.exports = function(sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) {
  var Company = sequelize.define('Company', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        address: {
          type: DataTypes.STRING,
          allowNull: true
        },
        logo: {
          type: DataTypes.BLOB,
          allowNull: true
        },
        site: {
          type: DataTypes.STRING,
          allowNull: true
        },
        // internal field to store values from the telephones field
        telephones_text: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        telephones: getListFieldObj('telephones_text'),
				segments_text: {
					type: DataTypes.TEXT('tiny'),
					allowNull: true
				},
        // internal field to store values from the segments field
        segments: getListFieldObj('segments_text'),
    }, 
    {
        underscored: true,
        tableName: 'companies',
        classMethods: {
            associate: function(models) {
                Company.belongsTo(models.Person, { as: 'main_person' } );
            }
        }
    }
  );
  return Company;
};