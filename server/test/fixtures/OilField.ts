import utils = require('../lib/utils');

module.exports = function(db) {
    const parameters = [
        {
            name: 'Anambé',
            basin_id: utils.idByName('Basin', 'Potiguar'),
            operator_id: utils.idByName('Company', 'Petrobras'),
            state: 'Alagoas',
            shore: 'on',
            stage: 'production',
            concessionaries: 
                [ { id: utils.idByName('Company', 'Eni Oil')  },
                { id: utils.idByName('Company', 'Petrobras')  } ],
            concessionaries_props: [ 30, 70 ],
        },
        {
            name: 'Jiribatuba2',
            basin_id: utils.idByName('Basin', 'Tucano Central'),
            operator_id: utils.idByName('Company', 'Petrobras'),
            state: 'Bahia',
            shore: 'on',
            stage: 'production',
            block_id: utils.idByName('Block', 'BM-BAR-1'),
        },
        {
            name: 'Abalone',
            basin_id: utils.idByName('Basin', 'Recôncavo'),
            operator_id: utils.idByName('Company', 'Statoil'),
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
    ];

    const promisesArray = [];
    for(var oilFieldObj of parameters) {
        promisesArray.push(db.models.OilField.create(oilFieldObj));
    }
    
    return Promise.all(promisesArray);
}