'use strict';

import Sequelize = require('sequelize');
import { getListFieldObj, saveImage } from '../../lib/ModelUtils';

function savePhoto(company) {
	  saveImage(company.logo, 'Company', company.id);
}

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
        // this field do not exists on DB. It's only here to 
        // facilitate photo upload
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
        },
        hooks: {
            afterCreate: savePhoto,
            beforeUpdate: savePhoto
        }
    }
  );
  return Company;
};