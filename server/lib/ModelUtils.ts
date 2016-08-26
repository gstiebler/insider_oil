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

export function formatImageFileName(modelName: string, id: number):string {
    const fileName = AWS.getImagesPath() + modelName + '/img_' + id + '_original.jpg';
    return fileName;
}

export function saveOriginalImage(imgBytes, modelName: string, id: number) {
    const imgArray = imgBytes;
    if(!imgArray) return;
    const imgBuffer = new Buffer(imgArray);
    const fileName = formatImageFileName(modelName, id);
    AWS.saveImage(imgBuffer, fileName);  
}

export function saveRecordUpdates(modelName: string, record, newData):Promise<any> {
    const db = require('../db/models');
    const modifiedRecords:string[] = [];
    for(var field in newData) {
        let newValue = newData[field];
        if(newValue != record[field]) {
            modifiedRecords.push(field);
        }
    }
    const update = {
        model: modelName,
        type: 'EDIT',
        updates: JSON.stringify(modifiedRecords)
    }
    return db.models.UpdateLog.create(update);
}