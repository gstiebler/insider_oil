var await = require('../../lib/await');
import db = require('../models');
import BaseQuery = require('./BaseQuery');

interface IPaginationOpts {
    first: number;
    itemsPerPage: number;
}

interface IFilter {
    field: string;
    like?: string;
    in?: number[];
}

export interface IQueryParams {
    order: string[];
    filters: IFilter[];
    pagination: IPaginationOpts;
}

interface IQueryStrFn {
    (queryParams: IQueryParams): string; 
}

interface ITableQuery {
    queryStrFn: IQueryStrFn;
    fields: BaseQuery.IField[];
}

interface ITableQueries {
    [name: string]: ITableQuery;
}

function getOrderByStr(orderFields: string[]): string {
    let orderByStr = '';
    if( orderFields.length > 0 ) {
        orderByStr += ' order by ';  
        for( let orderField of orderFields ) {
            orderByStr += orderField + ', ';
        }
        orderByStr = orderByStr.substr(0, orderByStr.length - 2);
        orderByStr += ' ';
    }   
    return orderByStr;
}

function getWhereStr(filters: IFilter[]): string {
    let whereStr = '';
    if(filters.length > 0) {
        whereStr = ' where ';
        for(let filter of filters) {
            if(filter.like) {
                whereStr += filter.field + ' like "%' + filter.like + '%" and ';
            } else if (filter.in) {
                // TODO
            }
        }
        whereStr = whereStr.substr(0, whereStr.length - 4);
    }
    return whereStr;
}

function getPaginationStr(pagiOpts: IPaginationOpts): string {
    if(pagiOpts)
        return ' limit ' + pagiOpts.first + ', ' + pagiOpts.itemsPerPage;
    else
        return '';
        
}

export const queries:ITableQueries = {
    Basins: {
        queryStrFn: (queryParams: IQueryParams) => {
            const select = 'select name, "Basin" as model ';
            const fromStr = ' from basins ';
            const where = getWhereStr(queryParams.filters);
            const query = select + fromStr + where;
            return query;
        },
        fields: [
            {
                label: 'Nome',
                ref: {
                    modelField: 'model',
                    idField: 'id',
                    valueField: 'name'
                }
            }
        ]
    }
};

export function getQueryResult(queryName: string, queryParams: IQueryParams): Promise<any> {
    const simpleQueryType = { type: db.sequelize.QueryTypes.SELECT};
    const queryStr = queries[queryName].queryStrFn(queryParams);
    const orderBy = getOrderByStr(queryParams.order);
    const pagi = getPaginationStr(queryParams.pagination);
    const completeQueryStr = queryStr + orderBy + pagi;
    //console.log(completeQueryStr);
    return db.sequelize.query(completeQueryStr, simpleQueryType);
}