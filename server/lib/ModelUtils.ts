'use strict';
import Sequelize = require('sequelize');
import * as AWS from './AWS';
const await = require('../lib/await');

export function getListFieldObj(textFieldName:string) {
    return {
        type: Sequelize.VIRTUAL,
        get: function() {
            const value = this[textFieldName];
            if(!value) return null;
            return JSON.parse(value);
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
    const refObjName = referencedObj ? referencedObj.name : null;
    return [{
        id: this.obj_id,
        model_id: this.model_id,
        model: modelRecord.name,
        name: refObjName
    }];
}

export function saveImage(imgBytes, modelName: string, id: number) {
    const imgArray = imgBytes;
    if(!imgArray) return;
    const imgBuffer = new Buffer(imgArray);
    const fileName = 'images/' + modelName + '/img_' + id + '_original.jpg';
    AWS.saveImage(imgBuffer, fileName);  
}