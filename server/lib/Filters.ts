import { queries } from  '../db/queries/TableQueries';
import { IQueryParams, FilterResult } from '../../common/Interfaces';
import db = require('../db/models');

export async function getFilterResult(qryName: string, fieldName: string):Promise<FilterResult[]> {
    const queryParams: IQueryParams = {
        order: [], 
        filters: [],
        pagination: {
            first: 0,
            itemsPerPage: 300
        } 
    };
    const simpleQueryType = { type: db.sequelize.QueryTypes.SELECT};
    const baseQueryStr = queries[qryName].queryStrFn(queryParams);
    const select = 'select count(*) as qtt, tb.' + fieldName + ' as value ';
    const fromStr = ' from (' + baseQueryStr + ') as tb ';
    const group = ' group by tb.' + fieldName;
    const order = ' order by value ';
    const queryStr = select + fromStr + group + order;
    const recordsPromise = db.sequelize.query(queryStr, simpleQueryType);
    const records = await recordsPromise;
    return records;
}