'use strict';
angular.module('TreeCtrl', ['flash', 'ui.bootstrap']).controller('TreeController', 
                ['$scope', 'server', '$routeParams', '$location', 'showError', 'Flash',
        function($scope, server, $routeParams, $location, showError, Flash) {
    
    var nodeId = $routeParams.nodeId;
    
    function findItemById(tree) {
        if(!nodeId)
            return tree;
            
        if(tree.id == nodeId)
            return tree;
            
        if(tree.children) {
            for(var i = 0; i < tree.children.length; i++) {
                var result = findItemById(tree.children[i]);
                if(result)
                    return result;
            }
        }
        
        return null;
    }
    
    function showTree(tree) {
        var subTree = findItemById(tree, nodeId);
        var items = [];
        for(var i = 0; i < subTree.children.length; i++) {
            var item = {
                label: subTree.children[i].label,
                id: subTree.children[i].id
            };
            items.push( item );
        }
        $scope.items = items;
    }
    
    server.getTree(showTree, showError.show);
    
}]);