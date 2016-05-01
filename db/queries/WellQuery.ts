'use strict';

import QueryGenerator = require('./QueryGenerator');

export function wellsByBlock(wellOpts:QueryGenerator.ITableQueryOpts, 
                whereFn:(onOffStr:string, drTableName:string) => string):string {
    const wellSelectQry = QueryGenerator.genTableSelectStr(wellOpts, {});
            
    function getSubQuery(onOffStr):string {
        
        const drTableName = 'drilling_rigs_o' + onOffStr + 'shore';
        const drOpts:QueryGenerator.ITableQueryOpts = {
            name: drTableName,
            fields: [
                ['id', 'drilling_rig_id'],
                ['name', 'drilling_rig_name']
            ]
        }
        const drSelectQry = QueryGenerator.genTableSelectStr(drOpts, {});
        
        const extraFields = [
            ['"Well"', 'model'],
            ['"DrillingRigO' + onOffStr + 'shore"', 'drilling_rig_model']
        ];
        const extraFieldsQry = QueryGenerator.getExtraFieldsStr(extraFields);
        
        const fromStr = ' from wells, ' + drTableName;
        const whereStr = whereFn(onOffStr, drTableName);
        
        const selectStr = 'select ' + wellSelectQry + drSelectQry + extraFieldsQry.substr(0, extraFieldsQry.length - 2);
        
        const query = selectStr + fromStr + whereStr;
        return query;
    }    
    
    const query = getSubQuery('n') + ' union ' + getSubQuery('ff');
    return query;
}