import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import * as ni from '../../common/NetworkInterfaces';

interface IAppProps {
}

interface IAppState {
}

export class Analytics extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
        };
    }

    private componentDidMount() {
        const req:ni.AnalyticsSources.req = {};
        server.getP('/analytics/sources', req)
            .then(this.onData.bind(this))
            .catch(showError.show);
    }    

    private onData(res: ni.AnalyticsSources.res) {
        console.log(res);
    }

    public render(): React.ReactElement<any> {		
		return (
            <div>Analytics</div> 
		);
    }
}