'use strict';

interface IFilter {
    field: string;
    like?: string;
    in?: number[];
    equal?: string;
}

export interface IOrderOpts {
    fieldName: string;
    dir: string; // "asc" or "desc"
}

export interface IQueryParams {
    order: IOrderOpts[]; 
    filters: IFilter[];
    pagination: IPaginationOpts;
}

export interface IPaginationOpts {
    first: number;
    itemsPerPage: number;
} 

type Field = string | string[];

export interface ITableQueryOpts {
    name: string;
    fields: Field[];
}
 
export interface IJoinTableQueryOpts extends ITableQueryOpts {
    joinField?: string;
    joinCond?: string;
}
 
export interface IQueryOpts {
    table: ITableQueryOpts;
    joinTables: IJoinTableQueryOpts[]; 
    extraFields?: any[];
    filters: IFilter[];
    order: IOrderOpts[];
}

export function getOrderByStr(orderOpts: IOrderOpts[]): string {
    let orderByStr = '';
    if( orderOpts.length > 0 ) {
        orderByStr += ' order by ';  
        for( let orderOpt of orderOpts ) {
            orderByStr += orderOpt.fieldName + ' ' + orderOpt.dir + ', ';
        }
        orderByStr = orderByStr.substr(0, orderByStr.length - 2);
        orderByStr += ' ';
    }   
    return orderByStr;
}

export function getWhereStr(filters: IFilter[], aliasMap?): string {
    const filterStrs = [];
    for(var filter of filters) {
        let field = filter.field;
        
        if(aliasMap && aliasMap[field])
            field = aliasMap[field];
        
        if(filter.like) {
            filterStrs.push(field + ' like "%' + filter.like + '%"');
        } else if (filter.in) {
            if(filter.in.length < 1) {
                filterStrs.push(field + ' in (-1)');
            } else {
                const idsStr = filter.in.join(', ');
                filterStrs.push(field + ' in (' + idsStr + ')');
            }
        } else if (filter.equal) {
            filterStrs.push(field + ' = ' + filter.equal);
        } else {
            throw 'Invalid filter';
        }
    };
    
    if(filterStrs.length == 0) {
        return '';
    } else {
        return ' where ' + filterStrs.join(' and ') + ' ';
    }
}

export function getPaginationStr(pagiOpts: IPaginationOpts): string {
    if(pagiOpts)
        return ' limit ' + pagiOpts.first + ', ' + pagiOpts.itemsPerPage;
    else
        return '';
        
}

export function genTableSelectStr(tableQryOpts: ITableQueryOpts, aliasMap):string {
    let resultQry = '';
    for(let field of tableQryOpts.fields) {
        if(typeof field == 'string') {
            resultQry += tableQryOpts.name + '.' + field;
        } else {
            const completeFieldName = tableQryOpts.name + '.' + field[0];
            resultQry += completeFieldName + ' as ' + field[1];
            aliasMap[field[1]] = completeFieldName; 
        }  
        resultQry += ', ';
    }
    return resultQry;
}

export function getExtraFieldsStr(extraFields:any[]) {
    let resultQry = '';
    for(let extraField of extraFields) {
        resultQry += extraField[0] + ' as ' + extraField[1] + ', '; 
    }   
    return resultQry;
}

export function genSelectStr(queryOpts: IQueryOpts, aliasMap):string {
    let resultQry = 'select ' + genTableSelectStr(queryOpts.table, aliasMap);
    for(let joinTable of queryOpts.joinTables) {
        resultQry += genTableSelectStr(joinTable, aliasMap);
    }
    resultQry += getExtraFieldsStr(queryOpts.extraFields);
    return resultQry.substr(0, resultQry.length - 2);
}

export function genOuterJoins(joinTables: IJoinTableQueryOpts[]): string {
    let resultQry = '';
    for(let joinTable of joinTables) {
        resultQry += ' left outer join ' + joinTable.name + ' on ';
        if(joinTable.joinField) {
            resultQry += joinTable.name + '.id = ' + joinTable.joinField;   
        } else if (joinTable.joinCond) {
            resultQry += joinTable.joinCond; 
        } else {
            throw 'joinField nor joinCond found';
        }
    }
    return resultQry;
}

export function queryGenerator(queryOpts: IQueryOpts):string {
    const aliasMap = {};
    const select = genSelectStr(queryOpts, aliasMap);
    const fromStr = ' from ' + queryOpts.table.name;
    const joins = genOuterJoins(queryOpts.joinTables);
    const where = getWhereStr(queryOpts.filters, aliasMap);
    const orderBy = getOrderByStr(queryOpts.order);
    return select + fromStr + joins + where + orderBy;
}