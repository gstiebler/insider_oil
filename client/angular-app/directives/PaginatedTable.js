'use strict';

/*****************
This directive is used to show a table with the content paginated, ordered
and filtered in the server
******************/

var _server;
var _ModelViewService;
var _DateService;
var _$scope;
var dataTable;
var filters = [];

var app = angular.module('PaginatedTableDirective', []);

/**
 * Function passed to DataTables to format a row with links
 */
function getFormatLinkFn(column) {
    return function(value, type, row) {
        var linkStr = '<a href="/app/view_record?source=' + row[column.ref.modelField];
        linkStr += '&id=' + row[column.ref.idField];
        linkStr += '">' + value + '</a>'; 
        return linkStr;
    }
}

function formatDate(value) {
    return _DateService.dateFormat(value);
}

/**
 * DataTables callback to refresh the data. It's called when the order column change,
 * and when a page on pagination is clicked
 */
function ajaxFn(data, callback, settings) {
    var orderColumns = [];
    for(var i = 0; i < data.order.length; i++) {
        var columnIndex = data.order[i].column;
        var orderObj = {
            fieldName: data.columns[columnIndex].data,
            dir: data.order[i].dir
        };
        orderColumns.push( orderObj );
    }
    
    var options = {
        queryName: _$scope.tableParams.source,
        queryParams: {
            pagination: {
                first: data.start,
                itemsPerPage: data.length 
            },
            order: orderColumns,
            filters: filters
        }
    };
    
    function setDataTablesRows(serverResult) {
        var result = { 
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
        
    var dataTableElement = $('#mainTable');
    var columns = [];
    for(var i = 0; i < tableParams.fields.length; i++) {
        var field = tableParams.fields[i];
        if(field.ref) {
            columns.push({
                data: field.ref.valueField,
                title: field.label
            });
            columns[i].render = { display: getFormatLinkFn(field) };
        } else {
            columns.push({
                data: field.fieldName,
                title: field.label
            });
        }
        
        if(field.type == 'DATE') {
            columns[i].render = { display: formatDate };
        }
    }
    
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

var controller = ['$scope', 'server', 'ModelViewService', 'DateService',
function($scope, server, ModelViewService, DateService) { 
    _server = server;
    _ModelViewService = ModelViewService;
    _DateService = DateService;
    _$scope = $scope;
    
    $scope.$watch('tableParams', tableParamsChanged);
    
    $scope.filterChanged = filterChanged;

    function filterChanged(newFilter) {
        if(JSON.stringify(newFilter) == JSON.stringify(filters))
            return;
        console.log(filters, newFilter);
        filters = newFilter;
        dataTable.draw();
    } 
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