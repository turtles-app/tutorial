app.controller("factController", ['$scope', '$rootScope', 'data', function($scope, $rootScope, data) {
	this.facts = [];
	this.flashingFacts = [];
	var self = this;

	this.publishFacts = function () {
		$rootScope.$broadcast("publishFacts", {
			facts: self.facts
		});
	}

	$rootScope.$on('publishSet', function (ev, update) {
		var newFacts = [];
		update.set.elements.forEach(function (element) {			
			var proven = new Fact(element.name, true, update.set.equivalents[update.set.eqActiveIndex]);
			newFacts.push(proven);
		});
		$scope.facts.facts = $scope.facts.facts.concat(newFacts);
		data.facts = $scope.facts.facts;
		//publishFacts();
	});

	$rootScope.$on("relevantFacts", function (ev, update) {
		self.flashingFacts = update.facts;
	});

	$rootScope.$on("clearInspector", function (ev, update) {
		self.flashingFacts = [];
	});
}]);