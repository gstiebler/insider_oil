import * as React from 'react';

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
    }    


    public render(): React.ReactElement<any> {		
		return (
            <div>Analytics</div> 
		);
    }
}