import IDataSourceOperations = require('./IDataSourceOperations');
import BaseDataSourceOperations = require('./BaseDataSourceOperations');
import dsParams = require('../DataSourcesParams');

class Well implements IDataSourceOperations {
    getModelFields(modelName:string, includeAutogenerated?:boolean){
        let fields = BaseDataSourceOperations.getModelFieldsObj(modelName, includeAutogenerated);
        
        delete fields['drilling_rig_onshore_id'];
        delete fields['drilling_rig_offshore_id'];
        
        const params = dsParams['Well'];
        fields['drilling_rig'] = {
            label: params.fields['drilling_rig'].label,
            type: 'ref',
            model: 'AllDrillingRigs'
        };
        const fieldsArray = BaseDataSourceOperations.fieldsObjToArray(fields);
        return fieldsArray;
    }
    
    addAttributesToRecord(record, attributes, dataSource) {
        delete attributes['drilling_rig_offshore_id'];
        delete attributes['drilling_rig_onshore_id'];
        BaseDataSourceOperations.addAttributesToRecord(record, attributes, dataSource);
    }
    
    recordToViewValues(dataSourceName: string, record): any[] {
        const fields = this.getModelFields(dataSourceName, true);
        const recordValues = [];
        
        for( let item of fields ) {
            item.value = record[item.name];
            
            if(item.name == 'drilling_rig') {
                var tbNameModelMap = {
                    drilling_rigs_onshore: 'DrillingRigOnshore',  
                    drilling_rigs_offshore: 'DrillingRigOffshore'
                };
                
                item.ref = true;
                const drillingRigObj = record.drilling_rig_obj;
                if(!drillingRigObj) {
                    continue;
                }
                item.name = drillingRigObj.name;
                item.value = drillingRigObj.id;
                item.model = tbNameModelMap[drillingRigObj.$modelOptions.tableName];
            } else if(item.type == 'ref') {
                item.ref = true;
                if(record[item.association]) {
                    // TODO get label field instead of name
                    item.name = record[item.association].name;
                }
            }
            recordValues.push(item);
        }
        
        return recordValues;
    }
}

const obj = new Well();
export = obj;