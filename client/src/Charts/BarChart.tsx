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
        this.showChart(nextProps.countData);
    }

    private showChart(data: Interfaces.IAnalyticsCount[]) {
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 600 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10, "%");

        var svg = d3.select("#d3Container").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(data.map(d => { return d.label; }));
        y.domain([0, d3.max(data, (d) => { return d.count_value; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Frequency");

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", (d) => { return x(d.label); })
            .attr("width", x.rangeBand())
            .attr("y", (d) => { return y(d.count_value); })
            .attr("height", (d) => { return height - y(d.count_value); });
    }

    public render(): React.ReactElement<any> {
        return <div id="d3Container" />;
    }
}