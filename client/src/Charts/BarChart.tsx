import * as React from 'react';
import * as d3 from 'd3';
import * as Interfaces from '../../../common/Interfaces';

interface IAppProps {
    countData: Interfaces.IAnalyticsCount[];
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
        google.charts.load('current', {packages: ['corechart', 'bar']});
        google.charts.setOnLoadCallback(this.onGoogleLoad.bind(this));
    }

    private onGoogleLoad() {
        this.chartsLoaded = true;
        this.showChart(this.props.countData);
    }

    private initChart() {
      this.chart = new google.visualization.BarChart(document.getElementById('chart_div'));
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
        var data = google.visualization.arrayToDataTable(arrayData);

      var options = {
        title: 'Population of Largest U.S. Cities',
        chartArea: {width: '50%'},
        hAxis: {
          title: 'Total Population',
          minValue: 0
        },
        vAxis: {
          title: 'City'
        }
      };

      this.chart.draw(data, options);
    }

    public render(): React.ReactElement<any> {
        return <div id="chart_div"></div>;
    }
}