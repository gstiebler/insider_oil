import * as React from 'react';

interface IAppProps {
}

interface IAppState {
}

export class PersonsByCompany extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {};
    }

    public render(): React.ReactElement<any> {		
		return (
            <div></div> 
		);
    }
}