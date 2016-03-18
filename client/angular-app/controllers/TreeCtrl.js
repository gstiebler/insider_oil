'use strict';
angular.module('InsiderOilApp').controller('TreeController', 
                ['$scope', 'server', '$routeParams', '$location', 'showError', 'Flash',
        function($scope, server, $routeParams, $location, showError, Flash) {
    
    var nodeId = $routeParams.nodeId;
    
    function makeItem(subTree) {
        return {
            label: subTree.label,
            id: subTree.id
        };
    }
    
    function findItemById(tree, stack) {
        if(!nodeId || tree.id == nodeId) {
            stack.push( makeItem(tree) );
            return tree;
        }
            
        if(tree.children) {
            for(var i = 0; i < tree.children.length; i++) {
                var result = findItemById(tree.children[i], stack);
                if(result) {
                    stack.push( makeItem(tree) );
                    return result;
                }
            }
        } 
        
        return false;
    }
    
    
    function showObjectsFromCategory(source, filters) {
        const options = { filters: filters };
        server.getTable( source, options, function(values) {
            $scope.records = values.records;
        }, showError.show );
        $scope.source = source;
    }
    
    
    function showTree(tree) {
        var stack = [];
        var subTree = findItemById(tree, stack);
        stack.reverse();
        $scope.stack = stack;
        if(!subTree) {
            var errorObj = { data: { errorMsg: 'Item da árvore não encontrado' } };
            showError.show(errorObj);
            return;
        }
        if(subTree.children) {
            // show children categories
            $scope.items = subTree.children;
        } else if (subTree.child) {
            showObjectsFromCategory(subTree.child.source, subTree.child.filters);
        } else {
            var errorObj = { data: { errorMsg: 'Item da árvore não encontrado' } };
            showError.show(errorObj);
        }
    }
    
    server.getTree(showTree, showError.show);
    
}]);