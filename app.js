var app = angular.module("homepage", ['toastr']);

var dragData = {
	id: '',
	index: null
};

openToasts = [];

app.config(function(toastrConfig) {
	angular.extend(toastrConfig, {
		timeOut: 0,
		extendedTimeOut: 0,
		closeButton: true
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

app.directive('droppableSets', function() {
	return {
		scope: {
			drop: '&',
			dragover: '&'
		},
		link: function (scope, element) {
			var el = element[0];

			el.addEventListener(
				'dragover', 
				function(e){
					var id = el.getAttribute('id');
					var fn = scope.dragover();
					var steps = fn();
					switch (steps) {
						case 1:
							if(dragData.id === 'bob') e.preventDefault();
							break;
					}
					// if (dragData.id === 'bob' && steps === 1) e.preventDefault();
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
});

app.directive("droppableContents", function() {
	return {
		scope: {
			drop: '&',
			dragover: '&'
		},
		link: function (scope, element) {
			var el = element[0];

			el.addEventListener("dragover", 
				function (e) {
					id = el.getAttribute('id');
					var fn = scope.dragover();
					var steps = fn();
					switch (steps) {
						case 2:
							if (dragData.id === 'Bob') e.preventDefault();
							break;
					}
					return false;
				},
				false
				);

			el.addEventListener("drop", function (e) {
				id = el.getAttribute('id');
				var fn = scope.drop();
				var index = dragData.index;
				if ('undefined' !== typeof fn) {
					fn(index);
					dragData = {
						id: '',
						index: null
					}
				}
				return false;
			},
			false
			);
		}
	}
});

app.controller("tutorialController", function($scope, toastr) {
	this.completeSteps = 0;
	this.tab = 'bob';
	this.sets = [];
	this.elements = [];
	this.selectedElements = [];
	this.contentsSet = null;
	this.elFlash = true;
	this.bobFlash = false;
	this.setsFlash = false;
	this.contentsFlash = false;
	this.showContents = false;
	this.flashSetIndex = null;
	// this.elStyle = "{'-webkit-animation': 'fading 4s infinite', 'animation': 'fading 4s infinite'}";


	var a = new Set("sets", "A");
	var x = new Element("x", a);

	this.elements.push(x);


	$scope.dropIntoBob = function (id) {
		$scope.tut.completeSteps = 1;
		$scope.tut.selectedElements.push($scope.tut.elements.splice(0, 1)[0]);
		$scope.tut.bobFlash = false;
		toastr.clear(openToasts.pop());;
		openToasts.push(toastr.success('Every element is in some sets, and not in others.', "Nice!", {
			onHidden: function(clicked) {
				openToasts.pop();
				if ($scope.tut.completeSteps === 1) {
					openToasts.push(toastr.info('Now conjur Bob into existence, by dragging him to the set area', 
						{
							extendedTimeOut: 8000,
							// tapToDismiss: false
						}));
					$scope.tut.bobFlash = true;
				}
			}
		}));
	};

	$scope.dropIntoSets = function (id) {
		switch ($scope.tut.completeSteps) {
			//Dragging bob into sets
			case 1:
				if (dragData.id === 'bob') {
					$scope.tut.completeSteps = 2;
					var caughtToast = openToasts.pop();
					toastr.clear(caughtToast);
					if (caughtToast.toastId < 2) toastr.clear(openToasts.pop());
					openToasts.push(toastr.success("Now Bob exists, and he has x inside him. He is forever grateful.", "Congratulations!", {
						onHidden: function(clicked) {
							openToasts.pop();
							if ($scope.tut.completeSteps === 2) {
								var y = new Element("y", a);
								$scope.tut.elements.push(y);
								$scope.tut.flashSetIndex = 0;
								openToasts.push(toastr.info("Another element has appeared! It's name is y. y is not in Bob.", "New Element", 
								{
									onHidden: function(clicked) {
										openToasts.pop();
										openToasts.push(toastr.info("Now drag Bob into the Set Contents window to see what's inside him!", "Set Contents Appeared!",
										{
											extendedTimeOut: 8000
										}
										)); //End of toast
										$scope.tut.showContents = true;
									}
								}));
							}
						}
					}));
					var bob = new Set("sets", "Bob");
					bob.putIn(x);
					$scope.tut.sets.push(bob);
					$scope.tut.tab = '';
					$scope.tut.elements.push($scope.tut.selectedElements.splice(0, 1)[0]);
				}
				break;
		}
	}

	$scope.dropIntoContents = function (index) {
		// console.log(index);
		$scope.tut.contentsSet = $scope.tut.sets[index];
		switch ($scope.tut.completeSteps) {
			case 2:
				$scope.tut.completeSteps = 3;
				toastr.clear(openToasts.pop());
				break;
		}
		$scope.$apply();
	};

	$scope.dragOverSets = function () {
		return $scope.tut.completeSteps;
	};

	$scope.dragOverContents = function () {
		return $scope.tut.completeSteps;
	}

	///////////////////////////
	// 	Drag Event Handlers  //
	///////////////////////////
	this.dragEl = function (ev) {
		if ($scope.tut.tab === 'bob' && ev.target.getAttribute('id') === 'x') {
			switch ($scope.tut.completeSteps) {
				case 0:
					this.bobFlash = true;
					this.elFlash = false;
					dragData.id = ev.target.getAttribute('id');
					dragData.index = ev.target.getAttribute('index');
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
	};

	this.dragBob = function (ev) {
		dragData.id = ev.target.id;
		dragData.index = null;
		if ($scope.tut.completeSteps === 1) {
			$scope.tut.bobFlash = false;
			$scope.tut.setsFlash = true;
			$scope.$apply();
		}
		
	};

	this.endDragBob = function (ev) {
		$scope.tut.setsFlash = false;
		if ($scope.tut.completeSteps === 1) {
			$scope.tut.bobFlash = true;
		}
		$scope.$apply();
	};

	this.dragSet = function (ev) {
		dragData.id = ev.target.id;
		dragData.index = ev.target.getAttribute('index');
		switch ($scope.tut.completeSteps) {
			case 2:
				$scope.tut.flashSetIndex = null;
				$scope.tut.contentsFlash = true;
				break;
		}
		$scope.$apply();
	};

	this.endDragSet = function (ev) {
		dragData.id = null;
		dragData.index = null;
		$scope.tut.contentsFlash = false;
		switch ($scope.tut.completeSteps) {
			case 2:
				$scope.tut.flashSetIndex = 0;	
				break;
		}
		$scope.$apply();
	};

	openToasts.push(toastr.info('Drag x into Bob', 'Welcome =)'));
});