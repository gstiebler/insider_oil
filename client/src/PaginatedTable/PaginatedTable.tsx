import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import * as ModelViewService from '../lib/ModelViewUtils';
import { Link, browserHistory } from 'react-router';
import { PaginatedTableHeader, HeaderParams, FilterField } from './PaginatedTableHeader';
import { TableQueryDataRes } from '../../../common/Interfaces';
import * as StringUtils from '../lib/StringUtils'; 
import { genColumns } from '../lib/TableUtils';
import { IField } from '../../../common/Interfaces';

export interface ITableParams {
    label: string;
    fields: IField[];
    source: string;
    tableauUrl: string;  
}

interface IAppProps {
    tableParams: ITableParams;
}

interface IAppState {
    headerParams: HeaderParams;
    dataTable: any;
    filters: any[];
}

export class PaginatedTable extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = { 
            headerParams: null,
            dataTable: null,
            filters: []
        };
        window['paginatedTableRef'] = this;
    }

    private componentWillReceiveProps(nextProps: IAppProps) {
        if(!nextProps.tableParams) {
            return;
        }
        this.initHeader(nextProps);
        this.setState(this.state);
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
        var {columns, currencyColumnsIndexes} = genColumns(tableParams);
        this.state.headerParams = { 
            filterFields: columns,
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

    /**
     * DataTables callback to refresh the data. It's called when the order column change,
     * and when a page on pagination is clicked
     */
    private ajaxFn(props: IAppProps, data, callback, settings) {
        var orderColumns = [];
        for(var i = 0; i < data.order.length; i++) {
            var columnIndex = data.order[i].column;
            var orderObj = {
                fieldName: data.columns[columnIndex].data,
                dir: data.order[i].dir
            };
            orderColumns.push( orderObj );
        }
        
        var options = {
            queryName: props.tableParams.source,
            queryParams: {
                pagination: {
                    first: data.start,
                    itemsPerPage: data.length 
                },
                order: orderColumns,
                filters: this.state.filters
            }
        };
        server.getTableData(options)
            .then(this.onTableData.bind(this, callback))
            .catch(showError.show);
    }

    private onTableData(callback, serverResult:TableQueryDataRes) {
        var result = { 
            aaData: serverResult.records,
            recordsTotal: serverResult.count,
            recordsFiltered: serverResult.count 
        };
        callback(result);
        return null;
    }

    private filterChanged(newFilter) {
        this.state.filters = newFilter;
        this.state.dataTable.draw();
    } 

    public render(): React.ReactElement<any> {
        if(!this.state.headerParams) {
            return <div></div>;
        }
        const tableHeader = <PaginatedTableHeader headerParams={ this.state.headerParams } filterChanged={ this.filterChanged.bind(this) }></PaginatedTableHeader>;

        return (
            <div className="main-table table-responsive bootstrap-table">
                { tableHeader }
                <table id="mainTable" className="table" cellSpacing="0" width="100%"></table>
            </div>
        );
    }
}