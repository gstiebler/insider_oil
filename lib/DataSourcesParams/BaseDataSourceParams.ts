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

interface IRefObjectsOnView {
    queryName: string;
    title: string;
    filterField?: string;
}

interface IBaseDataSourceParams {
    fields: IFieldMap;
    labelField: string;
    gridFields: string[];
    tableLabel: string;
    hasMap?: boolean;
    excelParams?: IExcelParams;
    urlSource?: string;
    referencedObjectsOnView?: IRefObjectsOnView[];
}

export = IBaseDataSourceParams;