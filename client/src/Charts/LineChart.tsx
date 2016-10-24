import * as React from 'react';
import { NSAnalytics } from '../../../common/Interfaces';
import { googleRef, loadCharts } from '../lib/Google';

interface IAppProps {
    analyticsData: NSAnalytics.IResult;
}

interface IAppState {
}

export class LineChart extends React.Component<IAppProps, IAppState> {

    private chartsLoaded:boolean;
    private chart;

    constructor(props: IAppProps) {
        super(props);

        this.state = {};
        this.chartsLoaded = false;
    }

    private componentDidMount() {
        loadCharts().then(this.onGoogleLoad.bind(this));
    }

    private onGoogleLoad() {
        this.chartsLoaded = true;
        this.initChart();
        this.showChart(this.props.analyticsData);
    }

    private initChart() {
        this.chart = new googleRef.visualization.LineChart(document.getElementById('chart_div'));
    }

    private componentWillReceiveProps(nextProps:IAppProps) {
        if(!this.chartsLoaded)
            return;
        this.showChart(nextProps.analyticsData);
    }

    private showChart(analyticsCount: NSAnalytics.IResult) {
        var dataTable = new googleRef.visualization.DataTable();

        // Declare columns
        dataTable.addColumn('string', 'Item');
        dataTable.addColumn('number', 'quantidade');

        const arrayData = analyticsCount.items.map(item => {
            return [item.label.toString(), item.value];
        });
        if(arrayData.length == 0) {
            arrayData.push(['vazio', 0]);
        }
        dataTable.addRows(arrayData);

        const options = {
            vAxis: {
                title: 'Título'
            },
        };
        this.chart.draw(dataTable, options);
    }

    public render(): React.ReactElement<any> {
        return <div id="chart_div"></div>;
    }
}