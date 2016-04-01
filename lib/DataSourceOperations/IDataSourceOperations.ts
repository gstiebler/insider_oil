import dbUtils = require("../dbUtils");

interface IDataSourceOperations {
    getModelFields(modelName:string, includeAutogenerated?:boolean);
    addAttributesToRecord(record, attributes, dataSource);
}

export = IDataSourceOperations;