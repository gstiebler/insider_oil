import * as React from 'react';
import { IInsight } from '../../../../common/Interfaces';
import * as ni from '../../../../common/NetworkInterfaces';
import { getP } from '../../lib/Server';
import * as showError from '../../lib/ShowError';
import { dateTimeFormat } from '../../lib/DateUtils';

interface IAppProps {
}

interface IAppState {
    insights:ni.GetTableData.res;
}

export class InsightsGrid extends React.Component<IAppProps, IAppState> {

    private insightsIndex:number;
    private itemsPerPage:number;

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            insights: null
        };
        this.insightsIndex = 0;
        this.itemsPerPage = 10;
    }

    private componentDidMount() {
        this.getInsights();
    }

	private getInsights() {
        const req:ni.GetTableData.req = { 
            table: 'News',
            pagination: {
                first: this.insightsIndex.toString(),
                itemsPerPage: this.itemsPerPage.toString()
            },
            order: [{
                fieldName: 'created_at',
                dir: 'desc'
            }],
            filters: []
        }; 
        getP('/table_data', req)
            .then(this.onInsights.bind(this))
            .catch(showError.show);
	}

	private onInsights(res:ni.GetTableData.res) {
		this.state.insights = res;
		this.setState(this.state);
        return null;
	}

    public render(): React.ReactElement<any> {
        const insights = this.state.insights;
        if(!insights) {
            return <div></div>
        }

        const insightsHtml = insights.records.map((insight, index) => {
            return (                
                <tr key={index}>
                    <td draggable="true">{insight.title}</td>
                    <td>{dateTimeFormat(insight.created_at)}</td>
                </tr>
            );
        });

        return (
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        { insightsHtml }
                    </tbody>
                </table>
                <br/>
                <button className="btn btn-default" >Anterior</button>
                <span style={{padding: 10}}>1 de 10</span>
                <button className="btn btn-default" >Próximo</button>
            </div>
        );
    }

}