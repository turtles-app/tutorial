var app = angular.module("homepage", ['toastr']);


app.controller("tutorialController", function($scope, toastr) {
	this.tab = 'bob';
	this.sets = [];
	this.elements = [];
	this.elStyle = "{'-webkit-animation': 'fading 4s infinite', 'animation': 'fading 4s infinite'}";


	var a = new Set("sets", "A");
	var x = new Element("x", a);

	this.elements.push(x);

	this.dragEl = function (ev) {
		if ($scope.tut.tab === 'bob' && ev.target.getAttribute('id') === 'x') {
			console.log("Dragging x while displaying Bob");
			$scope.tut.elStyle = "{'-webkit-animation': 'fading 0s', 'animation': 'fading 0s'}";
			$scope.$apply();
		}
	};

	toastr.success('Drag x into Bob', 'Welcome =)');
});