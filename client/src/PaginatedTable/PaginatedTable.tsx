import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import * as ModelViewService from '../lib/ModelViewUtils';
import { Link, browserHistory } from 'react-router';
import { 
    PaginatedTableHeader, 
    HeaderParams, 
    FilterField 
} from './PaginatedTableHeader';
import { 
    TableQueryDataRes, 
    IBaseQueryField 
} from '../../../common/Interfaces';
import * as StringUtils from '../lib/StringUtils'; 
import { genColumns } from '../lib/TableUtils';
import { IField, IFilter } from '../../../common/Interfaces';
import { 
    GetTableQueryData, 
    GetExcelQuery 
} from '../../../common/NetworkInterfaces';
import { StrToByteArray } from '../lib/BytesUtils';
const FileSaver = require('file-saver'); 

export interface ITableParams {
    label: string;
    fields: IBaseQueryField[];
    source: string;
    tableauUrl: string;  
}

interface IAppProps {
    tableParams: ITableParams;
    filters: IFilter[];
}

interface IAppState {
    headerParams: HeaderParams;
    dataTable: any;
    searchStr: string;
}

export class PaginatedTable extends React.Component<IAppProps, IAppState> {

    private updated: boolean;
    /** this variable is used because props are not updated before ajaxFn */
    private filtersInAjax: IFilter[];

    private dataQueryData: any;

    constructor(props: IAppProps) {
        super(props);

        this.state = { 
            headerParams: null,
            dataTable: null,
            searchStr: ''
        };
        window['paginatedTableRef'] = this;

        this.updated = false;
        this.filtersInAjax = [];
    }

    private componentWillReceiveProps(nextProps: IAppProps) {
        if(!nextProps.tableParams) {
            return;
        }
        this.filtersInAjax = nextProps.filters;
        this.state.dataTable.draw();
    }

    private shouldComponentUpdate(nextProps: IAppProps) {
        const result = !this.updated;
        this.updated = true;
        return result;
    }

    private componentDidMount() {
        this.initHeader(this.props);
        this.setState(this.state);
    }

    private componentDidUpdate() {
        this.initHeader(this.props);
        this.initTable(this.props);
    }

    private initHeader(props) {
        var { tableParams } = props;
        this.state.headerParams = { 
            label: tableParams.label
        };
    }

    private initTable(props: IAppProps) {
        var dataTableElement:any = $('#mainTable');

        var { tableParams } = props;
        var {columns, currencyColumnsIndexes} = genColumns(tableParams);
        
        this.state.dataTable = dataTableElement.DataTable( {
            columns: columns,
            language: ModelViewService.datatablesPtBrTranslation,
            processing: true, // show processing message when loading rows
            serverSide: true,
            searching: false,
            dom: 'rtip', // constrols what parts of datatables is visible
            ajax: this.ajaxFn.bind(this, props),
            columnDefs: [
                { className: "text-right", targets: currencyColumnsIndexes },
            ]
        } );
    }

    private followLink(sourceName:string, id:number) {        
        var opts = {
            source: sourceName,
            id: id
        }
        var queryStr = "/app/view_record" + StringUtils.formatUrlParams(opts);
        browserHistory.push(queryStr);
    }

    getQueryParams() {
        let orderColumns = [];
        for(let i = 0; i < this.dataQueryData.order.length; i++) {
            let columnIndex = this.dataQueryData.order[i].column;
            let orderObj = {
                fieldName: this.dataQueryData.columns[columnIndex].data,
                dir: this.dataQueryData.order[i].dir
            };
            orderColumns.push( orderObj );
        }

        return {
            pagination: {
                first: this.dataQueryData.start,
                itemsPerPage: this.dataQueryData.length 
            },
            order: orderColumns,
            filters: this.filtersInAjax,
            searchStr: this.state.searchStr
        }
    }

    /**
     * DataTables callback to refresh the data. It's called when the order column change,
     * and when a page on pagination is clicked
     */
    private ajaxFn(props: IAppProps, data, callback: (any), settings) {
        this.dataQueryData = data;
        var req: GetTableQueryData.req = {
            queryName: props.tableParams.source,
            queryParams: this.getQueryParams()
        };
        server.getTableData(req)
            .then(this.onTableData.bind(this, callback))
            .catch(showError.show);
    }

    private onTableData(callback: (any), serverResult:GetTableQueryData.res) {
        var result = { 
            aaData: serverResult.records,
            recordsTotal: serverResult.count,
            recordsFiltered: serverResult.count 
        };
        callback(result);
        return null;
    }

    private filterChanged(searchStr: string) {
        this.state.searchStr = searchStr;
        this.state.dataTable.draw();
    } 

    private getExcelFile() {
        const req:GetExcelQuery.req = {
            queryName: this.props.tableParams.source,
            queryParams: this.getQueryParams()
        };
    	server.getP('/get_query_excel', req)
            .then((xlsxBinary) => {
                var ba = StrToByteArray(xlsxBinary);
                var blob = new Blob([ba], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                FileSaver.saveAs(blob, "arquivo.xlsx");             
            })
            .catch(showError.show);
    }

    public render(): React.ReactElement<any> {
        if(!this.state.headerParams) {
            return <div></div>;
        }
        const tableHeader = (
            <PaginatedTableHeader 
                headerParams={ this.state.headerParams } 
                filterChanged={ this.filterChanged.bind(this) } 
            />
        )

        return (
            <div className="main-table table-responsive bootstrap-table"
                style={{ height: 600 }}
            >
                { tableHeader }
                <table id="mainTable" className="table" cellSpacing="0" width="100%"></table>
                <button className="btn btn-default" 
                        onClick={ this.getExcelFile.bind(this) } >
                    Exportar para Excel
                </button>
            </div>
        );
    }
}