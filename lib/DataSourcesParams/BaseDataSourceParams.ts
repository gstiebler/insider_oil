interface field {
    label: string;
    isManyToMany?: boolean;
    comboSource?: string;
}

interface ExcelFieldMap {
    [name: string]: string;
}

interface ExcelParams {
    keyField: string;
    fields: ExcelFieldMap;
}

interface fieldMap {
    [name: string]: field;
}

interface queryMap {
    [name: string]: any;
}

interface BaseDataSourceParams {
    fields: fieldMap;
    labelField: string;
    gridFields: string[];
    tableLabel: string;
    hasMap?: boolean;
    excelParams?: ExcelParams;
    queries: queryMap;
}

export = BaseDataSourceParams;