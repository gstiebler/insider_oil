'use strict';

import db = require('../models');

const queries = {
    ProductionByField: (queryParams) => {
        const select = 'select sum(oil_production) as oil_production, ' +
            'sum(oil_condensed_production) as oil_condensed_production, ' +
            'sum(gas_associated_production) as gas_associated_production, ' +
            'sum(gas_non_associated_production) as gas_non_associated_production, ' +
            'concat(lpad(period_month, 2, "0"), "/", period_year) as date_prod ';
        const from = 'from production p ';
	    const pwJoin = 'left outer join production_wells pw on p.production_well_id = pw.id ';
        const ofJoin = 'left outer join oil_fields of on pw.oil_field_id = of.id ';
        const where = 'where of.id = ' + queryParams.oilField;
        const group = ' group by period_year, period_month ';
        const order = 'order by period_year, period_month';
        return select + from + pwJoin + ofJoin + where + group + order;
    }
};

export function getData(queryName: string, queryParams): Promise<any> {
    const simpleQueryType = { type: db.sequelize.QueryTypes.SELECT};
    const queryFn = queries[queryName];
    const queryStr = queryFn(queryParams);
    const promise = db.sequelize.query(queryStr, simpleQueryType);
    return promise;
}