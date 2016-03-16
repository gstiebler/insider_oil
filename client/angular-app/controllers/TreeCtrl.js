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
            var items = [];
            for(var i = 0; i < subTree.children.length; i++) {
                var item = {
                    label: subTree.children[i].label,
                    id: subTree.children[i].id
                };
                items.push( item );
            }
            $scope.items = items;
        } else if (subTree.child) {
            $scope.source = subTree.child.source;
            const options = { filters: subTree.child.filters };
            server.getTable( subTree.child.source, options, function(values) {
                $scope.records = values.records;
            }, showError.show );
        } else {
            var errorObj = { data: { errorMsg: 'Item da árvore não encontrado' } };
            showError.show(errorObj);
        }
    }
    
    server.getTree(showTree, showError.show);
    
}]);