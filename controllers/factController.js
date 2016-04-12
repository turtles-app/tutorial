app.controller("factController", ['$scope', '$rootScope', 'data', function($scope, $rootScope, data) {
	this.facts = [];

	$rootScope.$on('publishSet', function(ev, data) {
		var newFacts = [];
		data.set.elements.forEach(function (element) {			
			var proven = new Fact(element.name, true, data.set.equivalents[data.set.eqActiveIndex]);
			newFacts.push(proven);
		});
		$scope.facts.facts = $scope.facts.facts.concat(newFacts);
	});
}]);