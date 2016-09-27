import db = require('../db/models');
import { queries } from '../db/queries/TableQueries';
import * as ni from '../../common/NetworkInterfaces';
import dsParams = require('../lib/DataSourcesParams');
import * as winston from 'winston';

export async function translate(requestLogItem):Promise<string> {
    const path = requestLogItem.path;
    let queryObj;
    try {
        queryObj = JSON.parse(requestLogItem.query);
        if((typeof queryObj) == 'string') {
            queryObj = JSON.parse(queryObj);
        }
        
        if(path == '/get_table_data') {
            const typedQueryObj:ni.GetTableQueryData.req = queryObj;
            const tableQuery = queries[typedQueryObj.queryName];
            return Promise.resolve('Lista: ' + tableQuery.title);
        } else if (path == '/view_record/') {
            const typedQueryObj:ni.GetViewRecord.req = queryObj;
            const model = db.models[typedQueryObj.dataSource];
            const params = dsParams[typedQueryObj.dataSource];
            const record = await model.findById(typedQueryObj.id);
            return Promise.resolve(params.labelSingular + ': ' +  record[params.labelField]);
        } else if (path == '/search') {
            return Promise.resolve('Busca: ' + queryObj.searchValue);
        } else if (path == '/get_record/') {
            if(queryObj.optionsName != 'SingleNews') {
                return Promise.resolve(requestLogItem.query);
            }
            const insight = await db.models.News.findById(queryObj.id);
            return Promise.resolve('Insight: ' + insight.title);
        }
    } catch(err) {
        winston.error(err);
        return Promise.resolve(requestLogItem.query);
    }
    return Promise.resolve(requestLogItem.query);
}