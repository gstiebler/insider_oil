"use strict";

var db = require('../db/models');
var DataSources = require('./DataSources');
import dsParams = require('./DataSourcesParams');

interface ioDataSource {
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
    const model = db[dataSourceName];
    if(model)
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
function simplifyItem(model: any, item) {
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


export function getModelFields(modelName: string) {
    var dataSource = getDataSource(modelName);
    var viewParams = dsParams[dataSource.name];
    var fields = {};
    for(var attributeName in dataSource.attributes) {
        if(dataSource.attributes[attributeName]._autoGenerated) continue;
        
        const att = viewParams.fields[attributeName];
        if(!att) continue;
        const type = dataSource.attributes[attributeName].type;
        var typeStr = 'VARCHAR';
        try { // this try is due to an apparent bug in the toString in sequelize for ENUM fields
            typeStr = type.toString();
        } catch(e) {
            //console.log(e.stack);
        }
        fields[attributeName] = att;
        fields[attributeName].type = typeStr;
    }
    
    for( var associationName in dataSource.associations ) {
        const association = dataSource.associations[associationName];
        if(association.associationType != 'BelongsTo')
        	continue;
        const fieldName = association.identifierField;
        const att = viewParams.fields[fieldName];
        if(!att)
            throw 'Modelo ' + modelName + ' não possui configuração para o campo ' + fieldName;
        fields[fieldName] = {
            label: att.label,
            type: 'ref',
            model: association.target.name,
            association: associationName
        };
    }
    
    var fieldArray = [];
    for( var fieldName in fields ) {
        const obj = fields[fieldName];
        obj.name = fieldName;
        fieldArray.push(obj);
    }
    
    return fieldArray;
}


export function simplifyArray(model, array: any[]) {
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
export function filterShowFields(records: any[], gridFields: any[]): any[] {
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