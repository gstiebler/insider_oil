import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import * as ModelViewService from './lib/ModelViewUtils';
import { Link, browserHistory } from 'react-router';
import { PaginatedTableHeader, HeaderParams, FilterField } from './PaginatedTableHeader';
import { TableQueryDataRes } from '../../controllers/dbServerController';


interface IAppProps {
    tableParams: any;
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
            headerParams: { filterFields: [], label: '' },
            dataTable: {},
            filters: []
        };
    }

    public componenteDidMount() {
        this.initTable();
    }

    private componentWillReceiveProps(nextProps) {
        this.initTable();
    }

    private genColumns() {
        var columns:FilterField[] = [];
        var { tableParams } = this.props;
        var currencyColumnsIndexes = [];
        for(var i = 0; i < tableParams.fields.length; i++) {
            var field = tableParams.fields[i];
            var columnObj:FilterField = {
                 title: field.label,
                 data: '',
                 render: {} 
            };
            if(field.ref) {
                columnObj.data = field.ref.valueField,
                columnObj.render = { display: this.getFormatLinkFn(field) };
            } else {
                columnObj.data = field.fieldName;
                columnObj.render = { display: ModelViewService.formatFnByType(field) };
                if(field.type == 'CURRENCY') {
                    currencyColumnsIndexes.push(i);
                }
            }
            columns.push(columnObj);
        }
        return {columns, currencyColumnsIndexes};
    }

    private initTable() {
        var dataTableElement:any = $('#mainTable');

        var {columns, currencyColumnsIndexes} = this.genColumns();

        this.state.headerParams = { 
            filterFields: columns,
            label: this.props.tableParams.label
        };
        
        this.state.dataTable = dataTableElement.DataTable( {
            columns: columns,
            language: ModelViewService.datatablesPtBrTranslation,
            processing: true, // show processing message when loading rows
            serverSide: true,
            searching: false,
            dom: 'rtip', // constrols what parts of datatables is visible
            ajax: this.ajaxFn.bind(this),
            columnDefs: [
                { className: "text-right", targets: currencyColumnsIndexes },
            ]
        } );
    }

    private getFormatLinkFn(column) {
        return function(value, type, row) {
            if(!value)
                return '';
            var linkStr = '<a href="/app/view_record?source=' + row[column.ref.modelField];
            linkStr += '&id=' + row[column.ref.idField];
            linkStr += '">' + value + '</a>'; 
            return linkStr;
        }
    }

    /**
     * DataTables callback to refresh the data. It's called when the order column change,
     * and when a page on pagination is clicked
     */
    private ajaxFn(data, callback, settings) {
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
            queryName: this.props.tableParams.source,
            queryParams: {
                pagination: {
                    first: data.start,
                    itemsPerPage: data.length 
                },
                order: orderColumns,
                filters: this.state.filters
            }
        };
        
        function setDataTablesRows(serverResult:TableQueryDataRes) {
            var result = { 
                aaData: serverResult.records,
                recordsTotal: serverResult.count,
                recordsFiltered: serverResult.count 
            };
            callback(result);
        }
        
        server.getTableData(options).then(setDataTablesRows).catch(showError.show);
    }

    private filterChanged(newFilter) {
        //if(JSON.stringify(newFilter) == JSON.stringify(this.state.filters))
        //    return;
        this.state.filters = newFilter;
        this.state.dataTable.draw();
    } 

    public render(): JSX.Element {
        return (
            <div className="main-table table-responsive bootstrap-table">
                <PaginatedTableHeader headerParams={ this.state.headerParams } filterChanged={ this.filterChanged.bind(this) }></PaginatedTableHeader>
                <table id="mainTable" className="table" cellspacing="0" width="100%"></table>
            </div>
        );
    }
}