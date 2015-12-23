'use strict';
angular.module('TreeCtrl', ['flash', 'ui.bootstrap']).controller('TreeController', 
                ['$scope', 'server', '$routeParams', '$location', 'showError', 'Flash',
        function($scope, server, $routeParams, $location, showError, Flash) {
    
    var nodeId = $routeParams.nodeId
    
    function showTree(tree) {
        console.log(tree);
        var labels = [];
        for(var i = 0; i < tree.length; i++)
            labels.push( tree[i].label );
        $scope.labels = labels;
    }
    
    server.getTree(showTree, showError.show);
    
}]);