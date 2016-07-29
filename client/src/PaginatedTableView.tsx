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

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            tableParams: null
        };
    }

    public componentDidMount() {
        getFields('Blocks')
            .then(this.onFields.bind(this))
            .catch(showError.show);
    }

    private onFields(res: IField[]) {
        this.state.tableParams = {
            fields: res,
            label: 'Blocos',
            source: 'Blocks'
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