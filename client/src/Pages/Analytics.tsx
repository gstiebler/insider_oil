import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import * as ni from '../../../common/NetworkInterfaces';
import { NSAnalytics } from '../../../common/Interfaces';
import * as ArrayUtils from './../lib/ArrayUtils';
import { BarChart } from './../Charts/BarChart';

interface IAppProps {
}

interface IAppState {
    sources: NSAnalytics.IFrontendSource[];
    selectedSourceName: string;
    groupField: string;
    result: NSAnalytics.IResult;
}

export class Analytics extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            sources: [],
            selectedSourceName: null,
            groupField: null,
            result: {
                items: [],
                othersValue: 0 
            }
        };
    }

    private componentDidMount() {
        const req:ni.AnalyticsSources.req = {};
        server.getP('/analytics/sources', req)
            .then(this.onSources.bind(this))
            .catch(showError.show);
    }    

    private onSources(res: ni.AnalyticsSources.res) {
        this.state.sources = res.sources;
        this.state.selectedSourceName = this.state.sources[0].sourceName;
        this.setState(this.state);
    }

    private sourceChange(event) {
        this.state.selectedSourceName = event.target.value;
        let selectedSource = this.getSelectedSource(); 
        if(!selectedSource) {
            return null;
        }
        this.state.groupField = selectedSource.groupFields[0].name;
        this.getResult();
    }

    private groupFieldChanged(event) {
        this.state.groupField = event.target.value;
        this.getResult();
    }

    private getResult() {
        const req:ni.AnalyticsResults.req = {
            source: this.state.selectedSourceName,
            groupField: this.state.groupField,
            valueField: this.state.valueField,
            maxNumItems: 10
        };
        server.getP('/analytics/count_values', req)
            .then(this.onCountData.bind(this))
            .catch(showError.show);
    } 

    private onCountData(res: ni.AnalyticsResults.res) {
        this.state.result = res.result;
        this.setState(this.state);
    }

    private getSourcesCombo(): React.ReactElement<any> {
        const sourcesOptions = this.state.sources.map((source, index) => {
            return <option value={source.sourceName} key={index}>{source.label}</option>;
        });

        return (
            <select className="form-control"
                    onChange={this.sourceChange.bind(this)}>
                { sourcesOptions }
            </select>
        );
    }

    private getSelectedSource():NSAnalytics.IFrontendSource {
       return ArrayUtils.find(this.state.sources, val => {
            return val.sourceName == this.state.selectedSourceName;
        });
    }

    private getGroupFieldCombo():React.ReactElement<any> {
        let selectedSource = this.getSelectedSource(); 
        if(!selectedSource) {
            return null;
        }
        const groupsOptions = selectedSource.groupFields.map((gfield, index) => {
            return <option value={gfield.name} key={index}>{gfield.label}</option>;
        });

        return (
            <select className="form-control"
                    onChange={this.groupFieldChanged.bind(this)}
                    defaultValue={this.state.selectedSourceName}>
                { groupsOptions }
            </select>
        );
    }

    public render(): React.ReactElement<any> {
		return (
            <div className="row">
                <div className="col-lg-3 col-md-3">
                    Fonte: { this.getSourcesCombo() }
                    <br/>
                    Agrupar por: { this.getGroupFieldCombo() }
                </div>
                <div className="col-lg-9 col-md-9">
                    <BarChart analyticsData={this.state.result}/>
                </div>
            </div> 
		);
    }
}