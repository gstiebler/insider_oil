"use strict";
var db = require('../db/models');
var fileUpload = require('../lib/fileUpload');
var dbUtils = require('../lib/dbUtils');
var dsParams = require('../lib/DataSourcesParams');
var importExcel = require('../lib/importExcel');
var ControllerUtils = require('../lib/ControllerUtils');
var Sync = require('sync');
var winston = require('winston');


function getFieldTypes(fields) {
    const types = {};
    for( var i = 0; i < fields.length; i++) {
        types[fields[i].name] = fields[i].type;
    }
    return types;
}


exports.main = function(req, res, next) {
    const modelName = req.query.table;
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
            const fields = dbUtils.getModelFields(modelName);
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


exports.uploadFile = function(req, res, next) {
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


exports.modelFields = function(req, res, next) {
    var modelName = req.query.model;
    var fields = dbUtils.getModelFields(modelName);
    res.json( { fields: fields } );
}


exports.recordValues = function(req, res, next) {
    var modelName = req.query.model;
    var id = req.query.id;
    const dataSource = dbUtils.getDataSource(modelName);
    dataSource.findById(id).then(onRecord)
        .catch(ControllerUtils.getErrorFunc(res, 404, "Registro não encontrado"));
    
    function onRecord(record) { Sync(function(){
        try{
            var fields = dbUtils.getModelFields(modelName);
            
            res.json({ 
                values: record,
                fields: fields
            });
        } catch(error) {
            ControllerUtils.getErrorFunc(res, 500, "Problemas ao recuperar o registro")(error);
        }
    });}
}


exports.createItem = function(req, res, next) {
    var newItemData = req.body.newItemData;
    var modelName = req.body.model;
    var model = dbUtils.getDataSource(modelName);

	db.sequelize.transaction(function(t) {
	       return model.create(newItemData)
	            .then(ControllerUtils.getOkFunc(res, "Registro criado com sucesso."))
	           .catch(ControllerUtils.getErrorFunc(res, 400, "Não foi possível criar o registro."));
    });
}


exports.saveItem = function(req, res, next) {
    var modelName = req.body.model;
    var recordData = req.body.record;
    var model = dbUtils.getDataSource(modelName);     
    model.findById( recordData.id )
        .then(onFindRecord)
        .catch(ControllerUtils.getErrorFunc(res, 404, "Não foi possível encontrar o registro."));
    
    function onFindRecord(record) {
        for(var attributeName in recordData)
            record[attributeName] = recordData[attributeName];
        record.save()
            .then(ControllerUtils.getOkFunc(res, "Registro salvo com sucesso."))
            .catch(ControllerUtils.getErrorFunc(res, 400, "Não foi possível salvar o registro."));
    }
}


exports.deleteItem = function(req, res) {
    var id = req.query.id;
    var modelName = req.query.model;
    var model = dbUtils.getDataSource(modelName);     
    model.destroy({ where: { id: id } })
        .then(ControllerUtils.getOkFunc(res, 'Registro apagado com sucesso'))
        .catch( ControllerUtils.getErrorFunc(res, 404, "Não foi possível apagar o registro.") );
}


exports.getComboValues = function(req, res) {
    var modelName = req.query.model;
    var model = dbUtils.getDataSource(modelName);     
    model.findAll().then(onValues)
        .catch(ControllerUtils.getErrorFunc(res, 500, "Não foi possível carregar os registros."));
    
    function onValues(values) {
        var valuesArray = [];
        values.forEach( function(value) {
            valuesArray.push( {
                id: value.id, 
                label: value.dataValues.name // TODO using 'name' as field. Should change for label field configuration
            });
        });
        res.json(valuesArray);
    }
}


exports.viewRecord = function(req, res, next) {
    var dataSourceName = req.query.dataSource;
    var id = req.query.id;
    var dataSource = dbUtils.getDataSource(dataSourceName);
    var options = {};
    options.include = [{all: true}];
    dataSource.findById(id, options).then(onRecord)
        .catch(ControllerUtils.getErrorFunc(res, 404, "Registro não encontrado"));
    
    function onRecord(record) { Sync(function() {
        var fields = dbUtils.getModelFields(dataSourceName);
        var recordValues = [];
        
        for( var i = 0; i < fields.length; i++ ) {
            const item = fields[i];
            item.value = record[fields[i].name];
            
            if(fields[i].type == 'ref') {
                item.ref = true;
                item.name = record[fields[i].association].name;
            }
            recordValues.push(item);
        }
        
        const viewParams = dsParams[dataSource.name];
        const result = {
            record: recordValues,
            referencedObjects: viewParams.referencedObjectsOnView
        };
        res.json(result);
    })};
}


exports.getQueryData = function(req, res) {
    const dataSourceName = req.query.dataSource;
    const queryName = req.query.queryName;
    const filter = req.query.filter;
    const dataSource = dbUtils.getDataSource(dataSourceName);
    if(!dataSource) {
    	ControllerUtils.getErrorFunc(res, 500, "Modelo não encontrado")({});
        return;
    }
    const viewParams = dsParams[dataSource.name];
    const queryStr = viewParams.queries[queryName](filter);
    const simpleQueryType = { type: db.Sequelize.QueryTypes.SELECT};
    db.sequelize.query(queryStr, simpleQueryType).then( (records) => {
        const fields = dbUtils.getModelFields(dataSourceName);
        const result = {
            viewParams: viewParams,
            records: records,
            types: getFieldTypes(fields)
        };
        res.json(result);
    }).catch(ControllerUtils.getErrorFunc(res, 500, "Erro"));
}


exports.sourcesList = function(req, res) {
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