'use strict';
angular.module('EditPersonCtrl', ['ngFileUpload', 'flash']).controller('EditPersonController', 
                ['$scope', 'server', '$routeParams', '$location', 'Upload', '$timeout', 'showError', 'Flash',
        function($scope, server, $routeParams, $location, Upload, $timeout, showError, Flash) {
                	
	server.getModelFieldsAndValues( 'Person', id, onValues, showError.show );
	
	function onValues(data) {
        $scope.fields = fields;
        $scope.values = data.values;
	}
	
}]);