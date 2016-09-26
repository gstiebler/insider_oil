import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import * as ModelViewService from '../lib/ModelViewUtils';
import { TableQueryDataRes } from '../../../common/Interfaces';
import { IBaseQueryField } from '../../../common/Interfaces';
import { genColumns } from '../lib/TableUtils';

interface IAppProps {
}

interface IAppState {
    dataTable: any;
}

export class RequestsViewer extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = { 
            dataTable: null,
        };
        window['paginatedTableRef'] = this;
    }

    private componentDidMount() {
        this.initTable(this.props);
    }

    private initTable(props: IAppProps) {
        var dataTableElement:any = $('#mainTable');
        const fields:IBaseQueryField[] = [
            {
                label: 'Usuário',
                fieldName: 'user',
                type: 'VARCHAR'
            },
            {
                label: 'Caminho',
                fieldName: 'path',
                type: 'VARCHAR'
            },
            {
                label: 'Momento',
                fieldName: 'created_at',
                type: 'DATETIME'
            },
        ]
        const tableParams = { fields };
        var {columns, currencyColumnsIndexes} = genColumns(tableParams);
        
        this.state.dataTable = dataTableElement.DataTable( {
            columns: columns,
            language: ModelViewService.datatablesPtBrTranslation,
            processing: true, // show processing message when loading rows
            serverSide: true,
            searching: false,
            dom: 'rtip', // constrols what parts of datatables is visible
            ajax: this.ajaxFn.bind(this, props),
        } );

        this.state.dataTable.draw();
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
            queryName: 'requests',
            queryParams: {
                pagination: {
                    first: data.start,
                    itemsPerPage: data.length 
                },
                order: orderColumns,
                filters: []
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

    public render(): React.ReactElement<any> {
        return (
            <div className="main-table table-responsive bootstrap-table">
                <table id="mainTable" className="table" cellSpacing="0" width="100%"></table>
            </div>
        );
    }
}