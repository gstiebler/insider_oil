import * as React from 'react';
import { IInsight } from '../../../common/Interfaces';
import { Link } from 'react-router';

interface IAppProps {
}

interface IAppState {
}

export class Publisher extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
        };
    }

    public render(): React.ReactElement<any> {	
		return (
            <div></div>);
    }
}