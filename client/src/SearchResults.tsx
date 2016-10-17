import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';

interface IAppProps {
}

interface IAppState {
}

export class SearchResults extends React.Component<IAppProps, IAppState> {

    public state: IAppState;

    constructor(props: IAppProps) {
        super(props);

        this.state = {};
    }    

    private componentWillReceiveProps(props: IAppProps) {
    }
 
    public render(): React.ReactElement<any> {

        return (
            <div></div>
        );
    }
}