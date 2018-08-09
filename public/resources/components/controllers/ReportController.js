app.controller('ReportController', ['$scope','BlueAPIService','UserInfoService',function($scope, BlueAPIService, UserInfoService) {

	console.log("Entering Report Controller")
	$scope.baseURL = "images/items/"
	$scope.loggedIn = UserInfoService.state.authenticated

	BlueAPIService.getReport(function (response) {
			console.log("Get Reports Result" + response)
			$scope.itemList = response.data

		}, function (error){
			console.log("Get Inventory Error: " + error);
	});

}]);
