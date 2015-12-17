angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', 
                                function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/app/', {
			templateUrl: 'app/templates/home.html'
		})

		.when('/app/model_view', {
			templateUrl: 'app/templates/model_view.html',
			controller: 'ModelViewController'
		})

		.when('/app/create_item', {
			templateUrl: 'app/templates/edit_item.html',
			controller: 'CreateItemController'
		})

		.when('/app/edit_item', {
			templateUrl: 'app/templates/edit_item.html',
			controller: 'EditItemController'
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