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