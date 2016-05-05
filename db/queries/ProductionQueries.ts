'use strict';

import db = require('../models');

const queries = {
    byField: (queryParams) => {
        return 'select * from production';
    }
};

export function getProductionData(queryName: string, queryParams): Promise<any> {
    const simpleQueryType = { type: db.sequelize.QueryTypes.SELECT};
    const queryFn = queries[queryName];
    const queryStr = queryFn(queryParams);
    const promise = db.sequelize.query(queryStr, simpleQueryType);
    return promise;
}