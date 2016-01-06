var utils = require('../lib/utils');

module.exports = function(db) {
    return db.Person.bulkCreate([
        {
            name: "Guilherme Stiebler",
            company_id: utils.idByName('Company', 'Petrobrás'),
            phone: "+55 21 99401-1944"
        },
        {
            name: "Felipe",
            company_id: utils.idByName('Company', 'Eni Oil')
        },
        {
            name: "Marcelo",
            company_id: utils.idByName('Company', 'Recôncavo E&P')
        }
    ]);
}
