'use strict';

var utils = require('../lib/utils');

module.exports = function(db) {
    const personObjs = [
        {
            name: "Guilherme Stiebler",
            company_id: utils.idByName('Company', 'Petrobras'),
            telephones: ['+55 21 99401-1944'],
            projects: [{
                model_id: utils.idByName('ModelsList', 'Basin'),
                id: utils.idByName('Basin', 'Amazonas'),
                description: 'diretor'
            }]
        },
        {
            name: "Felipe",
            company_id: utils.idByName('Company', 'Eni Oil'),
            telephones: ["+55 21 234-5678", "98989-9498"]
        },
        {
            name: "Marcelo",
            company_id: utils.idByName('Company', 'Recôncavo E&P'),
            telephones: ["+101 232 1100194"]
        }
    ];
    
    const promisesArray = [];
    for(var personObj of personObjs) {
        promisesArray.push(db.Person.create(personObj));
    }
    
    return Promise.all(promisesArray);
}
