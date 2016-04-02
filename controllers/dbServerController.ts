var db = require('../db/models');
var fileUpload = require('../lib/fileUpload');
var Sync = require('sync');
var await = require('../lib/await');
import ControllerUtils = require('../lib/ControllerUtils');
import importExcel = require('../lib/importExcel');
import winston = require('winston');
import dbUtils = require("../lib/dbUtils");
import dsParams = require('../lib/DataSourcesParams');
import express = require("express");
import DataSourceOperations = require('../lib/DataSourceOperations/index');
var ComboQueries = require('../db/queries/ComboQueries');
 
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
        try {
            importExcel(buf, model, onOk, onError);
        } catch(err) {
            winston.error(err);
            res.status(400).json( { errorMsg: err } );
        }
        
        function onOk(status, recordsStatus) {
            res.json( { status: status, recordsStatus: recordsStatus } );
        }
        
        function onError(err) {
            res.status(400).json( { errorMsg: err } );
        }
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


export function createItem(req: express.Request, res: express.Response, next) {
    var newItemData = req.body.newItemData;
    var modelName = req.body.model;
    var model = dbUtils.getDataSource(modelName);

	db.sequelize.transaction(function(t) {
	       return model.create(newItemData)
	            .then(ControllerUtils.getOkFunc(res, "Registro criado com sucesso."))
	           .catch(ControllerUtils.getErrorFunc(res, 400, "Não foi possível criar o registro."));
    });
}


export function saveItem(req: express.Request, res: express.Response, next) {
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
    }
}


export function deleteItem(req: express.Request, res: express.Response) { Sync(function() {
    function hasReferencedObj() {
        // check if a news deference the object
        const modelInList = await(db.ModelsList.find({ where: { name: modelName } }));
        if(!modelInList)
            return false;
        const modelRefsOptions = {
            where: {
                model_id: modelInList.id,
                model_ref_id: id
            }
        }
        const newsRefs = await( db.NewsModels.find(modelRefsOptions) );
        const personRefs = await( db.PersonProjects.find(modelRefsOptions) );
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
    const labelField = 'name';  
    // default combo list 
    if(model) {
        // TODO using 'name' as field. Should change for label field configuration
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
        const dsOperations = DataSourceOperations[dataSourceName];
        const recordValues = dsOperations.recordToViewValues(dataSourceName, record);
        const viewParams = dsParams[dataSource.name];
        const result = {
            record: recordValues,
            referencedObjects: viewParams.referencedObjectsOnView
        };
        res.json(result);
        return null;
    })
    return null;
    };
}


export function getQueryData(req: express.Request, res: express.Response) {Sync(function(){
    const dataSourceName = req.query.dataSource;
    const queryName = req.query.queryName;
    const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
    const dataSource = dbUtils.getDataSource(dataSourceName);
    if(!dataSource) {
    	ControllerUtils.getErrorFunc(res, 500, "Modelo não encontrado")({});
        return;
    }
    const viewParams = dsParams[dataSource.name];
    const queryStrGenerator = viewParams.queries[queryName];
    const queryStr = queryStrGenerator(filters);
    const simpleQueryType = { type: db.Sequelize.QueryTypes.SELECT};
    db.sequelize.query(queryStr, simpleQueryType).then( (records) => {
        const dsOperations = DataSourceOperations[dataSourceName];
        const fields = dsOperations.getModelFields(dataSourceName, true);
        const result = {
            viewParams: viewParams,
            records: records,
            types: getFieldTypes(fields)
        };
        res.json(result);
    }).catch(ControllerUtils.getErrorFunc(res, 500, "Erro"));
})}


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
        OilFieldDeveloping: 'Campos em desenvolvimento',
        OilFieldProduction: 'Campos em produção',
        Seismic: 'Sísmica',
        AmbientalLicense: 'Licenças ambientais',
        FPSOProduction: 'Produção UEP FPSO',
        FixedUEPProduction: 'Produção UEP Fixa',
        ReserveProvenOil: 'Reservas provadas de óleo',
        ReserveProvenGas: 'Reservas provadas de gás',
        ReserveTotalOil: 'Reservas totais de óleo',
        ReserveTotalGas: 'Reservas totais de gás',
        ProductionOnshore: 'Produção onshore',
        ProductionOffshore: 'Produção offshore'
    };
    
    res.json(list);
}