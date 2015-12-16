"use strict";
var db  = require('../db/models');
var tableViewParams = require('../lib/tableViewParams');
var fileUpload = require('../lib/fileUpload');
var importExcel = require('../lib/importExcel');
var dbUtils = require('../lib/dbUtils');

function getErrorFunc(res, errorCode, msg) {
    return function(error) { 
        res.status(errorCode).json( { errorMsg: msg, errors: error.errors } )
    };
}


function getOkFunc(res) {
    return function returnOkJson() {
        res.json( { msg: "OK" } );
    }
}


exports.main = function(req, res, next) {
    var modelName = req.query.table;
    var model = db[modelName];
    if(!model) {
        getErrorFunc(res, 500, "Modelo não encontrado")({});
        return;
    }
    dbUtils.findAllCustom(model).then(sendRecords)
        .catch(getErrorFunc(res, 500, "Erro"));
    
    function sendRecords(records) {
        var viewParams = tableViewParams[modelName]();
        viewParams.gridFields.push('id');
        dbUtils.simplifyArray( model, records );
        var responseObj = {
            records: records,
            viewParams: viewParams
        };
        res.json( responseObj );
    }
}


exports.uploadFile = function(req, res, next) {
    fileUpload.receive( req, onFile, onFinish );

    function onFile(fileName, buf) {
        console.log( "File name: " + fileName );
        var model = req.query.table;
        importExcel(buf, model, onOk, onError);
        
        function onOk(status) {
            res.json( { status: status } );
        }
        
        function onError(err) {
            res.status(400).json( { errorMsg: err } );
        }
    }
      
    function onFinish() {
        console.log('Done parsing form!');
    };
}


function getModelFields(modelName) {
    var model = db[modelName];
    var viewParams = tableViewParams[modelName]();
    var fields = {};
    for(var attributeName in model.attributes) {
        if(model.attributes[attributeName]._autoGenerated) continue;
        
        const att = viewParams.fields[attributeName];
        if(!att) continue;
        fields[attributeName] = {
            label: att.label,
            type: model.attributes[attributeName].type.toString()
        };
    }
    
    for( var associationName in model.associations ) {
        const association = model.associations[associationName];
        const fieldName = association.identifierField;
        const att = viewParams.fields[fieldName];
        fields[fieldName] = {
            label: att.label,
            type: 'ref',
            model: association.target.name 
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


exports.modelFields = function(req, res, next) {
    var modelName = req.query.model;
    var fields = getModelFields(modelName);
    res.json( { fields: fields } );
}


exports.recordValues = function(req, res, next) {
    var modelName = req.query.model;
    var id = req.query.id;
    var model = db[modelName];
    model.findById(id).then(onRecord)
        .catch(getErrorFunc(res, 404, "Registro não encontrado"));
    
    function onRecord(record) {
        var fields = getModelFields(modelName);
        res.json({ 
            values: record,
            fields: fields
        });
    }
}


exports.createItem = function(req, res, next) {
    var newItemData = req.body.newItemData;
    var modelName = req.body.model;
    var model = db[modelName];     
    model.create(newItemData)
        .then(getOkFunc(res))
        .catch(getErrorFunc(res, 400, "Não foi possível criar o registro."));
}


exports.saveItem = function(req, res, next) {
    var modelName = req.body.model;
    var recordData = req.body.record;
    var model = db[modelName];     
    model.findById( recordData.id )
        .then(onFindRecord)
        .catch(getErrorFunc(res, 404, "Não foi possível encontrar o registro."));
    
    function onFindRecord(record) {
        for(var attributeName in recordData)
            record[attributeName] = recordData[attributeName];
        record.save()
            .then(getOkFunc(res))
            .catch(getErrorFunc(res, 400, "Não foi possível salvar o registro."));
    }
}


exports.deleteItem = function(req, res) {
    var id = req.query.id;
    var modelName = req.query.model;
    var model = db[modelName];     
    model.destroy({ where: { id: id } })
        .then(getOkFunc(res))
        .catch( getErrorFunc(res, 404, "Não foi possível apagar o registro.") );
}


exports.getComboValues = function(req, res) {
    var modelName = req.query.model;
    var model = db[modelName];     
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