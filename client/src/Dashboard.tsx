import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';

interface IAppProps {
}

interface IAppState {
}

export class Dashboard extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {};
    }

    private componentDidMount() {
      
    }

    public render(): React.ReactElement<any> {
        return (
            <div>teste</div>
        );
    }
}