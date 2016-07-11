import * as Interfaces from './Interfaces'; 

interface teste {
    test: string;
}

export namespace GetViewParams {
    export const url = 'view_params';

    export interface req {
        table: string;
    }

    export interface res {
        viewParams: Interfaces.IBaseDataSourceParams;
        types: any;
    }
}

export namespace GetTableData {
    export const url = 'db_server';

    export interface req {
        table: string;
        filters?: any;
        fieldNames?: any;
    }

    export interface res {
        records: any[];
    }
}