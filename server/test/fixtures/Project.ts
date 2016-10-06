'use strict';

import * as utils from '../lib/utils';
import { await } from '../../lib/await';
import { IProjectJsonField, IFrontEndProject } from '../../../common/Interfaces';

module.exports = function(db) {
    const jsonField1:IProjectJsonField = {
        "contractors": [
            {
                "scope": "contrato global", 
                "persons_id": ["1", "2", "3"],
                "contractor_id": "39",
                contracts_id: ["2", "3"]
            },
            {
                "scope": "engenharia",
                "persons_id": ["2", "3"],
                "contractor_id": "17",
                contracts_id: ["2", "1"]
            }
        ],
        owner_persons_id: ["2", "1"]
    };

    const mexilhaoObjs:IFrontEndProject[] = [{
        model: 'ProductionUnit',
        id: utils.idByName('ProductionUnit', 'Pioneer'),
        description: 'Plataforma'
    }];

    const objs = [
        {
            name: "Revamp de Mexilhão",
            scope: "Escopo do Revamp",
            value: 15000000,
            owner_id: utils.idByName('Company', 'Petrobras'),
            objects: mexilhaoObjs,
            json_field: jsonField1,
            stage: 'OPEX'
        },
        {
            name: "Libra",
            scope: "Escopo de Libra",
            value: 123000,
            oil_field_id: utils.idByName('OilField', 'Roncador'),
            stage: 'CAPEX'
        },
    ];

    for(var obj of objs) { 
        await(db.models.Project.create(obj));
    }
}
