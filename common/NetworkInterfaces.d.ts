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