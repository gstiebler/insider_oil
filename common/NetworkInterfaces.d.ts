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

export namespace GetExcelQuery {

    export interface req {
        queryName: string;
        queryParams: Interfaces.IQueryParams;
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
        extraRecordData: IExtraRecordData;
        updatedAt: any;
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
        fields: Interfaces.IBaseQueryField[];
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
        sources: Interfaces.NSAnalytics.IFrontendSource[];
    }
}

export namespace AnalyticsResults {
    export interface req {
        source: string;
        groupField: string;
        valueField: string;
        maxNumItems: number;
        filters: Interfaces.IFilter[];
    }

    export interface res {
        result: Interfaces.NSAnalytics.IResult;
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

export namespace ComboValues {

    interface IValue {
        id: number;
        label: string;
    }

    export interface req {
        model: string;
    }
    
    export interface res {
        values: IValue[];
    }
}

export namespace Search {

    export interface req {
        searchValue: string;
        countLimit: number;
    }
    
    export interface res {
        values: Interfaces.IFrontEndProject[];
    }
}

export namespace FilterSource {

    export interface req {
        queryName: string;
        fieldName: string;
    }
    
    export interface res {
        values: Interfaces.FilterResult[];
    }
}

export namespace GetItemsInsideMap {
    
    export interface IMapItem {
        id: number;
        name: string;
        model: string;
    }

    export interface IGeoLimits {
        latMin: number;
        latMax: number;
        lngMin: number;
        lngMax: number;
    }

    export interface req {
        geoLimits: IGeoLimits; 
    }

    export interface res {
        items: IMapItem[];
    }

}