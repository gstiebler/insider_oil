'use strict';

import {
    IFilter, 
    IOrderOpts,
    IPaginationOpts,
    IBaseQueryField
} from '../../../common/Interfaces';

type Field = string | string[];

export interface ITableQueryOpts {
    name: Field;
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
    where?: IFilter[];
    having?: IFilter[];
    order: IOrderOpts[];
}

export function getPaginationStr(pagiOpts: IPaginationOpts): string {
    if(pagiOpts)
        return ' limit ' + pagiOpts.first + ', ' + pagiOpts.itemsPerPage;
    else
        return '';
}

export function genTableSelectStr(tableQryOpts: ITableQueryOpts, aliasMap):string {
    let resultQry = '';    
    var joinTableName = tableQryOpts.name;
    var tableAlias = joinTableName;
    if((typeof joinTableName) != 'string') {
        tableAlias = joinTableName[1];
        joinTableName = joinTableName[0] + ' as ' + tableAlias;
    }
    for(let field of tableQryOpts.fields) {
        if(typeof field == 'string') {
            resultQry += tableAlias + '.' + field;
        } else {
            const completeFieldName = tableAlias + '.' + field[0];
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

function getInFilter(filter: IFilter, field: string, filterArray: string[]):string {
    if(filterArray.length < 1) {
        return field + ' in (-1)';
    } else {
        const idsStr = filterArray.join(', ');
        return field + ' in (' + idsStr + ')';
    }    
}

function genSearchStrConditions(searchStr: string, fields: IBaseQueryField[]): string {
    const fieldConditions:string[] = [];
    for(let field of fields) {
        let fieldName;
        if (field.fieldName) {
            if(field.type != 'VARCHAR') continue;
            fieldName = field.fieldName;
        } else if(field.ref.valueField) {
            fieldName = field.ref.valueField;
        } else {
            throw 'Sem field.fieldName nem field.ref.valueField';
        }
        fieldConditions.push(fieldName + ' like "%' + searchStr + '%" ');
    }
    return fieldConditions.join(' or ');
}

export function addSearchStrConditions(query: string, searchStr: string, fields: IBaseQueryField[]): string {
    const conditions = genSearchStrConditions(searchStr, fields);
    return 'select * from (' + query + ') as tb where ' + conditions;
}

export class QueryGenerator {

    public genSelectStr(queryOpts: IQueryOpts, aliasMap):string {
        let resultQry = 'select ' + genTableSelectStr(queryOpts.table, aliasMap);
        for(let joinTable of queryOpts.joinTables) {
            resultQry += genTableSelectStr(joinTable, aliasMap);
        }
        resultQry += getExtraFieldsStr(queryOpts.extraFields);
        return resultQry.substr(0, resultQry.length - 2);
    }

    public genOuterJoins(joinTables: IJoinTableQueryOpts[]): string {
        let resultQry = '';
        for(let joinTable of joinTables) {
            var joinTableName = joinTable.name;
            var tableAlias = joinTableName;
            if((typeof joinTableName) != 'string') {
                tableAlias = joinTableName[1];
                joinTableName = joinTableName[0] + ' as ' + tableAlias;
            }
            resultQry += ' left outer join ' + joinTableName + ' on ';
            if(joinTable.joinField) {
                resultQry += tableAlias + '.id = ' + joinTable.joinField;   
            } else if (joinTable.joinCond) {
                resultQry += joinTable.joinCond; 
            } else {
                throw 'joinField nor joinCond found';
            }
        }
        return resultQry;
    }

    public getFilterStr(filters: IFilter[], filterKeyword: string, aliasMap?): string {
        const filterStrs = [];
        for(var filter of filters) {
            if(filter.customFilter) {
                filterStrs.push(filter.customFilter);
                continue;
            }
            let field = filter.field;
            
            if(aliasMap && aliasMap[field])
                field = aliasMap[field];
            
            if(filter.like) {
                filterStrs.push(field + ' like "%' + filter.like + '%"');
            } else if (filter.in) {
                const inFilterStr = getInFilter(filter, field, filter.in);
                filterStrs.push(inFilterStr);
            } else if (filter.notIn) {
                const inFilterStr = getInFilter(filter, field, filter.notIn);
                filterStrs.push(' not ' + inFilterStr);
            } else if (filter.equal) {
                filterStrs.push(field + ' = ' + filter.equal);
            } else if (filter.gt) {
                filterStrs.push(field + ' > ' + filter.gt);
            } else if (filter.lt) {
                filterStrs.push(field + ' < ' + filter.lt);
            } else if (filter.gte) {
                filterStrs.push(field + ' >= ' + filter.gte);
            } else if (filter.lte) {
                filterStrs.push(field + ' <= ' + filter.lte);
            } else if (filter.isNotNull) {
                filterStrs.push(field + ' is not null ');
            } else {
                throw 'Invalid filter';
            }
        };
        
        if(filterStrs.length == 0) {
            return '';
        } else {
            return ' ' + filterKeyword + ' ' + filterStrs.join(' and ') + ' ';
        }
    }

    public getOrderByStr(orderOpts: IOrderOpts[]): string {
        if( orderOpts.length > 0 ) {
            const orderItems = []; 
            for( let orderOpt of orderOpts ) {
                orderItems.push(orderOpt.fieldName + ' ' + orderOpt.dir);
            }
            return ' order by ' + orderItems.join(', ');
        }   
        return '';
    }

    public getWhereStr(queryOpts: IQueryOpts, aliasMap) {
        return queryOpts.where ? this.getFilterStr(queryOpts.where, 'where', aliasMap) : '';
    }
}

export function generate(queryOpts: IQueryOpts, queryGenerator?: QueryGenerator):string {
    if(!queryGenerator) {
        queryGenerator = new QueryGenerator();
    }
    const aliasMap = {};
    const select = queryGenerator.genSelectStr(queryOpts, aliasMap);
    const fromStr = ' from ' + queryOpts.table.name;
    const joins = queryGenerator.genOuterJoins(queryOpts.joinTables);
    const where = queryGenerator.getWhereStr(queryOpts, aliasMap);
    const having = queryOpts.having ? queryGenerator.getFilterStr(queryOpts.having, 'having', aliasMap) : '';
    const orderBy = queryGenerator.getOrderByStr(queryOpts.order);
    return select + fromStr + joins + where + having + orderBy;
}