import * as React from 'react';
import { IInsight } from '../../../../common/Interfaces';
import { Insights } from '../../../../common/NetworkInterfaces';
import { getP } from '../../lib/Server';
import * as showError from '../../lib/ShowError';
import { Link } from 'react-router';
import { InsightsReorderableList, removeById, allowDrop } from './InsightsReorderableList';
import { InsightsGrid } from './InsightsGrid';

interface IAppProps {
}

interface IAppState {
    insights: Insights.res;
}

export class Publisher extends React.Component<IAppProps, IAppState> {

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
		getP('/insights', {})
			.then(this.onInsights.bind(this))
			.catch(showError.show);
	}

	private onInsights(res:Insights.res) {
		this.state.insights = res;
		this.setState(this.state);
        return null;
	}

    public onListChange(listName: string, items: IInsight[]) {
        this.state.insights[listName] = items;
    }    
    
    private drop(ev) {
        ev.preventDefault();
        const insightStr = ev.dataTransfer.getData("text");
        const insight:IInsight = JSON.parse(insightStr);
        const sourceName = insight['source'];
        const items = this.state.insights[sourceName];
        if(!items) 
            return;
        removeById(items, insight.id);
        this.state.insights[sourceName] = items;
        this.setState(this.state);
    }

    public render(): React.ReactElement<any> {
        const { insights } = this.state;
        if(!insights) {
            return <div></div>
        }

		return (
            <div className="row">
                <div className="col-md-6">
                    <div className="row">
                        <div className="col-md-6">
                            FlexSlider
                            <InsightsReorderableList data={insights.flexSlider} 
                                    onChange={this.onListChange.bind(this)}
                                    listName="flexSlider" />
                        </div>
                        <div className="col-md-6">
                            <img src="images/trash.jpg" alt=""
                                onDragOver={allowDrop}
                                onDrop={this.drop.bind(this)}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            Section 1
                            <InsightsReorderableList data={insights.section1Articles} 
                                    onChange={this.onListChange.bind(this)}
                                    listName="section1Articles" />
                        </div>
                        <div className="col-md-6">
                            Section 2
                            <InsightsReorderableList data={insights.section2Articles} 
                                    onChange={this.onListChange.bind(this)}
                                    listName="section2Articles" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            Section 3
                            <InsightsReorderableList data={insights.section3Articles} 
                                    onChange={this.onListChange.bind(this)}
                                    listName="section3Articles" />
                        </div>
                        <div className="col-md-6">
                            Section 4
                            <InsightsReorderableList data={insights.section4Articles} 
                                    onChange={this.onListChange.bind(this)}
                                    listName="section4Articles" />
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <InsightsGrid />
                </div>
            </div>
        );
    }
}