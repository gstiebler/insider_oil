'use strict';
angular.module('InsiderOilApp').controller('ChangePasswordController', 
                ['$scope', '$location', 'server', 'showError', 'Flash',
        function($scope, $location, server, showError, Flash) {
                	
    $scope.changePassword = function() {
    	if($scope.newPassword1 != $scope.newPassword2) {
    	    Flash.create('warning', 'As novas senhas diferem.');
    	    return;
    	}
    	
    	server.changePassword(onData, showError.show, $scope.currentPassword, $scope.newPassword1);
    	
    	function onData(result) {
    		if(result.msg == 'OK') {
                Flash.create('success', 'A senha foi modificada com sucesso.' );
                $scope.currentPassword = "";
                $scope.newPassword1 = "";
                $scope.newPassword2 = "";
    		} else if (result.errorMsg) {
        	    Flash.create('danger', result.errorMsg);
    		}
    	}
    }
	
}]);
                	