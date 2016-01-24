'use strict';
angular.module('InsiderOilApp').controller('MapController', 
                ['$scope', 'server', '$routeParams',
        function($scope, server, $routeParams) {

    var mapDiv = document.getElementById('map');

    server.getTable($routeParams.model, {}, showModel, showError );    
    
    function showModel(model) {
        var labelField = model.viewParams.labelField;
        var records = model.records; 
    
        var center = {lat: records[0].lat, lng: records[0].lng};
        
        var map = new google.maps.Map(mapDiv, {
            zoom: 4,
            center: center
        });    

        for(var i = 0; i < records.length; i++) {
            var record = records[i];
            var pos = {lat: record.lat, lng: record.lng};
            var title = record[labelField];
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                title: title
            });
        }  
    }
    
    function showError(error) {
        $scope.error = error;
        console.log('Erros: ' + error);
    }
}]);