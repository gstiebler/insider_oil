'use strict';

import * as utils from '../lib/utils';
import { await } from '../../lib/await';

module.exports = function(db) {
    const objs = [
        {
            name: "Revamp de Mexilhão",
            scope: "Escopo do Revamp",
            value: 15000000,
            owner_id: utils.idByName('Company', 'Petrobras'),
            production_unit_id: utils.idByName('ProductionUnit', 'Cidade de São Paulo'),
            oil_field_id: utils.idByName('OilField', 'Marlim'),
            contractors: [
                { id: utils.idByName('Company', 'Rosneft') },
                { id: utils.idByName('Company', 'BP Energy') },
            ],
            contractors_scope: [
                'contrato global',
                'engenharia',
            ],
            contractor1Persons: [
                { id: 1 }, 
                { id: 2 }, 
                { id: 3 }
            ],
            contractor2Persons: [
                { id: 2 }, 
                { id: 3 }
            ]
        },
        {
            name: "Libra",
            scope: "Escopo de Libra",
            value: 123000,
            owner_id: utils.idByName('Company', 'Statoil'),
            production_unit_id: utils.idByName('ProductionUnit', 'Petrobras 52'),
            oil_field_id: utils.idByName('OilField', 'Roncador'),
        },
    ];

    for(var obj of objs) { 
        await(db.models.Project.create(obj));
    }
}
