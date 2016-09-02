'use strict';

import Sequelize = require('sequelize');
import * as AWS from './AWS';
import * as moment from 'moment';
import { coordToString, stringToCoord } from './Geo';
import { await } from '../lib/await';

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

export function getCoordFieldObj(textFieldName:string) {
return {
        type: Sequelize.VIRTUAL,
        get: function() {
            const coordsValue = this[textFieldName];
            if(!coordsValue || coordsValue.length == 0) {
                return null;
            }
            return coordToString(JSON.parse(coordsValue));
        },
        set: function(coordsStr) {
            const coords = stringToCoord(coordsStr);
            this[textFieldName] = JSON.stringify(coords);
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

export function fieldTypeStr(field): string {
    let typeStr = 'VARCHAR';
    try { // this try is due to an apparent bug in the toString in sequelize for ENUM fields
        typeStr = field.type.toString();
    } catch(e) {
        typeStr = 'ENUM';
    }
    return typeStr;
}

export function saveRecordUpdates(modelName: string, record, newData):Promise<any> {
    // do not save News updates
    if(modelName == 'News') return Promise.resolve();
    const db = require('../db/models');
    const dataSource = db.models[modelName];
    const modifiedRecords:string[] = [];
    for(var fieldName in newData) {
        let newValue = newData[fieldName];
        let oldValue = record[fieldName];
        let field = dataSource.attributes[fieldName];
        if(!field) continue;            
        let typeStr = fieldTypeStr(field);
        if(typeStr == 'DATE') {
            newValue = moment(newValue).utcOffset(0).format('DD/MM/YYYY');
            oldValue = moment(oldValue).utcOffset(0).format('DD/MM/YYYY');
        } else if (oldValue && oldValue.constructor == Array) {
            newValue = JSON.stringify(newValue);
            oldValue = JSON.stringify(oldValue);
        }
        if(newValue != oldValue) {
            modifiedRecords.push(fieldName);
        }
    }
    const update = {
        model: modelName,
        obj_id: record.id,
        type: 'EDIT',
        updates: JSON.stringify(modifiedRecords)
    }
    return db.models.UpdateLog.create(update);
}