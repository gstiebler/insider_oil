import * as React from 'react';
import * as showError from '../lib/ShowError';

interface IAppProps {
}

interface IAppState {
}

export class ManyToMany extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
        };
    }
    
    public render(): React.ReactElement<any> {
        return (
            <table class="table">
            </table>
        );
    }
}