import utils = require('../lib/utils');

module.exports = function(db) {
    return db.models.OilField.bulkCreate([
        {
            name: 'Anambé',
            basin_id: utils.idByName('Basin', 'Potiguar'),
            state: 'Alagoas',
            concessionaries: 'Petrobras¹ (100)',
            shore: 'on',
            stage: 'production'
        },
        {
            name: 'Jiribatuba2',
            basin_id: utils.idByName('Basin', 'Tucano Central'),
            state: 'Bahia',
            concessionaries: 'Alvopetro¹ (100)',
            shore: 'on',
            stage: 'production'
        },
        {
            name: 'Abalone',
            basin_id: utils.idByName('Basin', 'Recôncavo'),
            state: 'Espírito Santo',
            concessionaries: 'Shell Brasil¹ (50)/ONGC Campos (27)/QPI Brasil Petróleo (23)',
            shore: 'off',
            stage: 'production'
        },
        {
            name: 'Arapaçu',
            basin_id: utils.idByName('Basin', 'Recôncavo'),
            state: 'Alagoas',
            concessionaries: 'Petrobras¹ (100)',
            shore: 'on',
            stage: 'development'
        },
        {
            name: 'Azulão',
            basin_id: utils.idByName('Basin', 'Potiguar'),
            state: 'Amazonas',
            concessionaries: 'Petrobras¹ (100)',
            shore: 'on',
            stage: 'development'
        },
        {
            name: 'Baleia Anã',
            basin_id: utils.idByName('Basin', 'Recôncavo'),
            state: 'Espírito Santo',
            concessionaries: 'Petrobras¹ (100)',
            shore: 'off',
            stage: 'development'
        }
    ]);
}