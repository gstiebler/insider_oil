import { queries } from  '../db/queries/TableQueries';
import { IQueryParams } from '../../common/Interfaces';
import * as libAwait from '../lib/await';
import db = require('../db/models');

export class FilterResult {
    value: string;
    qtt: number;
}

export function getFilterResult(qryName: string, fieldName: string):FilterResult[] {
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
    const records = libAwait.await(recordsPromise);
    return records;
}