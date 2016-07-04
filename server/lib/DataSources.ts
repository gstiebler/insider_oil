import db  = require('../db/models');

exports.OilFieldDeveloping = {
    modelName: 'OilField',
    model: db.models.OilField,
    filters: {
        stage: 'development'
    }
};


exports.OilFieldProduction = {
    modelName: 'OilField',
    model: db.models.OilField,
    filters: {
        stage: 'production'
    }
};


exports.ReserveProvenOil = {
    modelName: 'Reserve',
    model: db.models.Reserve,
    filters: {
        quantity_type: 'proven',
        type: 'oil'
    }
};


exports.ReserveProvenGas = {
    modelName: 'Reserve',
    model: db.models.Reserve,
    filters: {
        quantity_type: 'proven',
        type: 'gas'
    }
};


exports.ReserveTotalOil = {
    modelName: 'Reserve',
    model: db.models.Reserve,
    filters: {
        quantity_type: 'total',
        type: 'oil'
    }
};


exports.ReserveTotalGas = {
    modelName: 'Reserve',
    model: db.models.Reserve,
    filters: {
    quantity_type: 'total',
        type: 'gas'
    }
};


exports.ProductionOnshore = {
    modelName: 'Production',
    model: db.models.Production,
    filters: {
        shore: 'on'
    }
};


exports.ProductionOffshore = {
    modelName: 'Production',
    model: db.models.Production,
    filters: {
        shore: 'off'
    }
};