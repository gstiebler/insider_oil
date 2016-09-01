import * as React from 'react';
import * as d3 from 'd3';
import * as Interfaces from '../../../common/Interfaces';

const googleRef = google;

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
        googleRef.charts.load('current', {packages: ['corechart', 'bar']});
        googleRef.charts.setOnLoadCallback(this.onGoogleLoad.bind(this));
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

    private showChart(data: Interfaces.IAnalyticsCount[]) {
        const arrayData = data.map(item => {
            return [item.label, item.count_value];
        });
        if(arrayData.length == 0) {
            arrayData.push(['vazio', 0]);
        }
        arrayData.splice(0, 0, ['Item', 'quantidade']);
        var data = googleRef.visualization.arrayToDataTable(arrayData);

      var options = {
        chartArea: {width: '50%'},
        height: 500,
        hAxis: {
          title: 'Quantidade',
          minValue: 0
        },
        vAxis: {
          title: this.props.axisName
        }
      };

      this.chart.draw(data, options);
    }

    public render(): React.ReactElement<any> {
        return <div id="chart_div"></div>;
    }
}