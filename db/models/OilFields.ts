'use strict';

import Sequelize = require('sequelize');  
var await = require('../../lib/await');


function updateConcessionaries(db, oilField) {
    const options = { where: { oil_field_id: oilField.id } };
    // remove all records from OilFieldConcessionary associated with this oil field
    return db.OilFieldConcessionary.destroy(options).then(function() {
        const concessionaries = oilField.dataValues.concessionaries;
        const concessionaries_props = oilField.dataValues.concessionaries_props;
        if (!concessionaries || !concessionaries_props)
            return null;
        if (concessionaries.length != concessionaries_props.length)
            throw 'Tamanhos diferentes de concessionários';
        const newConcessionariesRecords = [];
        var prop_sum = 0;
        for (var i = 0; i < concessionaries.length; i++) {
            const ofcRecord = {
                oil_field_id: oilField.id,
                company_id: concessionaries[i].id,
                prop: concessionaries_props[i] / 100.0
            };
            newConcessionariesRecords.push(ofcRecord);
            prop_sum += concessionaries_props[i] * 1.0;
        }
        if(Math.abs(prop_sum - 100.0) > 0.0001)
            throw 'Valores somam ' + prop_sum + '%';
        
        return db.OilFieldConcessionary.bulkCreate(newConcessionariesRecords);
    });
}


function updateFieldsFunc(db) {
    return function (oilField) {
        return updateConcessionaries(db, oilField);
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
                const select = 'select c.name, c.id ';
                const fromStr = 'from oil_field_concessionaries ofc ';
                const companyJoin = ' left outer join companies c on ofc.company_id = c.id ';
                const where = 'where ofc.oil_field_id = ' + this.id;
                const order = ' order by ofc.id';
                const queryStr = select + fromStr + companyJoin+ where  + order;
                const simpleQueryType = { type: sequelize.QueryTypes.SELECT};
                const result = await( sequelize.query(queryStr, simpleQueryType) );
                return result;
            }
        },
        concessionaries_props: {
            type: DataTypes.VIRTUAL,
            get: function() {
                const select = 'select round(ofc.prop * 100, 2) as prop ';
                const fromStr = 'from oil_field_concessionaries ofc ';
                const where = 'where ofc.oil_field_id = ' + this.id;
                const order = ' order by ofc.id';
                const queryStr = select + fromStr + where + order;
                const simpleQueryType = { type: sequelize.QueryTypes.SELECT};
                const result = await( sequelize.query(queryStr, simpleQueryType) );
                return result.map( value => { return value.prop } );
            }
        },
        formatted_concessionaries: {
            type: DataTypes.VIRTUAL,
            get: function() {
                const select = 'select c.name, round(ofc.prop * 100, 2) as percent ';
                const fromStr = 'from oil_field_concessionaries ofc ';
                const companyJoin = ' left outer join companies c on ofc.company_id = c.id ';
                const where = 'where ofc.oil_field_id = ' + this.id;
                const order = ' order by ofc.id';
                const queryStr = select + fromStr + companyJoin+ where  + order;
                const simpleQueryType = { type: sequelize.QueryTypes.SELECT};
                const result = await( sequelize.query(queryStr, simpleQueryType) );
                let concessionaries = ''; 
                for(let row of result) {
                    concessionaries += row.name + ': ' + row.percent + '%\n';
                }
                return concessionaries.substr(0, concessionaries.length - 1);
            }
        }
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