'use strict';

import * as utils from '../lib/utils';
import { await } from '../../lib/await';
import { IProjectJsonField } from '../../../common/Interfaces';

module.exports = function(db) {
    const jsonField1:IProjectJsonField = {
        "contractors": [
            {
                "scope": "contrato global", 
                "persons_id": ["1", "2", "3"],
                "contractor_id": "39"
            },
            {
                "scope": "engenharia",
                "persons_id": ["2", "3"],
                "contractor_id": "17"
            }
        ],
        owner_persons_id: ["2", "1"]
    };
    const objs = [
        {
            name: "Revamp de Mexilhão",
            scope: "Escopo do Revamp",
            value: 15000000,
            owner_id: utils.idByName('Company', 'Petrobras'),
            production_unit_id: utils.idByName('ProductionUnit', 'Cidade de São Paulo'),
            oil_field_id: utils.idByName('OilField', 'Marlim'),
            objects: [{
                model: 'ProductionUnit',
                id: utils.idByName('ProductionUnit', 'Pioneer'),
            }],
            json_field: jsonField1,
            stage: 'OPEX'
        },
        {
            name: "Libra",
            scope: "Escopo de Libra",
            value: 123000,
            owner_id: utils.idByName('Company', 'Statoil'),
            production_unit_id: utils.idByName('ProductionUnit', 'Petrobras 52'),
            oil_field_id: utils.idByName('OilField', 'Roncador'),
            stage: 'CAPEX'
        },
    ];

    for(var obj of objs) { 
        await(db.models.Project.create(obj));
    }
}
