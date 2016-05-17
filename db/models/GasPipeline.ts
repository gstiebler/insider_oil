'use strict';
import Sequelize = require('sequelize');
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

function loadRefObj(sequelize, gasPipeline, prefix: string) {
    const textField = prefix + '_text';
    if(gasPipeline[textField])
        return gasPipeline[textField];
        
    const modelField = prefix + '_model_id';
    const objField = prefix + '_obj_id';
    const modelRecord = await(sequelize.models.ModelsList.findById(gasPipeline[modelField]));
    const referencedModel = sequelize.models[modelRecord.name];
    const referencedObj = await(referencedModel.findById(gasPipeline[objField]));
    return [{
        id: gasPipeline[objField],
        model_id: gasPipeline[modelField],
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
            get: function () {  return loadRefObj(sequelize, this, 'src_instalation'); }
        },
        src_concession: {
            type: DataTypes.VIRTUAL,
            get: function () {  return loadRefObj(sequelize, this, 'src_concession'); }
        },
        dst_instalation: {
            type: DataTypes.VIRTUAL,
            get: function () {  return loadRefObj(sequelize, this, 'dst_instalation'); }
        },
        dst_concession: {
            type: DataTypes.VIRTUAL,
            get: function () {  return loadRefObj(sequelize, this, 'dst_concession'); }
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