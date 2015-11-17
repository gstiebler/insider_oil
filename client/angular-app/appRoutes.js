angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'app/templates/home.html',
			controller: 'MainController'
		})

		.when('/wells', {
			templateUrl: 'app/templates/wells.html',
			controller: 'WellsController'
		})

		.when('/drilling_rigs', {
			templateUrl: 'app/templates/drilling_rigs.html',
			controller: 'DrillingRigsController'	
		});

	$locationProvider.html5Mode(true);

}]);