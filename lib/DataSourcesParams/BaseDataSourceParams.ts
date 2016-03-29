interface IField {
    label: string;
    isManyToMany?: boolean;
    comboSource?: string;
}

interface IExcelFieldMap {
    [name: string]: string;
}

interface IExcelParams {
    keyField: string;
    fields: IExcelFieldMap;
}

interface IFieldMap {
    [name: string]: IField;
}

interface IQueryMap {
    [name: string]: any;
}

interface IRefObjectsOnView {
    dataSource: string;
    showFields: string[];
    filterField?: string;
    queryName?: string;
}

interface BaseDataSourceParams {
    fields: IFieldMap;
    labelField: string;
    gridFields: string[];
    tableLabel: string;
    hasMap?: boolean;
    excelParams?: IExcelParams;
    queries?: IQueryMap;
    referencedObjectsOnView?: IRefObjectsOnView;
}

export = BaseDataSourceParams;