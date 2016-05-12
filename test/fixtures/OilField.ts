import utils = require('../lib/utils');

module.exports = function(db) {
    return db.models.OilField.bulkCreate([
        {
            name: 'Anambé',
            basin_id: utils.idByName('Basin', 'Potiguar'),
            state: 'Alagoas',
            shore: 'on',
            stage: 'production'
        },
        {
            name: 'Jiribatuba2',
            basin_id: utils.idByName('Basin', 'Tucano Central'),
            state: 'Bahia',
            shore: 'on',
            stage: 'production'
        },
        {
            name: 'Abalone',
            basin_id: utils.idByName('Basin', 'Recôncavo'),
            state: 'Espírito Santo',
            shore: 'off',
            stage: 'production'
        },
        {
            name: 'Arapaçu',
            basin_id: utils.idByName('Basin', 'Recôncavo'),
            state: 'Alagoas',
            shore: 'on',
            stage: 'development'
        },
        {
            name: 'Azulão',
            basin_id: utils.idByName('Basin', 'Potiguar'),
            state: 'Amazonas',
            shore: 'on',
            stage: 'development'
        },
        {
            name: 'Baleia Anã',
            basin_id: utils.idByName('Basin', 'Recôncavo'),
            state: 'Espírito Santo',
            shore: 'off',
            stage: 'development'
        },
        {
            name: 'Marlim',
            basin_id: utils.idByName('Basin', 'Campos'),
            state: 'Rio de Janeiro',
            shore: 'off',
            stage: 'production'
        },
        {
            name: 'Albacora',
            basin_id: utils.idByName('Basin', 'Campos'),
            state: 'Rio de Janeiro',
            shore: 'off',
            stage: 'production'
        },
        {
            name: 'Congro',
            basin_id: utils.idByName('Basin', 'Campos'),
            state: 'Rio de Janeiro',
            shore: 'off',
            stage: 'production'
        },
        {
            name: 'Vermelho',
            basin_id: utils.idByName('Basin', 'Campos'),
            state: 'Rio de Janeiro',
            shore: 'off',
            stage: 'production'
        },
        {
            name: 'Marimbá',
            basin_id: utils.idByName('Basin', 'Campos'),
            state: 'Rio de Janeiro',
            shore: 'off',
            stage: 'production'
        },
        {
            name: 'Pampo',
            basin_id: utils.idByName('Basin', 'Campos'),
            state: 'Rio de Janeiro',
            shore: 'off',
            stage: 'production'
        },
        {
            name: 'Roncador',
            basin_id: utils.idByName('Basin', 'Campos'),
            state: 'Rio de Janeiro',
            shore: 'off',
            stage: 'production'
        },
    ]);
}