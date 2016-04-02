import db = require('../db/models');
var DataSources = require('./DataSources');
import dsParams = require('./DataSourcesParams');

export interface ioDataSource {
    name: string;
    findAll(options?: any): any;
    findById(id: number, options?: any): any;
    create(newItemData: any): any;
    destroy(options?: any): any;
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
 
 
export function findAllCustom(model: ioDataSource, options: any, filters: any) {
    options = options ? options : {};
    filters = filters ? filters : {};
    options.where = options.where ? options.where : {};  
    options.include = [{all: true}];
    options.where = assignObjects(options.where, filters);
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