'use strict';
import Sequelize = require('sequelize');
const await = require('../lib/await');

export function getListFieldObj(textFieldName:string) {
    return {
        type: Sequelize.VIRTUAL,
        get: function() {
            return JSON.parse(this[textFieldName]);
        },
        set: function(newValue) {
            this[textFieldName] = JSON.stringify(newValue);
        }
    }
}

export function getObjRefField() {
    const db = require('../db/models');
    if(!this.model_id)
        return [];
    const modelRecord = await( db.models.ModelsList.findById(this.model_id));
    const referencedModel = db.models[modelRecord.name];
    const referencedObj = await(referencedModel.findById(this.obj_id));
    return [{
        id: this.obj_id,
        model_id: this.model_id,
        model: modelRecord.name,
        name: referencedObj.name
    }];
}