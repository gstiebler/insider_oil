var db  = require('../db/models');

exports.OilFieldDeveloping = {
    modelName: 'OilField',
    model: db.OilField,
    filters: {
        stage: 'development'
    }
};


exports.OilFieldProduction = {
    modelName: 'OilField',
    model: db.OilField,
    filters: {
        stage: 'production'
    }
};


exports.ReserveProvenOil = {
    modelName: 'Reserve',
    model: db.Reserve,
    filters: {
        quantity_type: 'proven',
        type: 'oil'
    }
};


exports.ReserveProvenGas = {
    modelName: 'Reserve',
    model: db.Reserve,
    filters: {
        quantity_type: 'proven',
        type: 'gas'
    }
};


exports.ReserveTotalOil = {
    modelName: 'Reserve',
    model: db.Reserve,
    filters: {
        quantity_type: 'total',
        type: 'oil'
    }
};


exports.ReserveTotalOil = {
    modelName: 'Reserve',
    model: db.Reserve,
    filters: {
        quantity_type: 'total',
        type: 'gas'
    }
};