angular.module('MainCtrl', []).controller('MainController', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {

	$scope.tagline = 'To the moon and back!';

    console.log( "token: "  + $location.search().token );

} ] );