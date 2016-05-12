'use strict';

import Sequelize = require('sequelize');  
var await = require('../../lib/await');


function updateConcessionaries(db, oilField) {
    const options = { where: { oil_field_id: oilField.id } };
    // remove all records from AmbientalLicenseBlock associated with this ambiental license
    await( db.OilFieldConcessionary.destroy(options) );
    
    const concessionaries:any[] = oilField.dataValues.concessionaries;
    const concessionaries_props:any[] = oilField.dataValues.concessionaries_props;
    if(!concessionaries || !concessionaries_props)
        return null;
        
    if(concessionaries.length != concessionaries_props.length)
        throw 'Tamanhos diferentes de concessionários';
        
    const newConcessionariesRecords = [];
    for(var i = 0; i < concessionaries.length; i++) {
        const ofcRecord = { 
            oil_field_id: oilField.id,
            company_id: concessionaries[i].id,
            prop: concessionaries_props[i]
        };
        newConcessionariesRecords.push(ofcRecord);
    }
    return db.OilFieldConcessionary.bulkCreate(newConcessionariesRecords);
}


function updateFieldsFunc(db) {
    return function (ambientalLicense) {
        updateConcessionaries(db, ambientalLicense);
    }
}


function defineHooks(db) {
	db.OilField.hook('afterCreate', updateFieldsFunc(db));
	db.OilField.hook('beforeUpdate', updateFieldsFunc(db));
}


module.exports = function(sequelize:Sequelize.Sequelize, DataTypes:Sequelize.DataTypes) {
  var OilField = sequelize.define('OilField', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        state: {
          type: DataTypes.STRING,
          allowNull: false
        },
        shore: {
          type: DataTypes.ENUM('on', 'off'),
          allowNull: false
        },
        stage: {
          type: DataTypes.ENUM('production', 'development'),
          allowNull: false
        },
        concessionaries: {
            type: DataTypes.VIRTUAL,
            get: function() {
                return '';
            }
        },
        concessionaries_props: {
            type: DataTypes.VIRTUAL,
            get: function() {
                return '';
            }
        },
    }, 
    {
        underscored: true,
        tableName: 'oil_fields',
        classMethods: {
            associate: function(models) {
                const opts:Sequelize.AssociationOptionsBelongsTo = {
                    as: 'basin', 
                    foreignKey: {  allowNull: false }
                };
                OilField.belongsTo(models.Basin, opts);
            },
			defineHooks: defineHooks
        }
    }    
  );
  
  return OilField;
};