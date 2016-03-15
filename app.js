var app = angular.module("homepage", ['toastr']);

var dragData = {
	id: '',
	index: null
};

app.config(function(toastrConfig) {
	angular.extend(toastrConfig, {
		timeOut: 0
	});
});
app.directive('droppableBob', function() {
	return {
		scope: {
			drop: '&'
		},
		link: function (scope, element) {
			var el = element[0];

			el.addEventListener(
				'dragover', 
				function(e){
					console.log("dragover");
					if (dragData.id === 'x') {
						e.preventDefault();
					}
					return false;
				},
				false
			);

			el.addEventListener(
				'drop', function(e) {
					scope.$apply(function(scope) {
						var fn = scope.drop();
						var id = e.target.id;
						if('undefined' !== typeof fn) {
							fn(id);
						}
						dragData = {
							id: '',
							index: null
						};
					});
					return false;
				},
				false
			);
		}	//link
	}	//return
});	//droppable directive

app.controller("tutorialController", function($scope, toastr) {
	this.completeSteps = 0;
	this.tab = 'bob';
	this.sets = [];
	this.elements = [];
	this.selectedElements = [];
	this.elFlash = true;
	this.bobFlash = false;
	// this.elStyle = "{'-webkit-animation': 'fading 4s infinite', 'animation': 'fading 4s infinite'}";


	var a = new Set("sets", "A");
	var x = new Element("x", a);

	this.elements.push(x);


	$scope.dropIntoBob = function (id) {
		$scope.tut.completeSteps = 1;
		$scope.tut.selectedElements.push($scope.tut.elements.splice(0, 1)[0]);
		$scope.tut.bobFlash = false;
		toastr.success('Every element is in some sets, and not in others.', "Nice!", {
			onHidden: function(clicked) {
				toastr.info('Now conjur Bob into existence, by dragging him to the set area');
			}
		});
	};


	this.dragEl = function (ev) {
		if ($scope.tut.tab === 'bob' && ev.target.getAttribute('id') === 'x') {
			console.log("Dragging x while displaying Bob");
			switch ($scope.tut.completeSteps) {
				case 0:
					this.bobFlash = true;
					this.elFlash = false;
					dragData.id = ev.target.getAttribute('id');
					dragData.index = ev.target.getAttribute('index');
					console.log(dragData);
					break;
			}
			$scope.$apply();
		}
	};

	this.endDragEl = function (ev) {
		if ($scope.tut.completeSteps === 0) {
			$scope.tut.elFlash = true;
			$scope.tut.bobFlash = false;
			$scope.$apply();
		}
	}

	toastr.info('Drag x into Bob', 'Welcome =)');
});