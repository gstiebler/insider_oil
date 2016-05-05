'use strict';

import db = require('../models');

const queries = {
    byField: (queryParams) => {
        const select = 'select sum(oil_production) as oil_production, count(p.id), concat(lpad(period_month, 2, "0"), "/", period_year) as date_prod ';
        const from = 'from production p ';
	    const pwJoin = 'left outer join production_wells pw on p.production_well_id = pw.id ';
        const ofJoin = 'left outer join oil_fields of on pw.oil_field_id = of.id ';
        const where = 'where of.id = ' + queryParams.oilField;
        const group = ' group by period_year, period_month ';
        const order = 'order by period_year, period_month';
        return select + from + pwJoin + ofJoin + where + group + order;
    }
};

export function getProductionData(queryName: string, queryParams): Promise<any> {
    const simpleQueryType = { type: db.sequelize.QueryTypes.SELECT};
    const queryFn = queries[queryName];
    const queryStr = queryFn(queryParams);
    const promise = db.sequelize.query(queryStr, simpleQueryType);
    return promise;
}