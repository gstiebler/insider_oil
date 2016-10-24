import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import * as ni from '../../../common/NetworkInterfaces';
import { NSAnalytics, IFilter } from '../../../common/Interfaces';
import * as ArrayUtils from './../lib/ArrayUtils';
import { ITableParams } from '../PaginatedTable/PaginatedTable';
import { FiltersGroup } from '../Components/FiltersGroup'; 
import { BarChart } from './../Charts/BarChart';
import { PieChart } from './../Charts/PieChart';
import { LineChart } from './../Charts/LineChart';

const chartTypes = [
    {
        name: 'bar',
        label: 'Barras'
    },
    {
        name: 'pie',
        label: 'Pizza'
    },
    {
        name: 'line',
        label: 'Linha'
    }
];

interface IAppProps {
}

interface IAppState {
    sources: NSAnalytics.IFrontendSource[];
    selectedSourceName: string;
    groupField: string;
    valueField: string;
    result: NSAnalytics.IResult;
    chartType: string;
    filters: IFilter[];
    tableParams: ITableParams;
}

export class Analytics extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            sources: [],
            selectedSourceName: null,
            groupField: null,
            valueField: null,
            result: {
                items: [],
                othersValue: 0 
            },
            chartType: chartTypes[0].name,
            filters: [],
            tableParams: null,
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
        
        let selectedSource = this.getSelectedSource(); 
        this.state.groupField = selectedSource.groupFields[0].name;
        this.state.valueField = selectedSource.valueFields[0].name;
        this.setState(this.state);
        this.getResult();
        this.getParamsForFilters();
    }

    private getParamsForFilters() {
        const req:ni.GetTableQueriesFields.req = { 
            queryName: this.state.selectedSourceName 
        };
        server.getP('/queries_fields', req)
            .then(this.onTableParamFieldsForFilters.bind(this))
            .catch(showError.show);
    }

    private onTableParamFieldsForFilters(res:ni.GetTableQueriesFields.res) {
        const fields = res.fields;
        this.state.tableParams = {
            fields,
            tableauUrl: res.tableauUrl,
            label: res.title,
            source: this.state.selectedSourceName
        };

        this.setState(this.state);
        return null;
    }

    private sourceChange(event) {
        this.state.selectedSourceName = event.target.value;
        let selectedSource = this.getSelectedSource(); 
        if(!selectedSource) {
            return null;
        }
        this.state.groupField = selectedSource.groupFields[0].name;
        this.state.valueField = selectedSource.valueFields[0].name;
        this.getResult();
        this.getParamsForFilters();
        this.setState(this.state);
    }

    private selectedFieldChanged(propName: string, event) {
        this.state[propName] = event.target.value;
        this.getResult();
    }

    private getResult() {
        const req:ni.AnalyticsResults.req = {
            source: this.state.selectedSourceName,
            groupField: this.state.groupField,
            valueField: this.state.valueField,
            maxNumItems: 10,
            filters: []
        };
        server.getP('/analytics/count_values', req)
            .then(this.onResult.bind(this))
            .catch(showError.show);
    } 

    private onResult(res: ni.AnalyticsResults.res) {
        this.state.result = res.result;
        this.setState(this.state);
    }

    private onChartTypeChange(event) {
        this.state.chartType = event.target.value;
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

    private getFieldCombo(fields: NSAnalytics.IAField[], propName: string):React.ReactElement<any> {
        let selectedSource = this.getSelectedSource(); 
        if(!selectedSource) {
            return null;
        }
        const options = fields.map((gfield, index) => {
            return (
                <option value={gfield.name}
                        selected={gfield.name == this.state[propName]} 
                        key={index}>
                    {gfield.label}
                </option>
            );
        });

        return (
            <select className="form-control"
                    onChange={this.selectedFieldChanged.bind(this, propName)}
                    defaultValue={this.state.selectedSourceName}>
                { options }
            </select>
        );
    }

    private getGroupFieldsCombo() {
        let selectedSource = this.getSelectedSource(); 
        if(!selectedSource) {
            return null;
        }
        return this.getFieldCombo(selectedSource.groupFields, 'groupField');
    }

    private getValueFieldsCombo() {
        let selectedSource = this.getSelectedSource(); 
        if(!selectedSource) {
            return null;
        }
        return this.getFieldCombo(selectedSource.valueFields, 'valueField');
    }

    private getChartTypesCombo(): React.ReactElement<any> {
        const sourcesOptions = chartTypes.map((type, index) => {
            return (
                <option value={type.name} 
                    key={index}
                    selected={type.name == this.state.chartType}>
                        {type.label}
                </option>
            );
        });

        return (
            <select className="form-control"
                    onChange={this.onChartTypeChange.bind(this)}>
                { sourcesOptions }
            </select>
        );
    }

    private getChart(): React.ReactElement<any> {
        if(this.state.chartType == chartTypes[0].name) {
            return <BarChart analyticsData={this.state.result}/>
        } else if(this.state.chartType == chartTypes[1].name) {
            return <PieChart analyticsData={this.state.result}/>
        } else if(this.state.chartType == chartTypes[2].name) {
            return <LineChart analyticsData={this.state.result}/>
        }
    }

    private onFiltersChange(filters: IFilter[]) {
        this.state.filters = filters;
        this.setState(this.state);
    }

    public render(): React.ReactElement<any> {
        let filtersGroupHTML = null;
        if(this.state.tableParams) {
            filtersGroupHTML = (
                <div className="panel panel-default">
                    <div className="panel-body">
                        <FiltersGroup 
                            tableParams={this.state.tableParams}
                            onChange={this.onFiltersChange.bind(this)} >
                        </FiltersGroup>
                    </div>
                </div>
            );
        }

		return (
            <div>
                { filtersGroupHTML }
                <div className="row">
                    <div className="col-lg-3 col-md-3">
                        Fonte: { this.getSourcesCombo() }
                        <br/>
                        Agrupar por: { this.getGroupFieldsCombo() }
                        <br/>
                        Propriedade: { this.getValueFieldsCombo() }
                        <br/>
                        Tipo: { this.getChartTypesCombo() }
                    </div>
                    <div className="col-lg-9 col-md-9">
                        { this.getChart() }
                    </div>
                </div>
            </div> 
		);
    }
}