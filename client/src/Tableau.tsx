import * as React from 'react';

interface IAppProps {
    vizUrl: string;
}

interface IAppState {
}

export class Tableau extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
        };
    }

    private componentDidMount() {
        const options = { hideTabs: true };
        const vizDiv = this.refs['countRef'];
        var viz = new tableau.Viz(vizDiv, this.props.vizUrl, options); 
    }    

	private componentDidUpdate() {
	}

    public render(): React.ReactElement<any> {		
		return (
            <div id="vizContainer" ref="countRef" style={{width:800, height:700}}></div> 
		);
    }
}