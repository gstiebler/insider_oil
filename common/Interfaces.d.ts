
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

export interface IBaseQueryField {
    label: string;
    fieldName?: string;
    type?: string;
    ref?: IRef;
    hasFilter?: boolean;
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
    notIn?: any[];
    equal?: string;
    gt?: string;
    lt?: string;
    gte?: string;
    lte?: string;
    isNotNull?: boolean;
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

export interface IRefObjectsOnView {
    queryName: string;
    title: string;
    filterField?: string;
    filters?: any;
}

export interface IBaseDataSourceParams {
    fields: IFieldMap;
    labelField: string;
    gridFields: string[];
    tableLabel: string;
    labelSingular: string;
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

export interface IInsight {
    id?: number;
    title: string;
    content?: string;
    author?: string;
    imgUrl?: string;
    date?: string;
}

export interface IOrderOpts {
    fieldName: string;
    dir: string; // "asc" or "desc"
}

export interface IPaginationOpts {
    first: number;
    itemsPerPage: number;
} 

export interface IQueryParams {
    order: IOrderOpts[]; 
    filters: IFilter[];
    pagination: IPaginationOpts;
    searchStr?: string;
}

export namespace Analytics {
   
    export interface ISource {
        sourceName: string;
        groupFields: string[];
        valueFields: string[];
    }

    export interface IAField {
        name: string;
        label: string;
    }

    export interface IFrontendSource {
        sourceName: string;
        label: string;
        groupFields: IAField[];
        valueFields: IAField[];
    }

    export interface IItemResult {
        label: string;
        value: number;
    }

    export interface IResult {
        items: IItemResult[];
        othersValue: number;
    }

}

export interface IProjectJsonField {
    contractors: {
        contractor_id: string;
        scope: string;
        persons_id: string[];
        contracts_id: string[];
    }[];
    owner_persons_id: string[];
}

export class FilterResult {
    value: string;
    qtt: number;
}