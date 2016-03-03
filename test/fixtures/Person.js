var utils = require('../lib/utils');

module.exports = function(db) {
    return db.Person.bulkCreate([
        {
            name: "Guilherme Stiebler",
            company_id: utils.idByName('Company', 'Petrobrás'),
            telephones: ["+55 21 99401-1944"],
            projects: [{
                model_id: 2,
                model_ref_id: 1
            }]
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
