'use strict';

var app = angular.module('ProductionChartDirective', []);

var _server;
var _$pc_scope;

function queryParamsChanged(qParams) {
     var query = { 
        queryName: _$pc_scope.queryName,
        queryParams: qParams
     }
     console.log('prod chart', query);
    //_server.getProduction(query, onData, _$pc_scope.onError);
}

function pcController($scope, server) {
    _server = server;
    _$pc_scope = $scope;
    $scope.$watch('qParams', queryParamsChanged);
    
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
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

    var data = [
    {
        letter: 'a',
        frequency: 30
    },
    {
        letter: 'b',
        frequency: 50
    },
    {
        letter: 'c',
        frequency: 30
    },
    ];

    x.domain(data.map(function(d) { return d.letter; }));
    y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

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
        .attr("x", function(d) { return x(d.letter); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.frequency); })
        .attr("height", function(d) { return height - y(d.frequency); });
}

app.directive('productionChart', function() {
    return {
        restrict: 'E',
        scope: {
            queryName: '=queryName',
            qParams: '=qParams',
            onError: '=onError',
        },
        controller:['$scope', 'server', pcController],
        templateUrl: 'app/directives/templates/production_chart.html'
    };
});