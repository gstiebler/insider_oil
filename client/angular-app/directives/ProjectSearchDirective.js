'use strict';
var app = angular.module('ProjectSearchDirective', []);

app.directive('projectSearch', function() {
    return {
        restrict: 'E',
        scope: {
            onItemSelected: '=onItemSelected',
            onError: '=onError'
        },
        controller: ['$scope', `server`, function($scope, server) { 

            var searchResult = {};
            $scope.onSearchType = function(value) {
                function onSearchResult(results) {
                    $scope.searchOptions = [];
                    searchResult = {};
                    for(var i = 0; i < results.length; i++) {
                        const completeSearchKey = results[i].modelLabel + ': ' +results[i].name;
                        $scope.searchOptions.push(completeSearchKey);
                        searchResult[completeSearchKey] = results[i];
                    }
                }
                server.getSearchResult(value, onSearchResult, $scope.errorFunc);
            }

            $scope.onSelectItemOnSearchBox = function(value) {
                $scope.onItemSelected(searchResult[value]);
            }
        }],
        template: '<autocomplete data="searchOptions" on-type="onSearchType" on-select="onSelectItemOnSearchBox"></autocomplete>'
    };
});