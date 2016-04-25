'use strict';

/*****************
This directive is used to show a table with the content paginated, ordered
and filtered in the server
******************/

var _server;
var _onError;
var app = angular.module('PaginatedTableDirective', []);

/**
 * Function passed to DataTables to format a row with links
 */
function formatLink(value, type, row) {
    var linkStr = '<a href="/app/view_record?source=' + row.model;
    linkStr += '&id=' + row.id;
    linkStr += '">' + value + '</a>'; 
    return linkStr;
}

/**
 * DataTables callback to refresh the data. It's called when the order column change,
 * and when a page on pagination is clicked
 */
function ajaxFn(data, callback, settings) {
    let columnNames = [];
    for(let i = 0; i < data.order.length; i++) {
        let columnIndex = data.order[i].column;
        let dir = data.order[i].dir;
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
    
    function setDataTablesRows(serverResult) {
        const result = { 
            aaData: serverResult.records,
            recordsTotal: serverResult.count,
            recordsFiltered: serverResult.count 
        };
        callback(result);
    }
    
    _server.getTableData(options, setDataTablesRows, _onError);
}

let controller = ['$scope', 'server', 'ModelViewService',
function($scope, server, ModelViewService) { 
    _server = server;
    _onError = $scope.onError;
    const dataTableElement = $('#mainTable');
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
}];

app.directive('paginatedTable', function() {
    return {
        restrict: 'E',
        scope: {
            onError: '=onError'
        },
        controller: controller,
        templateUrl: 'app/directives/templates/paginated_table.html'
    };
});