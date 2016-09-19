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
                utils.idByName('Company', 'Rosneft'),
                utils.idByName('Company', 'BP Energy'),
            ],
            contractors_scope: [
                'contrato global',
                'engenharia',
            ],
            contractor1Persons: [1, 2, 3],
            contractor2Persons: [4, 5]
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
