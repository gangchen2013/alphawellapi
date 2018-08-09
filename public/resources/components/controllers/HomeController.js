app.controller('HomeController', ['$scope', 'UserInfoService', 'CONFIG', function($scope, UserInfoService, CONFIG) {

	console.log("Entering Home Controller")

	$scope.loggedIn = UserInfoService.state.authenticated

}]);
