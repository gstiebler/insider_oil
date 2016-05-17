'use strict';
import Sequelize = require('sequelize');
import db = require('./index');
var await = require('../../lib/await');

function updateGasPipeRef(gasPipeline, prefix: string) {
    const modelField = prefix + '_model_id';
    const objField = prefix + '_obj_id';
    const object: any[] = gasPipeline.dataValues[prefix];
    if (object == null || object.length != 1) {
        gasPipeline[modelField] = null;
        gasPipeline[objField] = null;
        return;
    }

    gasPipeline[modelField] = object[0].model_id;
    gasPipeline[objField] = object[0].id;
}

function updateAllGasPipeRefs(gasPipeline) {
    updateGasPipeRef(gasPipeline, 'src_instalation');
    updateGasPipeRef(gasPipeline, 'src_concession');
    updateGasPipeRef(gasPipeline, 'dst_instalation');
    updateGasPipeRef(gasPipeline, 'dst_concession');
}

function defineHooks(db) {
    db.GasPipeline.hook('beforeCreate', updateAllGasPipeRefs);
    db.GasPipeline.hook('beforeUpdate', updateAllGasPipeRefs);
}

function loadRefObj(prefix: string) {
    const textField = prefix + '_text';
    if(this[textField])
        return this[textField];
        
    const modelField = prefix + '_model_id';
    const objField = prefix + '_obj_id';
    const modelRecord = await(db.models.ModelsList.findById(this[modelField]));
    const referencedModel = db.models.models[modelRecord.name];
    const referencedObj = await(referencedModel.findById(this[objField]));
    return [{
        id: this[objField],
        model_id: this[modelField],
        model: modelRecord.name,
        name: referencedObj.name
    }];
}

module.exports = function (sequelize, DataTypes: Sequelize.DataTypes) {
    const GasPipeline = sequelize.define('GasPipeline', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        state: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        diameter: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        extension: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        classification: {
            type: Sequelize.STRING,
            allowNull: true
        },

        // text fields
        src_instalation_text: {
            type: Sequelize.STRING,
            allowNull: true
        },
        src_concession_text: {
            type: Sequelize.STRING,
            allowNull: true
        },
        dst_instalation_text: {
            type: Sequelize.STRING,
            allowNull: true
        },
        dst_concession_text: {
            type: Sequelize.STRING,
            allowNull: true
        },

        // source reference fields

        src_instalation_obj_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        src_concession_obj_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },

        // destiny reference fields
        dst_instalation_obj_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        dst_concession_obj_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        
        // virtual fields 
        src_instalation: {
            type: DataTypes.VIRTUAL,
            get: function () {  return loadRefObj('src_instalation'); }
        },
        src_concession: {
            type: DataTypes.VIRTUAL,
            get: function () {  return loadRefObj('src_concession'); }
        },
        dst_instalation: {
            type: DataTypes.VIRTUAL,
            get: function () {  return loadRefObj('dst_instalation'); }
        },
        dst_concession: {
            type: DataTypes.VIRTUAL,
            get: function () {  return loadRefObj('dst_concession'); }
        },
    },
        {
            underscored: true,
            tableName: 'gas_pipelines',
            classMethods: {
                associate: function (models) {
                    const siOpts: Sequelize.AssociationOptionsBelongsTo = {
                        as: 'src_instalation_model',
                        foreignKey: { allowNull: true }
                    };
                    GasPipeline.belongsTo(models.ModelsList, siOpts);
                    
                    const scOpts: Sequelize.AssociationOptionsBelongsTo = {
                        as: 'src_concession_model',
                        foreignKey: { allowNull: true }
                    };
                    GasPipeline.belongsTo(models.ModelsList, scOpts);
                    
                    const diOpts: Sequelize.AssociationOptionsBelongsTo = {
                        as: 'dst_instalation_model',
                        foreignKey: { allowNull: true }
                    };
                    GasPipeline.belongsTo(models.ModelsList, diOpts);
                    
                    const dcOpts: Sequelize.AssociationOptionsBelongsTo = {
                        as: 'dst_concession_model',
                        foreignKey: { allowNull: true }
                    };
                    GasPipeline.belongsTo(models.ModelsList, dcOpts);
                },
                defineHooks: defineHooks
            }
        }
    );
    return GasPipeline;
};