import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import * as ni from '../../../common/NetworkInterfaces';
import { PaginatedTable, ITableParams } from './PaginatedTable';
import { IField, IFilter } from '../../../common/Interfaces';
import { Tableau } from '../Components/Tableau'; 
import { FiltersGroup } from '../Components/FiltersGroup'; 

interface IAppProps {
    location: any;
}

interface IAppState {
    tableParams: ITableParams;
    show: boolean; // it's only here to compensate a Datatables bug
    filters: IFilter[];
}

export class PaginatedTableView extends React.Component<IAppProps, IAppState> {

    private source: string;

    constructor(props: IAppProps) {
        super(props);

        this.source = props.location.query.source;

        this.state = {
            tableParams: null,
            show: false,
            filters: []
        };
    }

    public componentDidMount() {
        this.getFields();
    }

    private componentWillReceiveProps(nextProps: IAppProps) {
        this.source = nextProps.location.query.source;
        this.getFields();
    }

    private getFields() {
        this.state.show = false;
        this.setState(this.state);
        const req:ni.GetTableQueriesFields.req = { queryName: this.source };
        server.getP('/queries_fields', req)
            .then(this.onFields.bind(this))
            .catch(showError.show);
    }

    private onFields(res:ni.GetTableQueriesFields.res) {
        const fields = res.fields;
        this.state.tableParams = {
            fields,
            tableauUrl: res.tableauUrl,
            label: res.title,
            source: this.source
        };

        this.setState(this.state);
        return null;
    }

    private onFiltersChange(filters: IFilter[]) {
        this.state.filters = filters;
        this.setState(this.state);
    }

    public render(): React.ReactElement<any> {
        if(!this.state.show) {
            this.state.show = true;
            return <div></div>;
        }

        let tableau = null;
        if(this.state.tableParams.tableauUrl) {
            tableau = (
                <div>
                    <Tableau vizUrl={this.state.tableParams.tableauUrl}/>
                    <br/>
                </div>
            );
        }

        let paginatedTableHTML = null;
        if(this.state.tableParams) {
            paginatedTableHTML = (
                <PaginatedTable 
                    tableParams={ this.state.tableParams }
                    filters={this.state.filters} 
                />
            )
        }

        return (
            <div>
                { tableau }
                <FiltersGroup 
                    tableParams={this.state.tableParams}
                    onChange={this.onFiltersChange.bind(this)} >
                </FiltersGroup>
                <br/>
                { paginatedTableHTML }
            </div>
        );
    }
}