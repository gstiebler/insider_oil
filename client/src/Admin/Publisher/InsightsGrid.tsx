import * as React from 'react';
import { IInsight } from '../../../../common/Interfaces';
import { Insights } from '../../../../common/NetworkInterfaces';
import { getP } from '../../lib/Server';
import * as showError from '../../lib/ShowError';

interface IAppProps {
}

interface IAppState {
}

export class InsightsGrid extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {};
    }

    private componentDidMount() {
    }

    public render(): React.ReactElement<any> {
        return <div></div>
}