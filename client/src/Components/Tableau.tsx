import * as React from 'react';

interface IAppProps {
    vizUrl: string;
    style?: any;
}

interface IAppState {
}

declare var tableau: any;

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
        const style = {
            height: '100%',
            width: '100%', 
            overflow: 'scroll',
            align: 'center' 
        };
		return (
            <div id="vizContainer" ref="countRef" style={style}></div> 
		);
    }
}