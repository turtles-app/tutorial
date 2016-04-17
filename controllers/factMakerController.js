app.controller("factMakerController", ['$scope', '$rootScope', 'toastr', 'data', function ($scope, $rootScope, toastr, data) {
	var self = this;
	this.element = null;
	this.set = null;
	this.justifications = [];
	this.dropAllowed = function () {
		switch (dragData.type) {
			case 'element':
			case 'set':
			case 'fact':
				return true;
				break;

		}
		return true;
	};

	this.drop = function () {
		switch (dragData.type) {
			case "element":
			case "set":
				var key = dragData.type;
				var pluralKey = dragData.type + "s";
				if (self[key]) {
					data[pluralKey].push(self[dragData.type]);
				}
				self[key] = data[pluralKey].splice(dragData.index, 1)[0];
				data[pluralKey].sort(sortGroup);
				data.updateScopes();
				$scope.$apply();

				switch (dragData.type) {
					case "element":
						var txt	= "We want to say that " + data.firstEl.name + " is in " + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex] + ". Drag ";
						switch (data.completeSteps) {
							case 8:
								if (self.element.name === data.firstEl.name) {
									if (!self.set) {
										toastr.clear(openToasts.pop());
										openToasts.push(toastr.success(txt + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex] + " into the FACT maker.", "Well Done",
											{
												onHidden: function () {
													openToasts.pop();
												}
											}
										));
									} else { //fact-set HAS been set 	
										if (_.isEqual(self.set, data.newGuy) ) { //fact-set has been correctly set
											toastr.clear(openToasts.pop());
											openToasts.push(toastr.success("Our FACT maker now says that " + data.firstEl.name + " is in " + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex] + ". Now you must select your justifications.", "Excelent!", 
												{
													onHidden: function () {
														openToasts.pop();
														var fact1 = data.findFact(self.element, true, data.left, data.facts);
														var fact2 = data.findFact(self.element, true, data.right, data.facts);
														console.log([fact1, fact2]);
														$rootScope.$broadcast("relevantFacts", {
															facts: [fact1, fact2]
														});														
														openToasts.push(toastr.info("These facts let you make your new one. Drag them into the FACT maker", "Justifications", 
															{
																onHidden: function () {
																	openToasts.pop();
																}		
															}
														));
													}
												}
											)); 
										} else { //fact-set has been IMPROPERLY set
											toastr.clear(openToasts.pop());
											openToasts.push(toastr.success(txt + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex] + " into the FACT maker.", "Well Done",
												{
													onHidden: function () {
														openToasts.pop();
													}
												}
											));											
										}
									} 
								} else { //Wrong fact-element 
										txt = "We want to say that " + data.firstEl.name + " is in " + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex] +". Drag " + data.firstEl.name + " into the FACT maker";
										openToasts.push(toastr.warning(txt, "Good try", 
											{
												onHidden: function () {
													openToasts.pop();
												}
											}
										));									
								}
							break; // completeSteps 8 case
						}
						break; // 'element' case

						case 'set':
							var txt	= "We want to say that " + data.firstEl.name + " is in " + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex];
							switch (data.completeSteps) {
								case 8:
									if (self.element) {
										if (_.isEqual(self.set, data.newGuy)) {

											if (_.isEqual(self.element, data.firstEl) ) {
												toastr.clear(openToasts.pop());
												openToasts.push(toastr.success("Our FACT maker now says that " + data.firstEl.name + " is in " + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex] + ". Now you must select your justifications.", "Excelent!", 
													{
														onHidden: function () {
															openToasts.pop();
															var fact1 = data.findFact(self.element, true, data.left, data.facts);
															var fact2 = data.findFact(self.element, true, data.right, data.facts);
															$rootScope.$broadcast("relevantFacts", {
																facts: [fact1, fact2]
															});														
															openToasts.push(toastr.info("These facts let you make your new one. Drag them into the FACT maker", "Justifications", 
																{
																	onHidden: function () {
																		openToasts.pop();
																	}		
																}
															));
														}
													}
												)); 											
											} else { //Right set, wrong element
												toastr.clear(openToasts.pop());
												openToasts.push(toastr.success(txt + ". Drag " + data.firstEl.name + " into the FACT maker", "Nice", 
													{
														onHidden: function () {
															openToasts.pop();
														}
													}
												))
											}

										} else { // fact-set has been IMPROPERLY set
											toastr.clear(openToasts.pop());
											openToasts.push(toastr.warning(txt + ". Drag " + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex] + " into the FACT maker", "Good Try", 
												{
													onHidden: function () {
														openToasts.pop();
													}
												}
											));
										}
									} else {
										if (_.isEqual(self.set, data.newGuy) ) { 
											toastr.clear(openToasts.pop()); 
												openToasts.push(toastr.success(txt + ". Drag " + data.firstEl.name + " into the FACT maker", "Nice",
													{
														onHidden: function () {
															openToasts.pop();
														}
													}		
												));
										} else { //Wrong set
											toastr.clear(openToasts.pop());
											openToasts.push(toastr.warning(txt + ". Drag " + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex] + " into the FACT maker", "Good Try", 
												{
													onHidden: function () {
														openToasts.pop();
													}
												}
											));											
										} 
									}
									break; // completeSteps 8 case
							}
							break;
				}
				break; // 'element', or 'set' case
		}

	};

	this.dragStart = function () {
		console.log("dragStart fact maker");
	};

	this.dragEnd = function () {
		console.log("dragEnd fact maker");
	};
}]);