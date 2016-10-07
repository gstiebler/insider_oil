import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import * as ni from '../../common/NetworkInterfaces';
import * as Interfaces from '../../common/Interfaces';

interface IAppProps {
}

interface IAppState {
}

export class TargetSales extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
        };
    }

    public render(): React.ReactElement<any> {
		return (
            <div className="row">
            </div> 
		);
    }
}