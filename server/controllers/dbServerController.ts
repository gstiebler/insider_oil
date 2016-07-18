'use strict';

import db = require('../db/models');
var fileUpload = require('../lib/fileUpload');
var Sync = require('sync');
var await = require('../lib/await');
import ControllerUtils = require('../lib/ControllerUtils');
import importExcel = require('../lib/excel/importExcel');
import winston = require('winston');
import dbUtils = require("../lib/dbUtils");
import dsParams = require('../lib/DataSourcesParams');
import express = require("express");
import DataSourceOperations = require('../lib/DataSourceOperations/index');
import ComboQueries = require('../db/queries/ComboQueries');
import QueriesById = require('../db/queries/QueriesById');
import TableQueries = require('../db/queries/TableQueries');
import QueryGenerator = require('../db/queries/QueryGenerator');
import TimeSeriesQueries = require('../db/queries/TimeSeriesQueries');
import { IExcelUploadResponse } from '../lib/excel/ImportExcelClass';
import Sequelize = require('sequelize');
import * as interfaces from '../../common/Interfaces';
import * as ni from '../../common/NetworkInterfaces';
import * as ImportKML from '../lib/ImportKml';
 
function getFieldTypes(fields) {
    const types = {};
    for( var i = 0; i < fields.length; i++) {
        types[fields[i].name] = fields[i].type; 
    }
    return types;
} 

export function getViewParams(req: express.Request, res: express.Response, next) {
    const query: ni.GetViewParams.req = req.query;
    const modelName: string = query.table;
    const dataSource = dbUtils.getDataSource(modelName);
    const viewParams = dsParams[dataSource.name];
    viewParams.gridFields.push('id');
    const dsOperations = DataSourceOperations[modelName];
    const fields = dsOperations.getModelFields(modelName);
    var types = getFieldTypes(fields);
    const ioRes: ni.GetViewParams.res = { viewParams, types };
    res.json(ioRes);
}
 
export function getTableData(req: express.Request, res: express.Response, next) {
    const query: ni.GetTableData.req = req.query;
    const modelName: string = query.table;
    const filters = query.filters;
    const fieldNames = query.fieldNames;
    const order = query.order;
    const pagination = query.pagination;
    const dataSource = dbUtils.getDataSource(modelName);
    if(!dataSource) {
    	ControllerUtils.getErrorFunc(res, 500, "Modelo não encontrado")({});
        return;
    }
    const viewParams = dsParams[dataSource.name];

    const filterObj:any = {};
    if(filters) {
        for(var filter of filters) {
            filterObj[filter.field] = { $like: '%' + filter.value + '%' };
        }
    }

    var orderObj = [];
    if(order) {
            orderObj = order.map((orderItem) => {
            return [orderItem.fieldName, orderItem.dir.toUpperCase()];
        });
    }

    var showFields = fieldNames;
    if(!showFields)
        showFields = viewParams.gridFields;
    // TODO only get selected fields
    const findOpts:any = {
        where: filterObj,
        order: orderObj,
    }
    if(pagination) {
        findOpts.offset = parseInt(pagination.first);
        findOpts.limit = parseInt(pagination.itemsPerPage);
    }
    dbUtils.findAllCustom(dataSource, findOpts).then(sendRecords)
        .catch(ControllerUtils.getErrorFunc(res, 500, "Erro"));
    
    function sendRecords(records) {Sync(function() {
        try {
            dbUtils.simplifyArray( dataSource, records );
            const filteredRecords = dbUtils.filterShowFields(records, showFields);
            const count = await( dataSource.count({ where: filterObj }) );
            const ioRes:ni.GetTableData.res = { 
                records: filteredRecords,
                count
            }; 
            res.json( ioRes );
        } catch(e) {
            ControllerUtils.getErrorFunc(res, 500, "Erro")(e);
        }});
    }
}

export function uploadFile(req: express.Request, res: express.Response, next) {
    var buf = JSON.parse(req.body.data);
    var model = req.body.model;
    try {
        importExcel(buf, model).then(onOk).catch(onError);
    } catch(err) {
        res.status(400).json( { errorMsg: err } );
    }

    function onOk(result:IExcelUploadResponse) {
        res.json( { status: result.status, recordsStatus: result.invalidRecordsStatus } );
    }
    
    function onError(err) {
        winston.error(err);
        res.status(400).json( { errorMsg: err } );
    }
      
    function onFinish() {
    	winston.info('Done parsing form!');
    };
}

export function uploadKml(req: express.Request, res: express.Response, next) {
    const model = req.body.model;
    const kmlStr = JSON.parse(req.body.data);
    const importFuncs = {
        Block: ImportKML.importBlocks,
        OilField: ImportKML.importOilFields
    }
    const importFunc:ImportKML.IImportFunc = importFuncs[model];
    if(!importFunc) {
        throw 'Modelo não encontrado: ' + model;
    }
    importFunc(kmlStr)
        .then((status:string) => res.json( { status: status} ))
        .catch(ControllerUtils.getErrorFunc(res, 500, "Erro"));
}

export function modelFields(req: express.Request, res: express.Response, next) {
    var modelName = req.query.model;
    const dsOperations = DataSourceOperations[modelName];
    var fields = dsOperations.getModelFields(modelName);
    res.json( { fields: fields } );
}


export function recordValues(req: express.Request, res: express.Response, next) {
    var dsName = req.query.model;
    var id = req.query.id;
    const dataSource = dbUtils.getDataSource(dsName);
    const dsOps = DataSourceOperations[dsName];
    dataSource.findById(id)
        .then(onRecord)
        .catch(ControllerUtils.getErrorFunc(res, 404, "Registro não encontrado"));
    
    function onRecord(record) { Sync(function(){
        try{
            const dsOperations = DataSourceOperations[dsName];
            var fields = dsOperations.getModelFields(dsName);
            
            res.json({ 
                values: record,
                fields: fields
            });
        } catch(error) {
            ControllerUtils.getErrorFunc(res, 500, "Problemas ao recuperar o registro")(error);
        }
    });}
}


export function createItem(req: express.Request, res: express.Response, next) { Sync(function() {
    var newItemData = JSON.parse(req.body.newItemData);
    var modelName = req.body.model;
    var model = dbUtils.getDataSource(modelName);

	db.sequelize.transaction(function(t: Sequelize.Transaction) {
	    return model.create(newItemData)
	            .then(ControllerUtils.getOkFunc(res, "Registro criado com sucesso."))
	           .catch(function(err) {
                   t.rollback();
                   ControllerUtils.getErrorFunc(res, 400, "Não foi possível criar o registro.")(err);
               });
    });
}, ControllerUtils.getErrorFunc(res, 400, "Não foi possível criar o registro."))}


export function saveItem(req: express.Request, res: express.Response, next) { Sync(function() {
    var dsName = req.body.model;
    var recordData = JSON.parse(req.body.record);
    var dataSource = dbUtils.getDataSource(dsName);
    const dsOps = DataSourceOperations[dsName];     
    dataSource.findById( recordData.id )
        .then(onFindRecord)
        .catch(ControllerUtils.getErrorFunc(res, 404, "Não foi possível encontrar o registro."));
    
    function onFindRecord(record) {
        dsOps.addAttributesToRecord(record, recordData, dataSource);
        record.save()
            .then(ControllerUtils.getOkFunc(res, "Registro salvo com sucesso."))
            .catch(ControllerUtils.getErrorFunc(res, 400, "Não foi possível salvar o registro."));
        return null;
    }
}, ControllerUtils.getErrorFunc(res, 400, "Não foi possível criar o registro."))}


export function deleteItem(req: express.Request, res: express.Response) { Sync(function() {
    function hasReferencedObj() {
        // check if a news deference the object
        const modelInList = await(db.models.ModelsList.find({ where: { name: modelName } }));
        if(!modelInList)
            return false;
        const modelRefsOptions = {
            where: {
                model_id: modelInList.id,
                model_ref_id: id
            }
        }
        const newsRefs = await( db.models.NewsModels.find(modelRefsOptions) );
        const personRefs = await( db.models.PersonProjects.find(modelRefsOptions) );
        return newsRefs || personRefs;
    }
    
    var id = req.body.id;
    var modelName = req.body.model;
    var model = dbUtils.getDataSource(modelName);
    const errorFunc = ControllerUtils.getErrorFunc(res, 404, "Não foi possível apagar o registro.");
    
    try {
        if(hasReferencedObj()) {
            errorFunc(`Existe uma referência a este objeto, portanto não pode ser deletado.`);
            return;
        }
            
        model.destroy({ where: { id: id } })
            .then(ControllerUtils.getOkFunc(res, 'Registro apagado com sucesso'))
            .catch( errorFunc );
    } catch(error) {
        errorFunc(error);
    }

}, ControllerUtils.getErrorFunc(res, 404, "Não foi possível apagar o registro."))}


export function getComboValues(req: express.Request, res: express.Response) {
    const modelName:string = req.query.model;
    const model = dbUtils.getDataSource(modelName);
    const viewParams = dsParams[modelName];
    var labelField = 'name';
    if(viewParams) 
        labelField = viewParams.labelField;  
    // default combo list 
    if(model) {
        const options = {
            attributes: ['id', labelField],
            order: [labelField]
        };
        model.findAll(options)
            .then(onValues)
            .catch(ControllerUtils.getErrorFunc(res, 500, "Não foi possí­vel carregar os registros."));
    } else { // it should use a custom query to get the combo values
        const queryStrGenerator = ComboQueries[modelName];
        const queryStr = queryStrGenerator();
        const simpleQueryType = { type: db.Sequelize.QueryTypes.SELECT};
        db.sequelize.query(queryStr, simpleQueryType)
            .then(onValues) 
            .catch(ControllerUtils.getErrorFunc(res, 500, "Não foi possí­vel carregar os registros."));
    } 
    function onValues(values) {
        var valuesArray = [];
        for(var value of values) {
            valuesArray.push( {
                id: value.id, 
                label: value[labelField]
            });
        };
        res.json(valuesArray);
    }
}

export function viewRecord(req: express.Request, res: express.Response, next) {
    const dataSourceName = req.query.dataSource;
    const id = req.query.id;
    const dataSource = dbUtils.getDataSource(dataSourceName);
    const options: any = {};
    options.include = [{all: true}];
    dataSource.findById(id, options)
        .then(onRecord)
        .catch(ControllerUtils.getErrorFunc(res, 404, "Registro não encontrado"));
    
    function onRecord(record) { Sync(function() {  
        try {         
            const dsOperations = DataSourceOperations[dataSourceName];
            const recordValues = dsOperations.recordToViewValues(dataSourceName, record);
            const viewParams = dsParams[dataSource.name];
            const result = {
                record: recordValues,
                referencedObjects: viewParams.referencedObjectsOnView
            };
            res.json(result);   
        } catch(err) {
            ControllerUtils.getErrorFunc(res, 500, "Erro")(err);
        }
        return null;
    })
    return null;
    };
}


export function getQueryData(req: express.Request, res: express.Response) {Sync(function(){
    const queryName = req.query.queryName;
    const filters = req.query.filters;
    const queryById = QueriesById[queryName];
    const queryStr = queryById.queryStrFn(filters);
    const simpleQueryType = { type: db.Sequelize.QueryTypes.SELECT};
    db.sequelize.query(queryStr, simpleQueryType).then( (records) => {
        const result = {
            fields: queryById.fields,
            records: records
        };
        res.json(result);
    }).catch(ControllerUtils.getErrorFunc(res, 500, "Erro"));
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os registros."))}

export function getTableQueryData(req: express.Request, res: express.Response):void {Sync(function(){
    const queryParams:QueryGenerator.IQueryParams = req.query.queryParams;
    queryParams.filters = queryParams.filters ? queryParams.filters : [];
    const queryName:string = req.query.queryName;
    const query = TableQueries.queries[queryName];
    const fields = query.fields;

    TableQueries.getQueryResult(queryName, queryParams).then( (results) => {
        const records = results[0];
        if(query.recordProcessor) {
            for(var record of records) {
                query.recordProcessor(record);
            }
        }
        const result:interfaces.TableQueryDataRes = {
            fields,
            records,
            count: results[1][0].count
        };
        res.json(result);
    }).catch(ControllerUtils.getErrorFunc(res, 500, "Erro"));

}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os registros."))}
 

export function getTimeSeries(req: express.Request, res: express.Response):void {Sync(function(){
    const queryParams = req.query.queryParams;
    const queryName:string = req.query.queryName;

    TimeSeriesQueries.getData(queryName, queryParams).then( (results) => {
        const result = {
            records: results
        };
        res.json(result);
    }).catch(ControllerUtils.getErrorFunc(res, 500, "Erro"));
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados."))}

/**
 * Returns map data to feed the map with all the objects
 */
export function getMapData(req: express.Request, res: express.Response):void {Sync(function(){
    const blockGetAllOptions = {
        attributes: ['id', 'name', 'polygons']
    }
    const blocks = await( db.models.Block.findAll(blockGetAllOptions) );
    
    const oilFieldGetAllOptions = {
        attributes: ['id', 'name', 'polygons'],
        where: { polygons: { $ne: null } }
    }
    const oilFields = await( db.models.OilField.findAll(oilFieldGetAllOptions) );

    const productionUnitsGetAllOptions = {
        attributes: ['id', 'name', 'coordinates'],
        where: { coordinates: { $ne: null } }
    }
    const productionUnits = await( db.models.ProductionUnit.findAll(productionUnitsGetAllOptions) );

    res.json( { blocks, oilFields, productionUnits } );
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados."))}

/**
 * Returns the list of objects that have a admin page
 */
export function sourcesList(req: express.Request, res: express.Response) {
    var list = {
        Basin: 'Bacias',
        Block: 'Blocos',
        Well: 'Poços',
        ComercialDeclaration: 'Declarações de comercialidade',
        DrillingRigOffshore: 'Sondas offshore',
        DrillingRigOnshore: 'Sondas onshore',
        Company: 'Empresas',
        Person: 'Pessoas',
        OilField: 'Campos',
        //OilFieldDeveloping: 'Campos em desenvolvimento',
        //OilFieldProduction: 'Campos em produção',
        Seismic: 'Sísmica',
        //AmbientalLicense: 'Licenças ambientais',
        //FPSOProduction: 'Produção UEP FPSO',
        //FixedUEPProduction: 'Produção UEP Fixa',
        //ReserveProvenOil: 'Reservas provadas de óleo',
        //ReserveProvenGas: 'Reservas provadas de gás',
        //ReserveTotalOil: 'Reservas totais de óleo',
        //ReserveTotalGas: 'Reservas totais de gás',
        //ProductionOnshore: 'Produção onshore',
        //ProductionOffshore: 'Produção offshore',
        HydrocarbonEvidence: 'Indicíos de hidrocarbonetos',
        ProductionUnit: 'Unidades de produção',
        MaintenanceDate: 'Datas de manutenção',
        Refinery: 'Refinarias',
        Terminal: 'Terminais',
        Fleet: 'Frota Transpetro',
        Bid: 'Licitações',
        Contract: 'Contratos',
        GasPipeline: 'Gasodutos',
        OilPipeline: 'Oleodutos',
        GasMovement: 'Movimentação de gasoduto',
        IndustrySegment: 'Segmentos',
        ExcelImportLog: 'Log da importação de Excel',
    };
    
    res.json(list);
}