app.controller("factController", ['$scope', '$rootScope', 'toastr', 'data', function($scope, $rootScope, toastr, data) {
	this.facts = data.facts;
	this.flashingFacts = [];
	this.flash = false;
	var self = this;

	this.publishFacts = function () {
		$rootScope.$broadcast("publishFacts", {
			facts: self.facts
		});
	};

	this.dropAllowed = function () {
		switch (dragData.type) {
			case 'factMaker':
				return true;
				break;
			default:
				return false;
				break;
		}
	};

	this.drop = function () {
		var valid = contains(data.factInfo.element.name, data.factInfo.set.equivalents[data.factInfo.set.eqActiveIndex], data.factInfo.justifications);
		if (valid) {
			var newFact = new Fact(data.factInfo.element.name, true, data.factInfo.set.equivalents[data.factInfo.set.eqActiveIndex]);
			data.facts = data.facts.concat(data.factInfo.justifications);
			newFact.groupIndex = data.facts.length;
			data.facts.push(newFact);
			data.facts.sort(sortGroup);
			data.sets.push(data.newGuy);
			data.sets.sort(sortGroup);
			data.elements.push(data.firstEl);
			data.elements.sort(sortGroup);
			self.flash = false;
			self.flashingFacts = [];
			data.updateScopes();
			$scope.$apply();

			switch (data.completeSteps) {
				case 8:
					$rootScope.$broadcast("firstCustomFact");
					console.log($scope.tut);
					data.completeSteps = 9;
					data.tab = '';
					data.updateScopes();
					toastr.clear(openToasts.pop());
					// $scope.$apply();
					var txt = "Your new FACT says that " + newFact.str + ". The inspector can use this to show you what's inside of " + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex];
					openToasts.push(toastr.success(txt, "A FACT of your own", 
						{
							onHidden: function () {
								openToasts.pop();
								openToasts.push(toastr.info("Drag " + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex] + " into the SET inspector",
									{
										onHidden: function() {
											openToasts.pop();
										}
									}
								));
							}
						}
					));
					break;
			}
		}
	};

	$rootScope.$on('removeFacts',function (ev, update) {
		update.facts.forEach(function (fact) {
			data.facts.splice(data.facts.indexOf(fact, 1));
			data.updateScopes();
			if (self.flashingFacts.indexOf(fact) >= 0)  {
				self.flashingFacts.splice(self.flashingFacts.indexOf(fact), 1); 
			};
		});
	});

	$rootScope.$on('publishSet', function (ev, update) {
		var newFacts = [];
		update.set.elements.forEach(function (element) {			
			var proven = new Fact(element.name, true, update.set.equivalents[update.set.eqActiveIndex]);
			newFacts.push(proven);
		});
		data.facts = data.facts.concat(newFacts);
		// $scope.$apply();
		data.updateScopes();
		// $scope.facts.facts = $scope.facts.facts.concat(newFacts);
		// data.facts = $scope.facts.facts;
		//publishFacts();
	});

	$rootScope.$on("relevantFacts", function (ev, update) {
		self.flashingFacts = update.facts;
	});

	$rootScope.$on("clearInspector", function (ev, update) {
		self.flashingFacts = [];
	});

	$rootScope.$on("toggleFlashFacts", function (ev) {
		self.flash = !self.flash;
		$scope.$apply();
	});

	$rootScope.$on("dataUpdate", function (ev, update) {
		self.facts = update.facts;
	});
}]);