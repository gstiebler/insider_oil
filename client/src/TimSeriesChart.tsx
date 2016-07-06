import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import * as d3 from 'd3';

interface IAppProps {
    queryName: string;
    qParams: any;
    chartParams: any;
}

interface IAppState {
}

export class Flash extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
        };
    }

        
    private componentWillReceiveProps(newProps:IAppProps) {
        var query = { 
            queryName: newProps.queryName,
            queryParams: newProps.qParams
        }
        server.getTimeSeries(query, this.showChart.bind(this), showError.show);
    }

    private showChart(records) {
        var data = records.records;
        if(data.length == 0)
            return;
        
        var chartParams = this.props.chartParams;
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 250 - margin.top - margin.bottom;
            
        var parseDate = d3.time.format("%m/%Y").parse;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(d3.time.year);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

        var svg = d3.select("#d3Container").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        data.forEach(function(d) {
            d.date = parseDate(d[chartParams.xAxis]);
        });

        console.log(data); 
        x.domain(d3.extent(data, function(d:any) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d[chartParams.yAxis]; })]);

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
            .text(chartParams.yLabel);

        svg.selectAll(".bar")
            .data(data)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d:any) { return x(d.date); })
            .attr("width", 5)
            .attr("y", function(d) { return y(d[chartParams.yAxis]); })
            .attr("height", function(d) { return height - y(d[chartParams.yAxis]); });
    }

    public render(): React.ReactElement<any> {
        return <div id="d3Container" />;
    }
}