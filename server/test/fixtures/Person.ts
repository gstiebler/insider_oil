'use strict';

import * as utils from '../lib/utils';
import { await } from '../../lib/await';

module.exports = function(db) {
    const personObjs = [
        {
            name: "Guilherme Stiebler",
            company_id: utils.idByName('Company', 'Petrobras'),
            telephones: ['+55 21 99401-1944'],
            projects: [{
                model: 'Basin',
                id: utils.idByName('Basin', 'Amazonas'),
                description: 'diretor'
            }],
            emails: [
                'gstiebler@gmail.com',
                'guilhermemst@gmail.com'
            ],
            info: {
                cargo: "gerente", 
                "teste 2": "valor"
            }
        },
        {
            name: "Felipe",
            company_id: utils.idByName('Company', 'Eni Oil'),
            telephones: ["+55 21 234-5678", "98989-9498"],
            emails: [
                'grandin@gmail.com',
            ]
        },
        {
            name: "Marcelo",
            company_id: utils.idByName('Company', 'Recôncavo E&P'),
            telephones: ["+101 232 1100194"],
            emails: [
                'maciel.felipe@gmail.com',
            ]
        },
        {
            name: "Julio",
            company_id: utils.idByName('Company', 'Statoil'),
            telephones: [],
            emails: []
        },
        {
            name: "Artur",
            company_id: utils.idByName('Company', 'Rosneft'),
            telephones: [],
            emails: [
                'artur@gmail.com',
            ]
        }
    ];

    for(var obj of personObjs) { 
        await(db.models.Person.create(obj));
    }
}
