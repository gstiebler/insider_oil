import * as React from 'react';
import { IInsight } from '../../../../common/Interfaces';
import * as ni from '../../../../common/NetworkInterfaces';
import { getP } from '../../lib/Server';
import * as showError from '../../lib/ShowError';

interface IAppProps {
}

interface IAppState {
    insights:ni.GetTableData.res;
}

export class InsightsGrid extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            insights: null
        };
    }

    private componentDidMount() {
        this.getInsights();
    }

	private getInsights() {
        const req:ni.GetTableData.req = { 
            table: 'News',
            pagination: {
                first: '0',
                itemsPerPage: '10'
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
                    <td>{insight.title}</td>
                    <td>{insight.created_at}</td>
                </tr>
            );
        });

        return (
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
        );
    }

}