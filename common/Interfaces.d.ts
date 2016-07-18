
export interface TableQueryDataRes {
    fields: any[];
    records: any[];
    count: number;
}

interface IRef {
    modelField: string;
    idField: string;
    valueField: string;
}

export interface IField {
    label: string;
    isManyToMany?: boolean;
    isHTML?: boolean;
    isList?: boolean;
    isLink?: boolean;
    isPhoto?: boolean;
    isMultiFieldText?: boolean;
    isTextArea?: boolean;
    isProjectList?: boolean;
    isCurrency?: boolean;
    isConcessionaries?: boolean;
    comboSource?: string; 
    type?: string;
    model?: string;
    enumValues?: any[];
    association?: string;
    value?: any;
    ref?: IRef | boolean;
    name?: string;
}

interface IFilter {
    field: string;
    like?: string;
    in?: any[];
    equal?: string;
}

interface IExcelFieldMap {
    [name: string]: string;
}

interface IExcelParams {
    keyField: string;
    fields: IExcelFieldMap;
}

export interface IFieldMap {
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

export interface IFrontEndProject {
    model?: string;
    modelLabel?: string;
    description?: string;
    name?: string;
    id: number;
    model_id: number;
}

interface ITreeChild {
    source: string;
    filters?: any;
    fields?: IField[];
}

interface ITreeNode {
    label: string;
    id?: number;
    child?: ITreeChild;
    children?: ITreeNode[];
}

interface IGeoPoint {
    lat: number;
    lng: number;
}