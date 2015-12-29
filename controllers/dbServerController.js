"use strict";
var db  = require('../db/models');
var tableViewParams = require('../lib/tableViewParams');
var fileUpload = require('../lib/fileUpload');
var importExcel = require('../lib/importExcel');
var dbUtils = require('../lib/dbUtils');

function getErrorFunc(res, errorCode, msg) {
    return function(error) { 
        var errors = error.errors ? error.errors : [];
        if((typeof error) == 'string')
            errors.push( { message: error } );
        res.status(errorCode).json( {
            errorMsg: msg, 
            errors: errors 
        } )
        if(process.env['NODE_ENV'] != 'test')
            console.log(JSON.stringify(error, null, '  '));
    };
}


function getOkFunc(res, msg) {
    return function returnOkJson() {
        res.json( { msg: msg } );
    }
}


exports.main = function(req, res, next) {
    const modelName = req.query.table;
    const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
    var dataSource = dbUtils.getDataSource(modelName);
    if(!dataSource) {
        getErrorFunc(res, 500, "Modelo não encontrado")({});
        return;
    }
    dbUtils.findAllCustom(dataSource, {}, filters).then(sendRecords)
        .catch(getErrorFunc(res, 500, "Erro"));
    
    function sendRecords(records) {
        const viewParams = tableViewParams[dataSource.name];
        viewParams.gridFields.push('id');
        dbUtils.simplifyArray( dataSource, records );
        const fields = dbUtils.getModelFields(modelName);
        const types = {};
        for( var i = 0; i < fields.length; i++)
            types[fields[i].name] = fields[i].type;
        const responseObj = {
            records: records,
            viewParams: viewParams,
            types: types
        };
        res.json( responseObj );
    }
}


exports.uploadFile = function(req, res, next) {
    fileUpload.receive( req, onFile, onFinish );

    function onFile(fileName, buf) {
        console.log( "File name: " + fileName );
        var model = req.query.table;
        try {
            importExcel(buf, model, onOk, onError);
        } catch(err) {
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
        console.log('Done parsing form!');
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
    var model = dbUtils.getDataSource(modelName);
    model.findById(id).then(onRecord)
        .catch(getErrorFunc(res, 404, "Registro não encontrado"));
    
    function onRecord(record) {
        var fields = dbUtils.getModelFields(modelName);
        res.json({ 
            values: record,
            fields: fields
        });
    }
}


exports.createItem = function(req, res, next) {
    var newItemData = req.body.newItemData;
    var modelName = req.body.model;
    var model = dbUtils.getDataSource(modelName);
    model.create(newItemData)
        .then(getOkFunc(res, "Registro criado com sucesso."))
        .catch(getErrorFunc(res, 400, "Não foi possível criar o registro."));
}


exports.saveItem = function(req, res, next) {
    var modelName = req.body.model;
    var recordData = req.body.record;
    var model = dbUtils.getDataSource(modelName);     
    model.findById( recordData.id )
        .then(onFindRecord)
        .catch(getErrorFunc(res, 404, "Não foi possível encontrar o registro."));
    
    function onFindRecord(record) {
        for(var attributeName in recordData)
            record[attributeName] = recordData[attributeName];
        record.save()
            .then(getOkFunc(res, "Registro salvo com sucesso."))
            .catch(getErrorFunc(res, 400, "Não foi possível salvar o registro."));
    }
}


exports.deleteItem = function(req, res) {
    var id = req.query.id;
    var modelName = req.query.model;
    var model = dbUtils.getDataSource(modelName);     
    model.destroy({ where: { id: id } })
        .then(getOkFunc(res, 'Registro apagado com sucesso'))
        .catch( getErrorFunc(res, 404, "Não foi possível apagar o registro.") );
}


exports.getComboValues = function(req, res) {
    var modelName = req.query.model;
    var model = dbUtils.getDataSource(modelName);     
    model.findAll().then(onValues)
        .catch(getErrorFunc(res, 500, "Não foi possível carregar os registros."));
    
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
    var model = dbUtils.getDataSource(dataSourceName);
    var options = {};
    options.include = [{all: true}];
    model.findById(id, options).then(onRecord)
        .catch(getErrorFunc(res, 404, "Registro não encontrado"));
    
    function onRecord(record) {
        var fields = dbUtils.getModelFields(dataSourceName);
        var result = [];
        
        for( var i = 0; i < fields.length; i++ ) {
            var item = {
                label: fields[i].label,
                value: record[fields[i].name]
            };
            
            if(fields[i].type == 'ref') {
                item.ref = true;
                item.source = fields[i].model;
                item.name = record[fields[i].association].name;
            }
            result.push(item);
        }
        
        res.json(result);
    }
}


exports.sourcesList = function(req, res) {
    var list = {
        Well: 'Poços',
        DrillingRig: 'Sondas',
        Company: 'Empresas',
        Persons: 'Pessoas',
        OilFieldDeveloping: 'Campos em desenvolvimento',
        OilFieldProduction: 'Campos em produção'
    };
    
    res.json(list);
}