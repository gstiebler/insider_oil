import * as React from 'react';
import * as Interfaces from '../../../common/Interfaces';
import { googleRef, loadBarChart } from '../lib/Google';

interface IAppProps {
    countData: Interfaces.IAnalyticsCount[];
    axisName: string;
}

interface IAppState {
}

export class BarChart extends React.Component<IAppProps, IAppState> {

    private chartsLoaded:boolean;
    private chart;

    constructor(props: IAppProps) {
        super(props);

        this.state = {};
        this.chartsLoaded = false;
    }

    private componentDidMount() {
        loadBarChart().then(this.onGoogleLoad.bind(this));
    }

    private onGoogleLoad() {
        this.chartsLoaded = true;
        this.initChart();
        this.showChart(this.props.countData);
    }

    private initChart() {
        this.chart = new googleRef.visualization.BarChart(document.getElementById('chart_div'));
    }

    private componentWillReceiveProps(nextProps:IAppProps) {
        if(!this.chartsLoaded)
            return;
        this.showChart(nextProps.countData);
    }

    private showChart(analyticsCount: Interfaces.IAnalyticsCount[]) {
        var dataTable = new googleRef.visualization.DataTable();

        // Declare columns
        dataTable.addColumn('string', 'Item');
        dataTable.addColumn('number', 'quantidade');

        const arrayData = analyticsCount.map(item => {
            return [item.label, item.count_value];
        });
        if(arrayData.length == 0) {
            arrayData.push(['vazio', 0]);
        }
        dataTable.addRows(arrayData);

        var options = {
            chartArea: {width: '50%'},
            height: 500,
            animation:{
                duration: 500,
                easing: 'inAndOut',
            },
            hAxis: {
                title: 'Quantidade',
                minValue: 0
            },
            vAxis: {
                title: this.props.axisName
            }
        };

        this.chart.draw(dataTable, options);
    }

    public render(): React.ReactElement<any> {
        return <div id="chart_div"></div>;
    }
}