angular.module('ChartCtrl', []).controller('ChartController', 
                ['$scope', 'server', '$routeParams', '$location',
        function($scope, server, $routeParams, $location) {
    
    var modelName = "Well";
    server.getTable(modelName, {}, showModel, showError );
    
    function showModel(model) {
        var labelField = model.viewParams.labelField;
        var records = model.records; 
        
        var chartDataArray = [['ID', 'Latitude', 'Longitude']];
        for(var i = 0; i < records.length; i++) {
            var record = records[i];
            chartDataArray.push([record.id, record.lat, record.lng]);
        }
    
        var data = google.visualization.arrayToDataTable(chartDataArray);

        var options = {
          title: 'Poços',
          curveType: 'function',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
    }
    
    function showError(error) {
        $scope.error = error;
        console.log('Erros: ' + error);
    }
}]);