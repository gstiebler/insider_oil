angular.module('CreateItemCtrl', []).controller('CreateItemController', 
                ['$scope', 'server', '$routeParams', '$location',
        function($scope, server, $routeParams, $location) {

    var modelName = $routeParams.model;
    server.getModelFields(modelName, fieldsArrived, onError);
    
    var htmlInputObjs = [];
    function fieldsArrived(fields) {
        console.log(fields);
        
        var baseDiv = document.getElementById('baseDiv');
        
        for( var i = 0; i < fields.length; i++ ) {
            var e = document.createElement('div');
            e.innerHTML = fields[i].label + ": <input type=\"text\" \><br>";
            baseDiv.appendChild(e);
            htmlInputObjs.push({
                field: fields[i],
                htmlElement: e
            });
        }
    }
    
    function onError(err) {
        console.log(err);
    }
        
}]);