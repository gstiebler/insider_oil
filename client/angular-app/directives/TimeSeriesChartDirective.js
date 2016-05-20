'use strict';

var app = angular.module('TimeSeriesChartDirective', []);

var _server;
var _$pc_scope;

function queryParamsChanged(qParams) {
     var query = { 
        queryName: _$pc_scope.queryName,
        queryParams: qParams
     }
    _server.getTimeSeries(query, showChart, _$pc_scope.onError);
}

function showChart(records) {
     var data = records.records;
       
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
        d.date = parseDate(d[_$pc_scope.chartParams.xAxis]);
    });

     console.log(data); 
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d[_$pc_scope.chartParams.yAxis]; })]);

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
        .text(_$pc_scope.chartParams.yLabel);

    svg.selectAll(".bar")
        .data(data)
    .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.date); })
        .attr("width", 5)
        .attr("y", function(d) { return y(d[_$pc_scope.chartParams.yAxis]); })
        .attr("height", function(d) { return height - y(d[_$pc_scope.chartParams.yAxis]); });
}

function pcController($scope, server) {
    _server = server;
    _$pc_scope = $scope;
    $scope.$watch('qParams', queryParamsChanged);
}

app.directive('timeSeriesChart', function() {
    return {
        restrict: 'E',
        scope: {
            queryName: '@queryName',
            qParams: '=qParams',
            chartParams: '=chartParams',
            onError: '=onError',
        },
        controller:['$scope', 'server', pcController],
        templateUrl: 'app/directives/templates/time_series_chart.html'
    };
});