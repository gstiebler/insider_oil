import * as React from 'react';
import { getP } from '../lib/Server';

interface IAppProps {
}

interface IAppState {
}

export class Filter extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {};
    }

    public render(): React.ReactElement<any> {
		return (
            <div>
            </div>
		);
    }
}