var utils = require('../lib/utils');

module.exports = function(db) {
    return db.News.bulkCreate([
        {
            title: 'Petrobrás compra Statoil',
            content: 'Isto aconteceu ontem com muita cobertura da imprensa',
            author_id: utils.idByName('User', 'Felipe Grandin')
        },
        {
            title: 'Petrobrás demite presidente',
            content: 'Já estava na hora',
            author_id: utils.idByName('User', 'Felipe Maciel')
        },
        {
            title: 'Petrobrás é privatizada',
            content: 'Ações multiplicam por 4 no dia seguinte',
            author_id: utils.idByName('User', 'Guilherme Stiebler')
        }
    ]);
}