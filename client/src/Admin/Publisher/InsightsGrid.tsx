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
    insightsCount:number;
    insightsIndex:number;
    itemsPerPage:number;
}

export class InsightsGrid extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            insights: null,
            insightsCount: -1,
            insightsIndex: 0,
            itemsPerPage: 10
        };
    }

    private componentDidMount() {
        this.getInsights();
    }

	private getInsights() {
        const req:ni.GetTableData.req = { 
            table: 'News',
            pagination: {
                first: this.state.insightsIndex.toString(),
                itemsPerPage: this.state.itemsPerPage.toString()
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
        this.state.insightsCount = res.count;
		this.setState(this.state);
        return null;
	}

    private drag(insight, ev) {
        ev.dataTransfer.setData("text", JSON.stringify(insight));
    }

    private paginationClicked(increment) {
        this.state.insightsIndex += increment;
        if(this.state.insightsIndex < 0) {
            this.state.insightsIndex = 0;
        }
        this.getInsights();
    }

    public render(): React.ReactElement<any> {
        const insights = this.state.insights;
        if(!insights) {
            return <div></div>
        }

        const insightsHtml = insights.records.map((insight, index) => {
            return (                
                <tr key={index}>
                    <td draggable={true}
                       onDragStart={this.drag.bind(this, insight)} 
                       >{insight.title}</td>
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
                <button className="btn btn-default"
                    onClick={this.paginationClicked.bind(this, -this.state.itemsPerPage)} 
                            >Anterior</button>
                <span style={{padding: 10}}>{this.state.insightsIndex + 1} de {this.state.insightsCount}</span>
                <button className="btn btn-default" 
                    onClick={this.paginationClicked.bind(this, this.state.itemsPerPage)} 
                            >Próximo</button>
            </div>
        );
    }

}