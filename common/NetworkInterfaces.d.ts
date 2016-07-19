import * as Interfaces from './Interfaces'; 

interface teste {
    test: string;
}

export namespace GetViewParams {

    export interface req {
        table: string;
    }

    export interface res {
        viewParams: Interfaces.IBaseDataSourceParams;
        types: any;
    }
}

export namespace GetTableData {

    export interface IOrderColumn {
        fieldName: string;
        dir: string;
    }

    export interface IFilter {
        field: string;
        value: string;
    }

    export interface req {
        table: string;
        filters?: IFilter[];
        fieldNames?: any;
        pagination?: {
            first: string;
            itemsPerPage: string;
        },
        order?: IOrderColumn[]
    }

    export interface res {
        records: any[];
        count: number;
    }
}

export namespace GetViewRecord {

    export interface req {
        dataSource: string;
        id: number;
    }

    export interface res {
        record: any[];
        referencedObjects: Interfaces.IRefObjectsOnView[];
    }
}

export namespace SendErrorReport {

    export interface req {
        url: string;
        description: string;
    }

    export interface res {
        msg: string;
    }
}

export namespace GetQueryData {

    export interface req {
        queryName: string;
        filters: any;
    }

    export interface res {
        fields: any;
        records: any[];
    }
}