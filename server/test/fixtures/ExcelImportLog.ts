import utils = require('../lib/utils');

module.exports = function(db) {
    return db.models.ExcelImportLog.bulkCreate([
        {
            user: 'Felipe Maciel',
            model: 'Block',
            file_name: 'elvis.jpg',
            status: 'Processing',
            result: '1 registro errado',
        },
        {
            user: 'Felipe Grandin',
            model: 'Oil Field',
            file_name: 'pokemons.xlsx',
            status: 'Processing',
            result: '2 registros errados',
        },
    ]);
}