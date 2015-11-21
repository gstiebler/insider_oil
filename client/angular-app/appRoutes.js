angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/app/', {
			templateUrl: 'app/templates/home.html',
			controller: 'MainController'
		})

		.when('/app/model_view', {
			templateUrl: 'app/templates/model_view.html',
			controller: 'ModelViewController'
		})

		.when('/app/drilling_rigs', {
			templateUrl: 'app/templates/drilling_rigs.html',
			controller: 'DrillingRigsController'	
		});

	$locationProvider.html5Mode(true);

}]);