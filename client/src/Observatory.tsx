import * as React from 'react';
import { Tableau } from './Tableau'; 

interface IAppProps {
    location: any;
}

interface IAppState {
    tableauUrl: string;
}

export class Observatory extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        const sources = {
            investments: "https://public.tableau.com/views/InvestimentosdaPetrobras-histrico/InvestimentodaPetrobras",
            wells: "https://public.tableau.com/views/DemandadepoosOffshore/Painel1"
        };

        var { id } = props.location.query;

        this.state = {
            tableauUrl: sources[id]
        };
    }

    public render(): React.ReactElement<any> {		
		return (
            <Tableau vizUrl={this.state.tableauUrl} style={{width:800, height:700}}></Tableau> 
		);
    }
}