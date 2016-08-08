import * as React from 'react';
import { IInsight } from '../../../../common/Interfaces';
import { Insights } from '../../../../common/NetworkInterfaces';
import { getP } from '../../lib/Server';
import * as showError from '../../lib/ShowError';
import { Link } from 'react-router';
import { InsightsReorderableList } from './InsightsReorderableList';
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
	}

    public onListChange(listName: string, items: IInsight[]) {
        this.state.insights[listName] = items;
    }

    public render(): React.ReactElement<any> {
        const { insights } = this.state;
        if(!insights) {
            return <div></div>
        }

		return (
            <div className="row">
                <div className="col-md-6">
                    FlexSlider
                    <InsightsReorderableList data={insights.flexSlider} 
                            onChange={this.onListChange.bind(this)} />
                    <div className="row">
                        Section 1
                        <InsightsReorderableList data={insights.section1Articles} 
                                className="col-md-6" 
                                onChange={this.onListChange.bind(this)} />
                        Section 2
                        <InsightsReorderableList data={insights.section2Articles} 
                                className="col-md-6" 
                                onChange={this.onListChange.bind(this)} />
                    </div>
                    Carroussel
                    <InsightsReorderableList data={insights.carroussel} 
                            onChange={this.onListChange.bind(this)} />
                    Section 3
                    <InsightsReorderableList data={insights.section3Articles} 
                            onChange={this.onListChange.bind(this)} />
                    Section 4
                    <InsightsReorderableList data={insights.section4Articles} 
                            onChange={this.onListChange.bind(this)} />
                </div>
                <div className="col-md-6">
                    Grid com notícias
                </div>
            </div>
        );
    }
}