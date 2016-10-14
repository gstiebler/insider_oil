import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import * as ni from '../../common/NetworkInterfaces';
import * as Interfaces from '../../common/Interfaces';
import { ShowQueryData } from './ShowQueryData';

interface IAppProps {
}

interface IAppState {
    typesAndStages: any[];
}

export class TargetSales extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            typesAndStages: []
        };
    }

    private componentDidMount() {        
        const options = { 
            filters: [],
            queryName:  'projectTypesAndStages'
        };
        server.getQueryData(options)
            .then(this.onTypesAndStages.bind(this))
            .catch(showError.show);
    }

    private onTypesAndStages(res: ni.GetQueryData.res) {
        this.state.typesAndStages = res.records;
        this.setState(this.state);
        return null;
    }

    private getStageHTML(stage:string):React.ReactElement<any>[] {
        const items = this.state.typesAndStages.filter(r => { return r.stage == stage; });
        return items.map(item => {
            const query = {
                queryName: 'projectsTargetSales',
                title: item.segment_type,
                filters: {
                    fase: stage,
                    type: item.segment_type
                },
            };
            return (
                <ShowQueryData key={item.stage + item.segment_type} 
                    model={query} 
                    objId={-1} >
                </ShowQueryData>
            );
        });
    }

    public render(): React.ReactElement<any> {
        if(!this.state.typesAndStages) return null;
		return (
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <h3>CAPEX</h3>
                        <br/>
                        { this.getStageHTML('CAPEX') }
                    </div>
                    <div className="col-md-6">
                        <h3>OPEX</h3>
                        <br/>
                        { this.getStageHTML('OPEX') }
                    </div>
                </div>
                <br/>
                Os projetos são acompanhados da sua licitação até a entrada em operação
            </div> 
		);
    }
}