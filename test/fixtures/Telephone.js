var utils = require('../lib/utils');

module.exports = function(db) {
    return db.Telephone.bulkCreate([
        {
            number: "+55 21 99401-1944",
            person_id: utils.idByName('Person', 'Guilherme Stiebler')
        },
        {
            number: "+55 21 234-5678",
            person_id: utils.idByName('Person', 'Felipe')
        },
        {
            number: "98989-9498",
            person_id: utils.idByName('Person', 'Felipe')
        },
        {
            number: "+101 232 1100194",
            person_id: utils.idByName('Person', 'Marcelo')
        },
    ]);
}
