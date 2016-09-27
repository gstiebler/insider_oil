'use strict';
import * as utils from '../lib/utils';
import { await } from '../../lib/await';

module.exports = function(db) {
    const objs = [
        {
            user: "gstiebler",
            agent: 'agent',
            path: "/get_table_data",
            query: {"queryName":"FPSOs","queryParams":{"pagination":{"first":"0","itemsPerPage":"10"},"order":[{"fieldName":"pu_name","dir":"asc"}]}}
        },
        {
            user: "gstiebler",
            agent: 'agent',
            path: "/view_record/",
            query: {"dataSource":"ProductionUnit","id":"3"}
        },
        {
            user: "maciel",
            agent: 'agent',
            path: "/get_table_data",
            query: {"queryName":"FPSOs","queryParams":{"pagination":{"first":"0","itemsPerPage":"10"},"order":[{"fieldName":"pu_name","dir":"asc"}]}}
        },
    ];

    for(var obj of objs) { 
        await(db.models.RequestLog.create(obj));
    }
}
