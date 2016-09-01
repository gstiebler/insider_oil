import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import * as ni from '../../common/NetworkInterfaces';
import * as Interfaces from '../../common/Interfaces';
import * as ArrayUtils from './lib/ArrayUtils';
import { BarChart } from './Charts/BarChart';

interface IAppProps {
}

interface IAppState {
    sources: Interfaces.IAnalyticsSource[];
    selectedSourceName: string;
    groupField: string;
    countData: Interfaces.IAnalyticsCount[];
}

export class Analytics extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            sources: [],
            selectedSourceName: null,
            groupField: null,
            countData: []
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
        this.state.groupField = selectedSource.possibleGroups[0].fieldName;
        this.getCountData();
    }

    private groupFieldChanged(event) {
        this.state.groupField = event.target.value;
        this.getCountData();
    }

    private getCountData() {
        const req:ni.AnalyticsCount.req = {
            source: this.state.selectedSourceName,
            field: this.state.groupField
        };
        server.getP('/analytics/count_values', req)
            .then(this.onCountData.bind(this))
            .catch(showError.show);
    } 

    private onCountData(res: ni.AnalyticsCount.res) {
        this.state.countData = res.countResult;
        this.setState(this.state);
    }

    private getSourcesCombo(): React.ReactElement<any> {
        const sourcesOptions = this.state.sources.map((source, index) => {
            return <option value={source.sourceName} key={index}>{source.title}</option>;
        });

        return (
            <select className="form-control"
                    onChange={this.sourceChange.bind(this)}>
                { sourcesOptions }
            </select>
        );
    }

    private getSelectedSource():Interfaces.IAnalyticsSource {
       return ArrayUtils.find(this.state.sources, val => {
            return val.sourceName == this.state.selectedSourceName;
        });
    }

    private getGroupFieldCombo():React.ReactElement<any> {
        let selectedSource = this.getSelectedSource(); 
        if(!selectedSource) {
            return null;
        }
        const groupsOptions = selectedSource.possibleGroups.map((group, index) => {
            return <option value={group.fieldName} key={index}>{group.label}</option>;
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
                    <BarChart countData={this.state.countData}/>
                </div>
            </div> 
		);
    }
}