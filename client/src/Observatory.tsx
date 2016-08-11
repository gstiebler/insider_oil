import * as React from 'react';
import { Tableau } from './Tableau'; 

interface IAppProps {
    location: any;
}

interface IAppState {
    tableauUrl: string;
}

export class Observatory extends React.Component<IAppProps, IAppState> {

    private sources;

    constructor(props: IAppProps) {
        super(props);

        this.sources = {
            investments: "https://public.tableau.com/views/InvestimentosdaPetrobras-histrico/InvestimentodaPetrobras",
            wells: "https://public.tableau.com/views/DemandadepoosOffshore/Painel1"
        };

        var { id } = props.location.query;

        this.state = {
            tableauUrl: this.sources[id]
        };
    }

    public componentWillReceiveProps(nextProps: IAppProps) {
        var { id } = nextProps.location.query;
        this.state.tableauUrl = this.sources[id];
        this.setState(this.state);
    }

    public render(): React.ReactElement<any> {		
		return (
            <Tableau vizUrl={this.state.tableauUrl} style={{width:800, height:700}}></Tableau> 
		);
    }
}