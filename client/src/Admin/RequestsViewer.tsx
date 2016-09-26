import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import * as ModelViewService from '../lib/ModelViewUtils';
import { IBaseQueryField } from '../../../common/Interfaces';
import { genColumns } from '../lib/TableUtils';
import * as ni from '../../../common/NetworkInterfaces';
import * as moment from 'moment';
import * as DateTimeField from 'react-bootstrap-datetimepicker';

interface IAppProps {
}

interface IAppState {
    dataTable: any;
    users: any[];
}

const dateFormat = "DD/MM/YYYY";

export class RequestsViewer extends React.Component<IAppProps, IAppState> {

    private startDate;
    private endDate;
    private usernameFilter;

    constructor(props: IAppProps) {
        super(props);

        this.state = { 
            dataTable: null,
            users: []
        };
        window['paginatedTableRef'] = this;
    }

    private componentDidMount() {
        this.initTable(this.props);        
        server.getP('/combo_values', { model: 'UsersUsername' })
            .then(this.onUsers.bind(this))
            .catch(showError.show);
    }

    private onUsers(users:any[]) {
        this.state.users = users;
        this.setState(this.state);
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
        
        var options:ni.GetTableQueryData.req = {
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
        if(this.startDate) {
            options.queryParams.filters.push({
                field: 'created_at',
                gte: '"' + this.startDate + '"'
            });
        }
        if(this.endDate) {
            options.queryParams.filters.push({
                field: 'created_at',
                lte: '"' + this.endDate + '"'
            });
        }
        if(this.usernameFilter) {
            options.queryParams.filters.push({
                field: 'user',
                equal: '"' + this.usernameFilter + '"'
            });
        }
        server.getTableData(options)
            .then(this.onTableData.bind(this, callback))
            .catch(showError.show);
    }

    private onChangeDate(varName, value) {
        var formattedValue = moment(value, dateFormat).format("YYYY-MM-DD");
        this[varName] = formattedValue;
        this.state.dataTable.draw();
    }

    private onUserChange(e) {
        this.usernameFilter = e.target.value;
        this.state.dataTable.draw();
    }

    private onTableData(callback, serverResult:ni.GetTableQueryData.res) {
        var result = { 
            aaData: serverResult.records,
            recordsTotal: serverResult.count,
            recordsFiltered: serverResult.count 
        };
        callback(result);
        return null;
    }

    public render(): React.ReactElement<any> {
        const today = new Date();
        const minusWeek = new Date();
        minusWeek.setDate(minusWeek.getDate() - 7);
        const startDate = moment(minusWeek).format(dateFormat);
        const endDate = moment(today).format(dateFormat);

        const usersComboSource = this.state.users;
        usersComboSource.splice(0, 0, { label: 'Todos' });

        const usersHTMLOptions = usersComboSource.map((user, i) => {
            return <option value={user.id} key={i}>{user.label}</option>;
        });

        return (
            <div>
                <div className="row">
                    <div className="col-md-2">
                        Data de início:
                    </div>
                    <div className="col-md-3">
                        <DateTimeField 
                                mode={'date'}
                                inputFormat={dateFormat}
                                dateTime={startDate}
                                format={dateFormat}
                                onChange={this.onChangeDate.bind(this, 'startDate')}
                                className="form-control input-group"/>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-2">
                        Data de fim:
                    </div>
                    <div className="col-md-3">
                        <DateTimeField 
                                mode={'date'}
                                inputFormat={dateFormat}
                                dateTime={endDate}
                                format={dateFormat}
                                onChange={this.onChangeDate.bind(this, 'endDate')}
                                className="form-control input-group"/>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-2">
                        Filtrar usuário:
                    </div>
                    <div className="col-md-3">
                    <select className="form-control" 
                        onChange={this.onUserChange.bind(this)}>
                        { usersHTMLOptions }
                    </select>
                    </div>
                </div>
                <br/>
                <div className="main-table table-responsive bootstrap-table">
                    <table id="mainTable" className="table" cellSpacing="0" width="100%"></table>
                </div>
            </div>
        );
    }
}