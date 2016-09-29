import db = require('../db/models');
var DataSources = require('./DataSources');
import dsParams = require('./DataSourcesParams');
import * as ni from '../../common/NetworkInterfaces';
import Sequelize = require('sequelize');

export interface ioDataSource {
    name: string;
    findAll(options?: any): any;
    findById(id: number, options?: any): any;
    create(newItemData: any): any;
    destroy(options?: any): any;
    count(options: any): Promise<any>;
    tableAttributes: any;
    attributes: [string, any];
    associations: [string, any];
}

function assignObjects(objDst: any, objSrc: any) {
    if(!objDst)
        objDst = {};
    for(let attName in objSrc) {
        objDst[attName] = objSrc[attName];
    }
    return objDst;
}


export function getDataSource(dataSourceName: string): ioDataSource {
    const model = db.models[dataSourceName];
    if(model) // model without special filters
        return model;  
    else {
        return createDataSource(dataSourceName);
    }
}
 
 
export function findAllCustom(model: ioDataSource, options?: any) {
    options = options ? options : {};
    options.where = options.where ? options.where : {};  
    options.include = [{all: true}];
    return model.findAll(options);
}


// Convert associations to plain item strings in the record
function simplifyItem(model: ioDataSource, item) {
    for( var associationName in model.associations ) {
        const association = model.associations[associationName];
        for( var att in association.target.attributes ) {
            if(att == 'id') continue;
            const fieldName = association.as + '_' + att;
            if(item[association.as])
                item.dataValues[fieldName] = item[association.as][att];
            else
                item.dataValues[fieldName] = '';
        }
    }
}


export function simplifyArray(model: ioDataSource, array: any[]) {
    for(var i = 0; i < array.length; i++) {
        simplifyItem( model, array[i] );
    }
}


function createDataSource(dataSourceName: string): ioDataSource {
    var dataSourceParams = DataSources[dataSourceName];
    if(!dataSourceParams)
        return null;
    var dataSource: ioDataSource = {
        name: dataSourceParams.modelName,
        create: function(newItemData) {
            for(var filterField in dataSourceParams.filters)
                newItemData[filterField] = dataSourceParams.filters[filterField];
            return dataSourceParams.model.create(newItemData);
        },
        findAll: function(options) {
            options = options ? options : {};
            // filter using the fixed filters
            options.where = assignObjects(options.where, dataSourceParams.filters);
            return dataSourceParams.model.findAll(options);
        },
        findById: function(id, options) {
            return dataSourceParams.model.findById(id, options);
        },
        destroy: function(options) {
            return dataSourceParams.model.destroy(options);
        },
        count: (options) => {
            return dataSourceParams.model.count(options);
        },
        associations: dataSourceParams.model.associations,
        attributes: dataSourceParams.model.attributes,
        tableAttributes: dataSourceParams.model.tableAttributes
    };
    return dataSource;
}

// TODO replace this function by only getting the selected field in the query
export function filterShowFields(records: any[], gridFields: string[]): any[] {
    const resultArray = [];
    for(var record of records) {
        const resultRecord:any = {};
        for(var gridField of gridFields) {
            resultRecord[gridField] = record.dataValues[gridField]; 
        }
        resultRecord.id = record.dataValues.id;
        resultArray.push(resultRecord);
    }
    return resultArray;
}

export async function saveExtraData(modelName: string, id: number, 
                                    extraData: ni.IExtraRecordData) {
    const model = db.models[modelName];
    await model.destroy(id);
    let modelValue = {
        model_name: modelName,
        obj_id: id,
        desc: 'TableauUrl',
        value: extraData.tableauUrls
    }
    await db.models.ModelValueAssocation.create(modelValue);
}