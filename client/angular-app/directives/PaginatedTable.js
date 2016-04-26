'use strict';

/*****************
This directive is used to show a table with the content paginated, ordered
and filtered in the server
******************/

var _server;
var _ModelViewService;
var _$scope;
var dataTable;
var filters = [];

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
        queryName: _$scope.tableParams.source,
        queryParams: {
            pagination: {
                first: data.start,
                itemsPerPage: data.length 
            },
            order: columnNames,
            filters: filters
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
    
    _server.getTableData(options, setDataTablesRows, _$scope.onError);
}

/**
 * Responds to change in the tableParams. It occurs when a new table has to be shown
 */
function tableParamsChanged(tableParams) {
    if(!tableParams)
        return;
        
    const dataTableElement = $('#mainTable');
    const columns = [];
    for(let i = 0; i < tableParams.fields.length; i++) {
        let field = tableParams.fields[i];
        if(field.ref) {
            columns.push({
                data: field.ref.valueField,
                title: field.label
            });
        } else {
            columns.push({
                data: field.fieldName,
                title: field.label
            });
        }
    }
    columns[0].render = { display: formatLink };
    
    _$scope.headerParams = { 
        filterFields: columns,
        label: tableParams.label
    };
    
    dataTable = dataTableElement.DataTable( {
        columns: columns,
        language: _ModelViewService.datatablesPtBrTranslation,
        processing: true, // show processing message when loading rows
        serverSide: true,
        searching: false,
        dom: 'rtip', // constrols what parts of datatables is visible
        ajax: ajaxFn
    } );
}

function filterChanged(newFilter) {
    filters = newFilter;
    dataTable.draw();
} 

let controller = ['$scope', 'server', 'ModelViewService',
function($scope, server, ModelViewService) { 
    _server = server;
    _ModelViewService = ModelViewService;
    _$scope = $scope;
    
    $scope.$watch('tableParams', tableParamsChanged);
    
    $scope.filterChanged = filterChanged;
}];

app.directive('paginatedTable', function() {
    return {
        restrict: 'E',
        scope: {
            onError: '=onError',
            tableParams: '=tableParams'
        },
        controller: controller,
        templateUrl: 'app/directives/templates/paginated_table.html'
    };
});