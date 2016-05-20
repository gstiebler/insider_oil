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
 
function getFieldTypes(fields) {
    const types = {};
    for( var i = 0; i < fields.length; i++) {
        types[fields[i].name] = fields[i].type; 
    }
    return types;
}
 
export function main(req: express.Request, res: express.Response, next) {
    const modelName: string = req.query.table;
    const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
    const fieldNames = req.query.fieldNames;
    const dataSource = dbUtils.getDataSource(modelName);
    if(!dataSource) {
    	ControllerUtils.getErrorFunc(res, 500, "Modelo não encontrado")({});
        return;
    }
    const viewParams = dsParams[dataSource.name];
    var showFields = fieldNames;
    if(!showFields)
        showFields = viewParams.gridFields;
    // TODO only get selected fields
    dbUtils.findAllCustom(dataSource, {}, filters).then(sendRecords)
        .catch(ControllerUtils.getErrorFunc(res, 500, "Erro"));
    
    function sendRecords(records) {Sync(function() {
        try {
            viewParams.gridFields.push('id');
            dbUtils.simplifyArray( dataSource, records );
            const dsOperations = DataSourceOperations[modelName];
            const fields = dsOperations.getModelFields(modelName);
            const responseObj = {
                records: dbUtils.filterShowFields(records, showFields),
                viewParams: viewParams,
                types: getFieldTypes(fields)
            };
            res.json( responseObj );
        } catch(e) {
            ControllerUtils.getErrorFunc(res, 500, "Erro")(e);
        }});
    }
}


export function uploadFile(req: express.Request, res: express.Response, next) {
    fileUpload.receive( req, onFile, onFinish );

    function onFile(fileName, buf) {
    	winston.debug( "File name: " + fileName );
        var model = req.query.table;
        
        function onOk(result:IExcelUploadResponse) {
            res.json( { status: result.status, recordsStatus: result.invalidRecordsStatus } );
        }
        
        function onError(err) {
            winston.error(err);
            res.status(400).json( { errorMsg: err } );
        }
        
        importExcel(buf, model).then(onOk).catch(onError);
    }
      
    function onFinish() {
    	winston.info('Done parsing form!');
    };
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
    var newItemData = req.body.newItemData;
    var modelName = req.body.model;
    var model = dbUtils.getDataSource(modelName);

	db.sequelize.transaction(function(t) {
	       return model.create(newItemData)
	            .then(ControllerUtils.getOkFunc(res, "Registro criado com sucesso."))
	           .catch(ControllerUtils.getErrorFunc(res, 400, "Não foi possível criar o registro."));
    });
})}


export function saveItem(req: express.Request, res: express.Response, next) { Sync(function() {
    var dsName = req.body.model;
    var recordData = req.body.record;
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
})}


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
    
    var id = req.query.id;
    var modelName = req.query.model;
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

})}


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
            .catch(ControllerUtils.getErrorFunc(res, 500, "Não foi possí­vel carregar os registros."));;
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
    const dataSourceName = req.query.dataSource;
    const queryName = req.query.queryName;
    const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
    const queryById = QueriesById[queryName];
    const queryStr = queryById.queryStrFn(filters);
    const simpleQueryType = { type: db.Sequelize.QueryTypes.SELECT};
    db.sequelize.query(queryStr, simpleQueryType).then( (records) => {
        const dsOperations = DataSourceOperations[dataSourceName];
        const result = {
            fields: queryById.fields,
            records: records
        };
        res.json(result);
    }).catch(ControllerUtils.getErrorFunc(res, 500, "Erro"));
})}
 

export function getTableQueryData(req: express.Request, res: express.Response):void {Sync(function(){
    const queryParams:QueryGenerator.IQueryParams = req.query.queryParams ? JSON.parse(req.query.queryParams) : {};
    const queryName:string = req.query.queryName;
    const fields = TableQueries.queries[queryName].fields;

    TableQueries.getQueryResult(queryName, queryParams).then( (results) => {
        const result = {
            fields: fields,
            records: results[0],
            count: results[1][0].count
        };
        res.json(result);
    }).catch(ControllerUtils.getErrorFunc(res, 500, "Erro"));
})}
 

export function getTimeSeries(req: express.Request, res: express.Response):void {Sync(function(){
    const queryParams = req.query.queryParams ? JSON.parse(req.query.queryParams) : {};
    const queryName:string = req.query.queryName;

    TimeSeriesQueries.getData(queryName, queryParams).then( (results) => {
        const result = {
            records: results
        };
        res.json(result);
    }).catch(ControllerUtils.getErrorFunc(res, 500, "Erro"));
})}


export function sourcesList(req: express.Request, res: express.Response) {
    var list = {
        Basin: 'Bacias',
        Block: 'Blocos',
        Well: 'Poços',
        ProductionWell: 'Poços de produção',
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
        Refinery: 'Refinarias',
        Terminal: 'Terminais',
        Fleet: 'Frota Transpetro',
        Bid: 'Licitações',
        Contract: 'Contratos',
        GasPipeline: 'Gasodutos',
        OilPipeline: 'Oleodutos',
        GasMovement: 'Movimentação de gasoduto',
    };
    
    res.json(list);
}