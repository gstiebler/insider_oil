import * as Interfaces from './Interfaces'; 

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

export namespace GetRecord {

    export interface req {
        optionsName: string;
        id: number;
    }

    export interface res {
        record: any;
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

export namespace GetDashboardData {

    export interface req {}

    export interface res {
        numBids: number;
        numContracts: number;
        numPersons: number;
        numProjects: number;
    }
}

export namespace GetTableQueriesFields {

    export interface req {}

    export interface res {
        [tableQuery: number]: Interfaces.IFieldMap;
    }
}

export interface IInsight {
    id: number;
    title: string;
    content: string;
    author: string;
    imgUrl: string;
    date: string;
}

export namespace Insights {

    export interface req {}

    export interface res {
        carroussel: IInsight[];
        section1Articles: IInsight[];
        section2Articles: IInsight[];
        section3Articles: IInsight[];
        section4Articles: IInsight[];
        popular: IInsight[];
        recent: IInsight[];
        flexSlider: IInsight[];
    }
}