
export interface TableQueryDataRes {
    fields: any[];
    records: any[];
    count: number;
}

export interface SearchResults {
    model: string;
    modelLabel: string;
    name: string;
    id: number;
    model_id: number;
}

export interface IField {
    label: string;
    isManyToMany?: boolean;
    isHTML?: boolean;
    isList?: boolean;
    isLink?: boolean;
    isPhoto?: boolean;
    isMultiFieldText?: boolean;
    isProjectList?: boolean;
    isCurrency?: boolean;
    isConcessionaries?: boolean;
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

export interface IBaseDataSourceParams {
    fields: IFieldMap;
    labelField: string;
    gridFields: string[];
    tableLabel: string;
    hasMap?: boolean;
    excelParams?: IExcelParams;
    urlSource?: string;
    referencedObjectsOnView?: IRefObjectsOnView[];
}