import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import * as ni from '../../common/NetworkInterfaces';
import { Link } from 'react-router';

interface IAppProps {
}

interface IAppState {
}

export class Insights extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
        };
    }

    private componentDidMount() {
    }

    public render(): React.ReactElement<any> {
        return (
            <div className="container">Teste</div>
        );
    }
}