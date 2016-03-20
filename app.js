var app = angular.module("homepage", ['toastr']);

var dragData = {
	id: '',
	index: null,
	type: ''
};

openToasts = [];

//Comparison function used to sort a group of sets/elements
var sortGroup = function (a, b) {
	return a.groupIndex - b.groupIndex;
};

app.config(function(toastrConfig) {
	angular.extend(toastrConfig, {
		timeOut: 15000,
		extendedTimeOut: 10000,
		closeButton: true,
		progressBar: true
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
						default:
							if (dragData.type === 'custom') e.preventDefault();
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
						default:
							if (dragData.type === 'set') e.preventDefault();
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
						index: null,
						type: ''
					}
				}
				return false;
			},
			false
			);
		}
	}
});

app.directive("droppableCustom", function() {
	return {
		scope: {
			drop: '&',
		},
		link: function (scope, element) {
			var el = element[0];

			el.addEventListener("dragover", 
				function (e) {
					if (dragData.type === "element") {
						if (dragData.type === 'element') e.preventDefault();
					}

					return false;
				},
				false
				); //dragover listener

			el.addEventListener("drop", 
				function (e) {
					var fn = scope.drop();
					var index = dragData.index;
					if ('undefined' !== typeof fn) {
						fn(index);
						dragData = {
							id: '',
							index: null,
							type: ''
						}
					}

				},

				false
				); //drop listener
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
	this.colors = ['#970000','#E6943B','#CCC508','#C0009C','#EE2998','#27E493'];
	this.customSetName = '';

	// this.elStyle = "{'-webkit-animation': 'fading 4s infinite', 'animation': 'fading 4s infinite'}";


	var a = new Set("sets", "A");
	var x = new Element("x", a, $scope.tut.colors[0]);
	var y = new Element("y", a, $scope.tut.colors[1]);
	var z = new Element("z", a, $scope.tut.colors[2]);
	var p = new Element("p", a, $scope.tut.colors[3]);
	var q = new Element("q", a, $scope.tut.colors[4]);
	var jeffersmith = new Element("jeffersmith", a, $scope.tut.colors[5]);

	x.groupIndex = 0;
	y.groupIndex = 1;
	z.groupIndex = 2;
	p.groupIndex = 3;
	q.groupIndex = 4;
	jeffersmith.groupIndex = 5;

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
								
								
								$scope.tut.elements.push(y);
								$scope.tut.flashSetIndex = 0;
								openToasts.push(toastr.info("Another element has appeared! It's name is y. y is not in Bob.", "New Element", 
								{
									onHidden: function(clicked) {
										openToasts.pop();
										openToasts.push(toastr.info("Now drag Bob into the Set Inspector window to see what's inside him!", "Set Inspector Appeared!",
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
					bob.groupIndex = 0;
					$scope.tut.sets.push(bob);
					$scope.tut.tab = '';
					$scope.tut.elements.push($scope.tut.selectedElements.splice(0, 1)[0]);
				}
				break;
			case 5:
				toastr.clear(openToasts.pop());
				if ($scope.tut.selectedElements.length > 0) {
					if ($scope.tut.customSetName != '') {
						var newSet = new Set("sets", $scope.tut.customSetName);
						$scope.tut.selectedElements.forEach(function (element) {
							newSet.putIn(element);
						});
						newSet.groupIndex = $scope.tut.sets.length;
						$scope.tut.sets.push(newSet);
						$scope.tut.elements = $scope.tut.elements.concat($scope.tut.selectedElements.splice(0, $scope.tut.selectedElements.length));
						$scope.tut.elements.sort(sortGroup);
						$scope.tut.customSetName = '';
					} else {
						toastr.clear(openToasts.pop());
						openToasts.push(toastr.warning("You must name your set first. Type a name in the text box.", "Nice Try"));
					}
				} else {
					toastr.clear(openToasts.pop());
					openToasts.push(toastr.warning("Empty sets are funky. We'll deal with them later. Drag elements into your set first", "Nice Try"));
				} 				
				if ($scope.tut.sets.length === 5) {
					openToasts.forEach(function (toast) {
						toastr.clear(toast);
					});
					openToasts = []; 
					// toastr.clear(openToasts.pop());
					$scope.tut.completeSteps = 6;
					openToasts.push(toastr.success("We now have 5 sets.", "Well Done!", {
						onHidden: function () {
							toastr.clear(openToasts.pop());
							openToasts.push(toastr.info("You can make new sets by combining old ones. There are many different ways to combine sets", "Operations", 
							{
								onHidden: function () {
									toastr.clear(openToasts.pop());
									$scope.tut.tab = 'intersection';
									openToasts.push(toastr.info("This is the first way making a new set from two old ones. Drag two sets into the two slots, then drag the whole intersection into the Set area", "Intersection", 
										{
											onHidden: function () {
												toastr.clear(openToasts.pop());
											}
										}));
								}
							}));

						}
					}));
				} else {
					var step5Progress =  $scope.tut.sets.length - 2;
					var str = step5Progress + "/3 Sets created";
					toastr.clear(openToasts.pop());
					openToasts.push(toastr.info(str, "Step 5 progress", 
					{
						onHidden: function () {
							openToasts.pop();
						}
					}));
				}
				break;
			default:
				if ($scope.tut.selectedElements.length > 0) {
					if ($scope.tut.customSetName != '') {
						var newSet = new Set("sets", $scope.tut.customSetName);
						$scope.tut.selectedElements.forEach(function (element) {
							newSet.putIn(element);
						});
						newSet.groupIndex = $scope.tut.sets.length;
						$scope.tut.sets.push(newSet);
						$scope.tut.elements = $scope.tut.elements.concat($scope.tut.selectedElements.splice(0, $scope.tut.selectedElements.length));
						$scope.tut.elements.sort(sortGroup);
						$scope.tut.customSetName = '';

						switch ($scope.tut.sets.length) {
							case 2:
								$scope.tut.completeSteps = 4;
								toastr.clear(openToasts.pop());
								openToasts.push(toastr.success("You made a new set called " + newSet.equivalents[0] + "! Drag it into the Set Inspector"));
								break;

							break;

						}
					} else {
						toastr.clear(openToasts.pop());
						openToasts.push(toastr.warning("You must name your set first. Type a name in the text box.", "Nice Try"));
					}
				} else {
					toastr.clear(openToasts.pop());
					openToasts.push(toastr.warning("Empty sets are funky. We'll deal with them later. Drag elements into your set first", "Nice Try"));
				} 
				break;
		}
	}

	$scope.dropIntoContents = function (index) {
		$scope.tut.contentsSet = $scope.tut.sets[index];
		// $scope.tut.elements.forEach(function(element) {
		// 	var opacity = element.opacity;
		// 	var border = element.border;
		// 	if ($scope.tut.contentsSet.elements.indexOf(element) > -1) {
		// 		opacity = ".65";
		// 		border = "3px dotted green";
		// 	}
		// 	else {
		// 		opacity = ".25";
		// 		border = "3px dashed blue";
		// 	}
		// 	element.opacity = opacity;
		// 	element.border = border;

		// });
	$scope.tut.setElementStyles();
		switch ($scope.tut.completeSteps) {
			case 2:
				$scope.tut.completeSteps = 3;
				toastr.clear(openToasts.pop());
				openToasts.push(toastr.info("The Set Inspector shows which elements are in a set", {
					onHidden: function () {
						toastr.clear(openToasts.pop());
						openToasts.push(toastr.info("Name it, choose elements, and drag it to the set area", "Make your own set"));
						$scope.tut.tab = 'customSet';
						$scope.tut.contentsSet = null;
						$scope.tut.clearElementStyles();
					}
				}));
				break;
			case 4:
				if ($scope.tut.sets.length === 2) {
					toastr.clear(openToasts.pop());
					openToasts.push(toastr.success("Three more elements have appeared. Create three more sets", "Good!", {
						onHidden: function() {
							openToasts.pop();
							$scope.tut.contentsSet = null;
							$scope.tut.clearElementStyles();
						}
					}));
					$scope.tut.completeSteps = 5;
					$scope.tut.elements.push(z, p, q, jeffersmith);
					$scope.tut.setElementStyles();
				} 
				break;
		}
		$scope.$apply();
	};

	$scope.dropIntoCustom = function (index) {
		$scope.tut.selectedElements.push($scope.tut.elements.splice(index, 1)[0]);
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
		dragData.id = ev.target.getAttribute('id');
		dragData.index = ev.target.getAttribute('index');
		dragData.type = "element";
			switch ($scope.tut.completeSteps) {
				case 0:
					if ($scope.tut.tab === 'bob' && ev.target.getAttribute('id') === 'x') {
						this.bobFlash = true;
						this.elFlash = false;
					}
					break;
			}
			$scope.$apply();
	};

	this.endDragEl = function (ev) {
		if ($scope.tut.completeSteps === 0) {
			$scope.tut.elFlash = true;
			$scope.tut.bobFlash = false;
			dragData.id = '';
			dragData.index = null;
			dragData.type = '';
			$scope.$apply();
		}
	};

	this.dragBob = function (ev) {
		dragData.id = ev.target.id;
		dragData.index = null;
		dragData.type = "custom";
		if ($scope.tut.completeSteps === 1) {
			$scope.tut.bobFlash = false;
			$scope.tut.setsFlash = true;
			$scope.$apply();
		}
		
	};

	this.endDragBob = function (ev) {
		$scope.tut.setsFlash = false;
		dragData.id = '';
		dragData.index = null;
		dragData.type = '';		
		if ($scope.tut.completeSteps === 1) {
			$scope.tut.bobFlash = true;
		}
		$scope.$apply();
	};

	this.dragSet = function (ev) {
		dragData.id = ev.target.id;
		dragData.index = ev.target.getAttribute('index');
		dragData.type = "set"
		switch ($scope.tut.completeSteps) {
			case 2:
				$scope.tut.flashSetIndex = null;
				$scope.tut.contentsFlash = true;
				break;
		}
		$scope.$apply();
	};

	this.endDragSet = function (ev) {
		dragData.id = '';
		dragData.index = null;
		dragData.type = '';
		$scope.tut.contentsFlash = false;
		switch ($scope.tut.completeSteps) {
			case 2:
				$scope.tut.flashSetIndex = 0;	
				break;
		}
		$scope.$apply();
	};

	this.dragCustom = function (ev) {
		dragData.id = ev.target.id;
		dragData.index = null;
		dragData.type = 'custom';
		switch ($scope.tut.completeSteps) {
			case 3:
				$scope.tut.setsFlash = true;
				$scope.$apply();
				// $scope.tut.customFlash = false;
				break;
		}
	};

	this.endDragCustom = function (ev) {
		dragData.id = '';
		dragData.index = null;
		dragData.type = '';
		$scope.tut.setsFlash = false;
	};

	this.setElementStyles = function() {

	  $scope.tut.elements.forEach(function (element) {
			if ($scope.tut.contentsSet.elements.indexOf(element) >= 0) {
				element.opacity = .65;
				element.border = "3px dashed #7689A9";
			} else {
				element.opacity = .25;
				element.border = "3px dashed #FF0303";
			}
		});
	  $scope.$apply();

	};

	this.clearElementStyles = function () {
		$scope.tut.elements.forEach(function (element) {
			element.opacity = 1;
			element.border = "3px solid black";
		});
		// $scope.$apply();
	};

	openToasts.push(toastr.info('Drag x into Bob', 'Welcome =)'));
});