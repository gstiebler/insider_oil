'use strict';
angular.module('InsiderOilApp').controller('TreeController', 
                ['$scope', 'server', '$routeParams', '$location', 'showError', 'Flash',
                 'ModelOperations', 'ModelViewService',
        function($scope, server, $routeParams, $location, showError, Flash,
                 ModelOperations, ModelViewService) {
    
    var nodeId = $routeParams.nodeId;
    const dataTableElement = $('#mainTable');
    
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
            // show children categories
            $scope.items = subTree.children;
            $scope.source = null;
        } else if (subTree.child) {
            showObjectsFromCategory(subTree.child.source, subTree.child.filters);
        } else {
            var errorObj = { data: { errorMsg: 'Item da árvore não encontrado' } };
            showError.show(errorObj);
        }
    }
    
    
    function showObjectsFromCategory(source, filters) {
        /* const options = { filters: filters };
        $scope.source = source;
        server.getTable( source, options, showModel, showError.show ); */
        
        initializeDataTable();
    }
    
    function initializeDataTable() {
        
        function formatLink(value, type, row) {
            var linkStr = '<a href="/app/view_record?source=' + $scope.source;
            linkStr += '&id=' + row.id;
            linkStr += '">' + value + '</a>'; 
            return linkStr;
        }
        
        function ajaxFn(data, callback, settings) {
            console.log(data);
            
            let columnNames = [];
            for(let i = 0; i < data.order.length; i++) {
                let columnIndex = data.order[i].column;
                columnNames.push( data.columns[columnIndex].data );
            }
            
            const options = {
                queryName: 'Blocks',
                queryParams: {
                    pagination: {
                        first: data.start,
                        itemsPerPage: data.length 
                    },
                    order: columnNames,
                    filters: []
                }
            };
            
            server.getTableData(options, setDataTablesRows, showError.show);
            
            function setDataTablesRows(serverResult) {
                console.log(serverResult);
                callback( { aaData: serverResult.records });
            }
        }
        
        const columns = [
            {
                data: 'name',
                title: 'Nome',
                render: { display: formatLink }
            },
            {
                data: 'operator_name',
                title: 'Operador', 
            }
        ];
        
        dataTableElement.DataTable( {
            columns: columns,
            language: ModelViewService.datatablesPtBrTranslation,
            processing: true,
            serverSide: true,
            ajax: ajaxFn
        } );
    }
    
    /*
    function showModel(modelData) {
    	if(modelData.records.length == 0) return;
        
        const modelOperations = ModelOperations.getModelOperations($scope.source);
        $scope.viewParams = modelData.viewParams;
        const columns = ModelViewService.getColumns(modelData.viewParams, modelData.types);
    }
    */
    
    server.getTree(showTree, showError.show);
}]);