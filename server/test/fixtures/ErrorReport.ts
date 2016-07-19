import utils = require('../lib/utils');

module.exports = function(db) {
    return db.models.ErrorReport.bulkCreate([
        {
            reporter_id: utils.idByName('User', 'Felipe Maciel'),
            responsible_id: utils.idByName('User', 'Guilherme Stiebler'),
            url: 'http://app.insideroil.com/app/view_record?Model=Block&id=2',
            status: 'Em aberto',
            description: 'A localização do bloco está errada',
        },
    ]);
}