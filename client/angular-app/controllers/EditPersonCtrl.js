'use strict';
angular.module('InsiderOilApp').controller('EditPersonController', 
                ['$scope', 'server', '$routeParams', '$location', 'Upload', '$timeout', 'showError', 'Flash',
        function($scope, server, $routeParams, $location, Upload, $timeout, showError, Flash) {
                	
	const contentType = 'image/JPEG';
	const base64Header = 'data:' + contentType + ';base64,';
    const id = $routeParams.id;
	
	const customFields = {
	    photo: true
	};
	
	server.getModelFieldsAndValues( 'Person', id, onValues, showError.show );
	
	function onValues(data) {
		// TODO refactor to centralize this code and call from EditItem
        const fields = data.fields;
        const processedFields = [];
        for( var i = 0; i < fields.length; i++ ) {
            const field = fields[i];
            if(customFields[field.name])
            	continue;
            field.htmlId = getHtmlId(field);
            field.hasRef = field.type == 'ref';
            field.isDate = field.type == 'DATE';
            if( field.hasRef ) {
            	const value = data.values[field.name];
            	if(value) {
                    data.values[field.name] = data.values[field.name].toString();
                    
                    server.getComboValues( field.model, function (values) {
                        field.values = values;
                    }, showError.show );
            	}
            }
            if(field.isDate) {
                const dateStr = data.values[field.name];
                const date = new Date(dateStr);
                date.setTime( date.getTime() + date.getTimezoneOffset()*60*1000 ); // correction for timezone
                data.values[field.name] = date;
            }
            processedFields.push(field);
        }
    
        $scope.telephones = data.values.telephones;
        $scope.fields = processedFields;
        $scope.values = data.values;
        if(data.values['photo'] && data.values['photo'].data) {
        	$scope.photo = base64Header + _arrayBufferToBase64( data.values['photo'].data );
        }
	}
    
	
    function getHtmlId(field) {
        return "html_id_" + field.name;
    }
    
    
    function _arrayBufferToBase64( buffer ) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    }
    
    
    function base64ToArray( base64 ) {
    	const base64str = atob(base64);
        const bytes = new Array( base64str.length );
        for(var i = 0; i < base64str.length; i++) {
        	bytes[i] = base64str.charCodeAt(i);
        }
        return bytes;
    }
    
    
    $scope.saveItem = function() {
        var itemData = {};
        for( var i = 0; i < $scope.fields.length; i++ )  {
            var field = $scope.fields[i];
            itemData[field.name] = $scope.values[field.name];
        }
        itemData.id = id;  
        itemData.telephones = $scope.telephones;
        const photoStr = $scope.photo;
        if(photoStr != null) {
            const base64Data = photoStr.substring(photoStr.search(';base64,') + 8, photoStr.length);
            itemData.photo = base64ToArray(base64Data);
        }
        server.saveItem( 'Person', itemData, onSave, showError.show );
    }
    
    
    function onSave(status) {
        Flash.create('success', status.data.msg);
        $location.path("/app/model_view").search({ model: 'Person' });
    }
    
    
    $scope.loadPhoto = function($fileContent){
    	$scope.photo = $fileContent;
    };
	
}]);