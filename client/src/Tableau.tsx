import * as React from 'react';

interface IAppProps {
    vizUrl: string;
}

interface IAppState {
}

export class Tableau extends React.Component<IAppProps, IAppState> {

    private viz;

    constructor(props: IAppProps) {
        super(props);

        this.state = {
        };
        this.viz = null;
    }

    private componentDidMount() {
        this.initViz();
    }    

	private componentDidUpdate() {
        this.viz.dispose();
        this.initViz();
	}

    private initViz() {
        const options = { hideTabs: true };
        const vizDiv = this.refs['countRef'];
        this.viz = new tableau.Viz(vizDiv, this.props.vizUrl, options); 
    }

    private componentWillUnmount() {
        this.viz.dispose();
    } 

    public render(): React.ReactElement<any> {		
		return (
            <div id="vizContainer" ref="countRef" style={{width:800, height:700}}></div> 
		);
    }
}