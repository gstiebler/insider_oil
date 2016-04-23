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
                whereStr += filter.field + ' in (';
                for(let id of filter.in) {
                    whereStr += id + ', '
                }
                whereStr = whereStr.substr(0, whereStr.length - 2);
                whereStr += ') and ';
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
            return select + fromStr + where;
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
    },
    
    Blocks: {
        queryStrFn: (queryParams: IQueryParams) => {
            const select = 'select b.name, b.name_contract, b.status, ' +
                'b.bid, b.end_1, b.end_2, b.end_3, b.end_last, ' +
                'ba.name as basin_name, c.name as operator_name, concessionaries, "Block" as model ';
            const fromStr = ' from blocks b ';
            const joinCompany = ' left outer join companies c on ' +
                'c.id = b.operator_id ';
            const joinBasin = ' left outer join basins ba on ' +
                'ba.id = b.basin_id ';
            const where = getWhereStr(queryParams.filters);
            return select + fromStr + joinCompany + joinBasin + where;
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
    const pagination = getPaginationStr(queryParams.pagination);
    const completeQueryStr = queryStr + orderBy + pagination;
    //console.log(completeQueryStr);
    const recordsPromise = db.sequelize.query(completeQueryStr, simpleQueryType);
    
    const countQuery = 'select count(*) as count from (' + queryStr + ') t';
    const countPromise = db.sequelize.query(countQuery, simpleQueryType);
    return Promise.all([recordsPromise, countPromise]);
}