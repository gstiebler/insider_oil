import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import { googleRef, loadLineChart } from '../lib/Google';

interface IyAxis {
    fieldName: string;
    label: string;
}

export interface IChartParams {
    yLabel: string;
    seriesList: IyAxis[];
    xAxis: string;
}

interface IAppProps {
    queryName: string;
    qParams: any;
    chartParams: IChartParams;
}

interface IAppState {
}

export class TimeSeriesChart extends React.Component<IAppProps, IAppState> {

    private chart;
    private chartsLoaded: boolean;

    constructor(props: IAppProps) {
        super(props);

        this.state = {};
        this.chartsLoaded = false;
    }

    private componentDidMount() {
        loadLineChart().then(this.onGoogleLoad.bind(this));
    }

    private onGoogleLoad() {
        this.chartsLoaded = true;
        this.initChart();
        this.getChartData(this.props);
    }

    private initChart() {
        this.chart = new googleRef.visualization.LineChart(document.getElementById('ts_chart_div'));
    }

    private getChartData(props: IAppProps) {
        var query = {
            queryName: props.queryName,
            queryParams: props.qParams
        }
        server.getTimeSeries(query)
            .then(this.showChart.bind(this))
            .catch(showError.show);
    }

    private showChart(records) {
        if (!records)
            return;
        var rawData:any[] = records.records;
        if (rawData.length == 0)
            return;

        const data = rawData.map(item => {
            let dateStr = item[this.props.chartParams.xAxis];
            let dateParts = dateStr.split('/');
            let date = new Date(dateParts[1], dateParts[0]);
            let result = [date];

            for(let serie of this.props.chartParams.seriesList) {
                result.push(item[serie.fieldName]);
            }
            return result;
        });

        var dataTable = new googleRef.visualization.DataTable();
        dataTable.addColumn('date', 'Datas');
        for(let serie of this.props.chartParams.seriesList) {
            dataTable.addColumn('number', serie.label);
        }

        dataTable.addRows(data);

        var options = {
            vAxis: {
                title: this.props.chartParams.yLabel
            },
        };

        this.chart.draw(dataTable, options);
    }

    public render(): React.ReactElement<any> {
        return <div id="ts_chart_div"></div>;
    }
}