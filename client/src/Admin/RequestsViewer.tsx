import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import * as ModelViewService from '../lib/ModelViewUtils';
import { IBaseQueryField, IFilter } from '../../../common/Interfaces';
import { genColumns } from '../lib/TableUtils';
import * as ni from '../../../common/NetworkInterfaces';
import * as moment from 'moment';
const DateTimeField = require('react-bootstrap-datetimepicker');

interface IAppProps {
}

interface IAppState {
    dataTable: any;
    users: any[];
    accessQtyUser: any[];
    type: string;
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
            type: "INDIVIDUAL_ACCESS",
            users: [],
            accessQtyUser: []        
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
                label: 'Texto',
                fieldName: 'translation',
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

    private getDateFilters():IFilter[] {
        const filters:IFilter[] = [];
        if(this.startDate) {
            filters.push({
                field: 'request_log.created_at',
                gte: '"' + this.startDate + '"'
            });
        }
        if(this.endDate) {
            filters.push({
                field: 'request_log.created_at',
                lte: '"' + this.endDate + '"'
            });
        }
        return filters;
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
        if(this.usernameFilter) {
            options.queryParams.filters.push({
                field: 'user',
                equal: '"' + this.usernameFilter + '"'
            });
        }
        const dateFilters = this.getDateFilters();
        options.queryParams.filters = options.queryParams.filters.concat(dateFilters);
        server.getTableData(options)
            .then(this.onTableData.bind(this, callback))
            .catch(showError.show);
    }

    private onChangeDate(varName, value) {
        var formattedValue = moment(value, dateFormat).format("YYYY-MM-DD");
        this[varName] = formattedValue;
        this.update();
    }

    private onUserChange(e) {
        this.usernameFilter = e.target.value;
        this.update();
    }

    private onTypeChange(e) {
        this.state.type = e.target.value;
        if(this.state.type == "INDIVIDUAL_ACCESS") {
            this.initTable(this.props);
        }    
        this.update();
    }

    private update() {
        if(this.state.type == "INDIVIDUAL_ACCESS") {
            this.state.dataTable.draw();
        } else { 
             var options:ni.GetTableQueryData.req = {
                queryName: 'requestsByUser',
                queryParams: {
                    pagination: {
                        first: 0,
                        itemsPerPage: 200
                    },
                    order: [],
                    filters: []
                }
            };
            const dateFilters = this.getDateFilters();
            options.queryParams.filters = options.queryParams.filters.concat(dateFilters);
            server.getTableData(options)
                .then(this.onUsersQtyData.bind(this))
                .catch(showError.show);
        }
    }

    private onUsersQtyData(serverResult:ni.GetTableQueryData.res) {
        this.state.users = serverResult.records;
        this.setState(this.state);
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

        let bottomHTML = null;
        if(this.state.type == "INDIVIDUAL_ACCESS") {
            const usersComboSource = this.state.users;
            usersComboSource.splice(0, 0, { label: 'Todos' });

            const usersHTMLOptions = usersComboSource.map((user, i) => {
                return <option value={user.id} key={i}>{user.label}</option>;
            });
            bottomHTML = (
                <div>
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
        } else {
            const rowsHTML = this.state.users.map((u, i) => {
                return (
                    <tr key={i}>
                        <td>{u.name}</td>
                        <td style={{textAlign: "right"}} >{u.qty}</td>
                    </tr>
                );
            });
            bottomHTML = (
                <table>
                    <thead>
                        <tr>
                            <th>Usuário</th>
                            <th>Nro acessos</th>
                        </tr>
                    </thead>
                    <tbody>
                        { rowsHTML }
                    </tbody>
                </table>
            );
        }

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
                        Mostrar:
                    </div>
                    <div className="col-md-3">
                    <select className="form-control" 
                            onChange={this.onTypeChange.bind(this)}>
                        <option value="INDIVIDUAL_ACCESS" key="ALL">Acessos individuais</option>
                        <option value="PER_USER" key="PER_USER">Quantidade por usuário</option>
                    </select>
                    </div>
                </div>
                <br/> 
                { bottomHTML }
            </div>
        );
    }
}