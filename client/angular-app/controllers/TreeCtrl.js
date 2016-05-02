'use strict';
angular.module('InsiderOilApp').controller('TreeController', 
                ['$scope', 'server', '$routeParams', '$location', 'showError', 'Flash',
                 'ModelOperations', 'ModelViewService',
        function($scope, server, $routeParams, $location, showError, Flash,
                 ModelOperations, ModelViewService) {
    
    var nodeId = $routeParams.nodeId;
    var nodeLabel = $routeParams.nodeLabel;
    $scope.onError = showError.show;
    
    function makeItem(subTree) {
        return {
            label: subTree.label,
            id: subTree.id
        };
    }
    
    function findItem(tree, stack) {
        if(tree.id == nodeId || tree.label == nodeLabel) {
            stack.push( makeItem(tree) );
            return tree;
        }
            
        if(tree.children) {
            for(var i = 0; i < tree.children.length; i++) {
                var result = findItem(tree.children[i], stack);
                if(result) {
                    stack.push( makeItem(tree) );
                    return result;
                }
            }
        } 
        
        return false;
    }
    
    
    function showTree(tree) {
        var stack = [];
        var subTree = findItem(tree, stack);
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
            $scope.tableParams = null;
        } else if (subTree.child) {
            showObjectsFromCategory(subTree);
        } else {
            var errorObj = { data: { errorMsg: 'Item da árvore não encontrado' } };
            showError.show(errorObj);
        }
    }
    
    
    function showObjectsFromCategory(subTree) {
        $scope.tableParams = {
            label: subTree.label,
            fields: subTree.child.fields,
            source: subTree.child.source  
        };
    }
    
    server.getTree(showTree, showError.show);
}]);