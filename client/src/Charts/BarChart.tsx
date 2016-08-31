import * as React from 'react';
import * as d3 from 'd3';
import * as Interfaces from '../../../common/Interfaces';

interface IAppProps {
    countData: Interfaces.IAnalyticsCount[];
}

interface IAppState {
}

export class BarChart extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {};
    }

    private componentDidMount() {
        this.showChart(this.props.countData);
    }

    private componentWillReceiveProps(nextProps:IAppProps) {
        d3.selectAll('svg').remove();
        this.showChart(nextProps.countData);
    }

    private showChart(data: Interfaces.IAnalyticsCount[]) {
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 600 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.linear()
            .range([width, 0]);

        var y = d3.scale.ordinal()
            .rangeRoundBands([0, height], .1);

        var xAxis = d3.svg.axis();
        xAxis.scale(x);
        xAxis.orient("bottom");

        var yAxis = d3.svg.axis();
        yAxis.scale(y);
        yAxis.orient("left");

        var svg = d3.select("#d3Container").append("svg");
        svg.attr("width", width + margin.left + margin.right)
        svg.attr("height", height + margin.top + margin.bottom);
        const g = svg.append("g");
        g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain([0, d3.max(data, (d) => { return d.count_value; })]);
        y.domain(data.map(d => { return d.label; }));

        const x_axis = svg.append("g");
        x_axis.attr("class", "x axis")
        x_axis.attr("transform", "translate(0," + height + ")")
        x_axis.call(xAxis);

        const y_axis = svg.append("g");
        y_axis.attr("class", "y axis")
        y_axis.call(yAxis)
        const yText = y_axis.append("text");
        yText.attr("transform", "rotate(-90)")
        yText.attr("y", 6)
        yText.attr("dy", ".71em")
        yText.style("text-anchor", "end")
        yText.text("Frequency");

        const allBars = svg.selectAll(".bar");
        const barData = allBars.data(data);
        const rect = barData.enter().append("rect");
        rect.attr("class", "bar")
            .attr("x", (d) => { return 0; })
            .attr("width", (d) => { return width - x(d.count_value); })
            .attr("y", (d) => { return y(d.label); })
            .attr("height", y.rangeBand());
    }

    public render(): React.ReactElement<any> {
        return <div id="d3Container" />;
    }
}