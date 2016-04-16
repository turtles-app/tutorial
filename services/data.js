app.factory("data", ['$rootScope', function($rootScope) {
	var self = this;
	this.completeSteps = 0;
	this.sets = [];
	this.facts = [];
	this.tab = 'bob';
	// this.elements = [];
	// this.selectedElements = [];
	// this.contentsSet = null;
	// this.elFlash = true;
	// this.bobFlash = false;
	// this.setsFlash = false;
	// this.contentsFlash = false;
	// this.showContents = false;
	// this.flashSetIndex = null;
	this.colors = ['#970000','#E6943B','#CCC508','#C0009C','#EE2998','#27E493'];
	// this.customSetName = '';


	var a = new Set("sets", "A");
	var x = new Element("x", a, self.colors[0]);
	var y = new Element("y", a, self.colors[1]);
	var z = new Element("z", a, self.colors[2]);
	var p = new Element("p", a, self.colors[3]);
	var q = new Element("q", a, self.colors[4]);
	var jeffersmith = new Element("jeffersmith", a, self.colors[5]);

	x.groupIndex = 0;
	y.groupIndex = 1;
	z.groupIndex = 2;
	p.groupIndex = 3;
	q.groupIndex = 4;
	jeffersmith.groupIndex = 5;

	// this.elements.push(x);

	this.updateScopes = function () {
		$rootScope.$broadcast("dataUpdate", 
			{
				steps: self.completeSteps,
				sets: self.sets,
				elements: self.elements,
				intersectSet1: self.intersectSet1,
				intersectSet2: self.intersectSet2,
				tab: self.tab
			}
			);
	};

	this.publishSet = function (set) {
		$rootScope.$broadcast("publishSet", {set: set});
	}

	this.relevantFacts = function (set) {
		var facts = [];
		set.elements.forEach(function (element) {
			self.facts.forEach(function (fact) {
				var relevant = fact.elementName === element.name && fact.setSyntax === set.equivalents[set.eqActiveIndex]; 
				if (relevant) facts.push(fact);
			});
		});
		$rootScope.$broadcast("relevantFacts", {
			facts: facts
		});
		return facts;
	}
	return this;	
}]);