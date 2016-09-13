'use strict';

import * as utils from '../lib/utils';
import { await } from '../../lib/await';

module.exports = function(db) {
    const objs = [
        {
            name: "ILHA DO ARAMAÇA",
            type: "BALSA",
            owner_id: utils.idByName('Company', 'Petrobras'),
            operator_id: utils.idByName('Company', 'Eni Oil'),
            info_json: {
                'Capacidade de passageiros': 333,
                'Situação': 'PRÓPRIA' 
            },
        },
        {
            name: "GLASGOW",
            type: "REBOCADOR/EMPURRADOR",
            owner_id: utils.idByName('Company', 'Imetame'),
            operator_id: utils.idByName('Company', 'Chevron Frade'),
            info_json: {
                'Comprimento': 53,
                'BHP': 521.00 
            },
        },
    ];

    for(var obj of objs) { 
        await(db.models.Boat.create(obj));
    }
}
