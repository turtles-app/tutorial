app.controller("intersectionController", ["$scope", "$rootScope", "data", function($scope, $rootScope, data) {
	this.set1 = null;
	this.set2 = null;
	this.opacity = 1;
	this.setColors = ["green", "orange", "blue"];
	this.groupNames = ["sets", "intersection", "union"];
	this.tab = data.tab;

	this.dropAllowed = function () {
		if (dragData.type === 'set' && dragData.index >= 0) return true;
	}
	this.dropSet1 = function () {
		if ($scope.intersect.set1) data.sets.push($scope.intersect.set1);
		data.intersectSet1 = data.sets.splice(parseInt(dragData.index), 1)[0];
		$scope.intersect.set1 = data.intersectSet1;
		if($scope.intersect.set2) $scope.intersect.opacity = .5;		
		$scope.$apply();
	}
	this.dropSet2 = function () {
		if ($scope.intersect.set2) data.sets.push($scope.intersect.set2);
		data.intersectSet2 = data.sets.splice(parseInt(dragData.index), 1)[0];
		$scope.intersect.set2 = data.intersectSet2;
		if($scope.intersect.set1) $scope.intersect.opacity = .5;
		$scope.$apply();
	}

	$rootScope.$on("dataUpdate", function(ev, data) {
		$scope.intersect.set1 = data.intersectSet1;
		$scope.intersect.set2 = data.intersectSet2;
		$scope.intersect.tab = data.tab;
	});

	$rootScope.$on("newSet", function(ev, data) {
		$scope.intersect.opacity = 1;
	});
}]);