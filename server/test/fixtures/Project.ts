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

    const jsonField2:IProjectJsonField = {
        "contractors": [
            {
                "scope": "engenharia",
                "persons_id": ["2"],
                "contractor_id": "17",
                contracts_id: ["2"]
            }
        ],
        owner_persons_id: ["1"]
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
            segment_type: 'Petróleo',
            stage: 'OPEX'
        },
        {
            name: "Libra",
            owner_id: 15,
            scope: "Escopo de Libra",
            value: 123000,
            segment_type: 'Petróleo',
            json_field: jsonField2,
            stage: 'CAPEX'
        },
        {
            name: "Áries",
            scope: "Escopo de Áries",
            segment_type: 'Gás',
            value: 1234,
            json_field: jsonField2,
            stage: 'CAPEX'
        },
    ];

    for(var obj of objs) { 
        await(db.models.Project.create(obj));
    }
}
