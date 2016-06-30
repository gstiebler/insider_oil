import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import * as ModelViewService from './lib/ModelViewUtils';
import { Link, browserHistory } from 'react-router';
import { PaginatedTableHeader } from './PaginatedTableHeader';

interface IAppProps {
    tableParams: any;
}

interface IAppState {
    headerParams: any;
    dataTable: any;
    filters: any[];
}

export class PaginatedTable extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = { 
            headerParams: {},
            dataTable: {},
            filters: []
        };
    }

    public componenteDidMount() {
        this.initTable();
    }

    private genColumns() {
        var columns = [];
        var { tableParams } = this.props;
        var currencyColumnsIndexes = [];
        for(var i = 0; i < tableParams.fields.length; i++) {
            var field = tableParams.fields[i];
            var columnObj:any = { title: field.label };
            if(field.ref) {
                columnObj.data = field.ref.valueField,
                columnObj.render = { display: this.getFormatLinkFn(field) };
            } else {
                columnObj.data = field.fieldName;
                columnObj.render = { display: ModelViewService.formatFnByType };
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
        
        function setDataTablesRows(serverResult) {
            var result = { 
                aaData: serverResult.records,
                recordsTotal: serverResult.count,
                recordsFiltered: serverResult.count 
            };
            callback(result);
        }
        
        server.getTableData(options, setDataTablesRows, showError.show);
    }

    private filterChanged(newFilter) {
        if(JSON.stringify(newFilter) == JSON.stringify(this.state.filters))
            return;
        console.log(this.state.filters, newFilter);
        this.state.filters = newFilter;
        this.state.dataTable.draw();
    } 

    public render(): JSX.Element {
        return (
            <div className="main-table table-responsive bootstrap-table">
                <PaginatedTableHeader headerParams={ this.state.headerParams } filterChanged={ this.filterChanged }></PaginatedTableHeader>
                <table id="mainTable" className="table" cellspacing="0" width="100%"></table>
            </div>
        );
    }
}