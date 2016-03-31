interface IField {
    label: string;
    isManyToMany?: boolean;
    isHTML?: boolean;
    isList?: boolean;
    isLink?: boolean;
    isPhoto?: boolean;
    isProjectList?: boolean;
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

interface IBaseDataSourceParams {
    fields: IFieldMap;
    labelField: string;
    gridFields: string[];
    tableLabel: string;
    hasMap?: boolean;
    excelParams?: IExcelParams;
    urlSource?: string;
    queries?: IQueryMap;
    referencedObjectsOnView?: IRefObjectsOnView[];
}

export = IBaseDataSourceParams;