 var app = angular.module('InsiderOilApp');

app.service('showError', ['Flash', 
               function(Flash) {
    
    this.show = function(err) {
        var errorStr = err.data.errorMsg;
        console.log(err.data.errors);
        if(err.data.errors) {
            for( var i = 0; i < err.data.errors.length; i++ )
                errorStr += '<br>' + err.data.errors[i].message;
            console.log(errorStr);
        }
        Flash.create('danger', errorStr);
    }

}]);