angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', 
                                function($routeProvider, $locationProvider) {

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

		.when('/app/create_item', {
			templateUrl: 'app/templates/create_item.html',
			controller: 'CreateItemController'
		})

		.when('/app/drilling_rigs', {
			templateUrl: 'app/templates/drilling_rigs.html',
			controller: 'DrillingRigsController'	
		})

		.when('/app/map', {
			templateUrl: 'app/templates/map.html',
			controller: 'MapController'	
		})

		.when('/app/chart', {
			templateUrl: 'app/templates/chart.html',
			controller: 'ChartController'	
		});

	$locationProvider.html5Mode(true);

}]);