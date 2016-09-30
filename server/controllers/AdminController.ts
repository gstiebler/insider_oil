'use strict';

import db = require('../db/models');
var Sync = require('sync');
import { await } from '../lib/await';
import * as ControllerUtils from '../lib/ControllerUtils';
import * as express from "express";
import * as dbUtils from "../lib/dbUtils";
import * as ni from '../../common/NetworkInterfaces';
import dsParams = require('../lib/DataSourcesParams');
import DataSourceOperations = require('../lib/DataSourceOperations/index');
import Sequelize = require('sequelize');
import ComboQueries = require('../db/queries/ComboQueries');
import * as ImportKML from '../lib/ImportKml';
import { saveRecordUpdates } from '../lib/ModelUtils';

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
 
export function getTableData(req: express.Request, res: express.Response, next) {Sync(function() {
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
    const records = await( dbUtils.findAllCustom(dataSource, findOpts) );
    dbUtils.simplifyArray( dataSource, records );
    const filteredRecords = dbUtils.filterShowFields(records, showFields);
    const count = await( dataSource.count({ where: filterObj }) );
    const ioRes:ni.GetTableData.res = { 
        records: filteredRecords,
        count
    }; 
    res.json( ioRes );
}, ControllerUtils.getErrorFunc(res, 500, "Erro"))};

export function modelFields(req: express.Request, res: express.Response, next) {
    var modelName = req.query.model;
    const dsOperations = DataSourceOperations[modelName];
    var fields = dsOperations.getModelFields(modelName);
    res.json( { fields: fields } );
}

export function recordValues(req: express.Request, res: express.Response, next) { Sync(function(){
    var dsName = req.query.model;
    var id = req.query.id;
    const dataSource = dbUtils.getDataSource(dsName);
    const dsOps = DataSourceOperations[dsName];
    const record = await( dataSource.findById(id) );
    const dsOperations = DataSourceOperations[dsName];
    var fields = dsOperations.getModelFields(dsName);
    
    res.json({ 
        values: record,
        fields: fields
    });
}, ControllerUtils.getErrorFunc(res, 404, "Registro não encontrado"));}

export function createItem(req: express.Request, res: express.Response, next) { Sync(function() {
    const body:ni.CreateItem.req = req.body;
    var newItemData = JSON.parse(body.newItemData);
    var modelName = body.model;
    var model = dbUtils.getDataSource(modelName);

	db.sequelize.transaction(function(t: Sequelize.Transaction) {
	    return model.create(newItemData)
	            .then(onCreate)
	           .catch(function(err) {
                   t.rollback();
                   ControllerUtils.getErrorFunc(res, 400, "Não foi possível criar o registro.")(err);
               });
    });

    async function onCreate(newRecord) {
        await dbUtils.saveExtraData(modelName, newRecord.id, body.extraRecordData);
        ControllerUtils.getOkFunc(res, "Registro criado com sucesso.")();
    }
}, ControllerUtils.getErrorFunc(res, 400, "Não foi possível criar o registro."))}

export function saveItem(req: express.Request, res: express.Response, next) { Sync(function() {
    const body:ni.SaveItem.req = req.body;
    var dsName = body.model;
    var recordData = JSON.parse(body.record);
    var dataSource = dbUtils.getDataSource(dsName);
    const dsOps = DataSourceOperations[dsName];     
    const record = await( dataSource.findById( recordData.id ) );
    await( saveRecordUpdates(dsName, record, recordData) );
    dsOps.addAttributesToRecord(record, recordData, dataSource);
    await(record.save());
    await( dbUtils.saveExtraData(dsName, recordData.id, body.extraRecordData) );
    ControllerUtils.getOkFunc(res, "Registro salvo com sucesso.")();
}, ControllerUtils.getErrorFunc(res, 400, "Não foi possível criar o registro."))}

export function deleteItem(req: express.Request, res: express.Response) { Sync(function() {

    function hasReferencedObj(modelName: string) {
        const modelRefsOptions = {
            where: {
                model_name: modelName,
                model_ref_id: id
            }
        }
        const newsRefs = await( db.models.NewsModels.find(modelRefsOptions) );
        const personRefs = await( db.models.PersonProjects.find(modelRefsOptions) );
        return newsRefs || personRefs;
    }
    
    let id = req.body.id;
    let modelName = req.body.model;
    var model = dbUtils.getDataSource(modelName);
    const errorFunc = ControllerUtils.getErrorFunc(res, 404, "Não foi possível apagar o registro.");
    
    try {
        if(hasReferencedObj(modelName)) {
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

/**
 * Returns the list of objects that have a admin page
 */
export function sourcesList(req: express.Request, res: express.Response) {
    var list = {
        Basin: 'Bacias',
        Boat: 'Barcos de apoio',
        Block: 'Blocos',
        OilField: 'Campos',
        Contract: 'Contratos',
        MaintenanceDate: 'Datas de manutenção',
        ComercialDeclaration: 'Declarações de comercialidade',
        Company: 'Empresas',
        Fleet: 'Frota Transpetro',
        GasPipeline: 'Gasodutos',
        HydrocarbonEvidence: 'Indicíos de hidrocarbonetos',
        Bid: 'Licitações',
        ExcelImportLog: 'Log da importação de Excel',
        GasMovement: 'Movimentação de gasoduto',
        OilPipeline: 'Oleodutos',
        Person: 'Pessoas',
        Well: 'Poços',
        Production: 'Produção de poços',
        Project: 'Projetos',
        ErrorReport: 'Reports de erros ',
        Refinery: 'Refinarias',
        IndustrySegment: 'Segmentos',
        Seismic: 'Sísmica',
        DrillingRigOffshore: 'Sondas offshore',
        DrillingRigOnshore: 'Sondas onshore',
        Terminal: 'Terminais',
        ProductionUnit: 'Unidades de produção',
        User: 'Usuários',
    };
    
    res.json(list);
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