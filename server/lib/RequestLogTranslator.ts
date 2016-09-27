import db = require('../db/models');
import { queries } from '../db/queries/TableQueries';
import * as ni from '../../common/NetworkInterfaces';
import dsParams = require('../lib/DataSourcesParams');

export async function translate(requestLogItem):Promise<string> {
    const path = requestLogItem.path;
    let queryObj;
    try {
        queryObj = JSON.parse(requestLogItem.query);
        
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
        }
    } catch(err) {
        return Promise.resolve(requestLogItem.query);
    }
}