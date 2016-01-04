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


exports.ProductionOnshore = {
    modelName: 'Production',
    model: db.Production,
    filters: {
        shore: 'on'
    }
};


exports.ProductionOffshore = {
    modelName: 'Production',
    model: db.Production,
    filters: {
        shore: 'off'
    }
};