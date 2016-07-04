import dbUtils = require("../dbUtils");

interface IDataSourceOperations {
    getModelFields(modelName:string, includeAutogenerated?:boolean);
    addAttributesToRecord(record, attributes, dataSource);
    recordToViewValues(dataSourceName: string, record): any[];
}

export = IDataSourceOperations;