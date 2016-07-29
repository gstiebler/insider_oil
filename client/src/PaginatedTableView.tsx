import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import * as ni from '../../common/NetworkInterfaces';
import { PaginatedTable, ITableParams } from './PaginatedTable';
import { getFields } from './lib/QueriesFields';
import { IField } from '../../common/Interfaces';

interface IAppProps {
    location: any;
}

interface IAppState {
    tableParams: ITableParams;
}

export class PaginatedTableView extends React.Component<IAppProps, IAppState> {

    private source: string;

    constructor(props: IAppProps) {
        super(props);

        this.source = props.location.query.source;

        this.state = {
            tableParams: null
        };
    }

    public componentDidMount() {
        getFields(this.source)
            .then(this.onFields.bind(this))
            .catch(showError.show);
    }

    private onFields(res: IField[]) {
        this.state.tableParams = {
            fields: res,
            label: 'Label',
            source: this.source
        };
        this.setState(this.state);
    }

    public render(): React.ReactElement<any> {
        return (
            <div>
                <PaginatedTable tableParams={ this.state.tableParams } />
            </div>
        );
    }
}