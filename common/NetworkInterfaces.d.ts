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

export namespace GetTableQueryData {
    
    export interface req {
        queryName: string;
        queryParams: Interfaces.IQueryParams;
    }

    export interface res extends Interfaces.TableQueryDataRes {
    }
}

export interface IExtraRecordData {
    tableauUrls: string[];
    embedStrs: string[];
} 

export namespace GetViewRecord {

    export interface req {
        dataSource: string;
        id: number;
    }

    export interface res {
        record: any[];
        referencedObjects: Interfaces.IRefObjectsOnView[];
        extraRecordData: IExtraRecordData
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

    export interface req {
        queryName: string;
    }

    export interface res {
        fields: Interfaces.IField[];
        title: string;
        tableauUrl: string;
    }
}

export namespace Insights {

    export interface req {}

    export interface res {
        section1Articles: Interfaces.IInsight[];
        section2Articles: Interfaces.IInsight[];
        section3Articles: Interfaces.IInsight[];
        section4Articles: Interfaces.IInsight[];
        popular: Interfaces.IInsight[];
        recent: Interfaces.IInsight[];
        flexSlider: Interfaces.IInsight[];
    }
}

export namespace SaveInsights {

    export interface req {
        section1Articles: number[];
        section2Articles: number[];
        section3Articles: number[];
        section4Articles: number[];
        flexSlider: number[];
    }

    export interface res {
        msg: string
    }
}

export namespace TickerUpdates {

    export interface ITickerItem {
        category: string;
        title: string;
        link: string;
    }

    export interface req {}

    export interface res {
        items: ITickerItem[];
    }
}

export namespace AnalyticsSources {
    export interface req {}

    export interface res {
        sources: Interfaces.IAnalyticsSource[];
    }
}

export namespace AnalyticsCount {
    export interface req {
        source: string;
        field: string;
    }

    export interface res {
        countResult: Interfaces.IAnalyticsCount[];
    }
}

export namespace CreateItem {
    export interface req {
        model: string;
        newItemData: any;
        extraRecordData?: IExtraRecordData
    }

    export interface res {
        msg: string;
    }
}

export namespace SaveItem {
    export interface req {
        model: string;
        record: any;
        extraRecordData?: IExtraRecordData
    }
    
    export interface res {
        msg: string;
    }
}

export namespace RecordValues {
    export interface req {
        model: string;
        id: number;
    }
    
    export interface res {
        values: any;
        fields: Interfaces.IField[];
        extraRecordData: IExtraRecordData
    }
}