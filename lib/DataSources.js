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