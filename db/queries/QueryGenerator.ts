'use strict';

export interface IFilter {
    field: string;
    like?: string;
    in?: number[];
}

export function getOrderByStr(orderFields: string[]): string {
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

export interface IPaginationOpts {
    first: number;
    itemsPerPage: number;
}

export function getWhereStr(filters: IFilter[]): string {
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

export function getPaginationStr(pagiOpts: IPaginationOpts): string {
    if(pagiOpts)
        return ' limit ' + pagiOpts.first + ', ' + pagiOpts.itemsPerPage;
    else
        return '';
        
}

function genTableSelectStr(tableQryOpts: ITableQueryOpts, aliasMap):string {
    let resultQry = '';
    for(let field of tableQryOpts.fields) {
        if(typeof field == 'string') {
            resultQry += tableQryOpts.name + '.' + field;
        } else {
            const completeFieldName = tableQryOpts.name + '.' + field[0];
            resultQry += completeFieldName + ' as ' + field[1];
            aliasMap[field[0]] = completeFieldName;
        }
        resultQry += ', ';
    }
    return resultQry;
}

export function genSelectStr(queryOpts: IQueryOpts, aliasMap):string {
    let resultQry = 'select ' + genTableSelectStr(queryOpts.table, aliasMap);
    for(let joinTable of queryOpts.joinTables) {
        resultQry += genTableSelectStr(joinTable, aliasMap);
    }
    for(let extraField of queryOpts.extraFields) {
        resultQry += extraField[0] + ' as ' + extraField[1] + ', '; 
    }
    return resultQry.substr(0, resultQry.length - 2);
}

function genOuterJoins(queryOpts: IQueryOpts): string {
    let resultQry = '';
    for(let joinTable of queryOpts.joinTables) {
        resultQry += ' left outer join ' + joinTable.name + ' on ';
        resultQry += joinTable.name + '.id = ' + queryOpts.table.name + '.' + joinTable.joinField;
    }
    return resultQry;
}

interface ITableQueryOpts {
    name: string;
    fields: any[];
    joinField?: string;
}

export interface IQueryOpts {
    table: ITableQueryOpts;
    joinTables: ITableQueryOpts[];
    extraFields?: any[];
    filters: IFilter[];
}

export function queryGenerator(queryOpts: IQueryOpts):string {
    const aliasMap = {};
    const select = genSelectStr(queryOpts, aliasMap);
    const fromStr = ' from ' + queryOpts.table.name;
    const joins = genOuterJoins(queryOpts);
    const where = getWhereStr(queryOpts.filters);
    return select + fromStr + joins + where;
}