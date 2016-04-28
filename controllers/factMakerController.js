app.controller("factMakerController", ['$scope', '$rootScope', 'toastr', 'data', function ($scope, $rootScope, toastr, data) {
	var self = this;
	this.element = null;
	this.set = null;
	this.justifications = [];
	this.expectedJustifications = [];
	this.flash = false;



	this.dropAllowed = function () {
		switch (dragData.type) {
			case 'element':
			case 'set':
			case 'fact':
				return true;
				break;
			default:
				return false;
				break;
		}
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
								data.factMakerElement = self.element;
								if (self.element.name === data.firstEl.name) {
									if (!self.set) {
										$rootScope.$broadcast("flashSet", {set: data.newGuy});
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
														self.expectedJustifications = [fact1, fact2];
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
						case 11:
							toastr.clear(openToasts.pop());
							if (_.isEqual(self.element, data.z)) {
								if (_.isEqual(self.set, data.newGuy)) { //Had correct set
									if (self.justifications === 2 ) { //Have enough facts
										self.flash = true;
										var txt = "Our FACT now says that z is in " + self.set.strEquivalents[self.set.eqActiveIndex] + " and we have the justifications to prove it! Drag the new FACT into the FACTS";
									} else { //Missing Facts
										var txt = "Our new FACT now says that z is in " + self.set.strEquivalents[self.set.eqActiveIndex] + ". Now drag in your justifications.";
									}

								}
								//  else if (self.set) { //Had wrong set
								// 	var txt = ""
								// }
								 else { // Was missing set
									var txt = "We want to say that z is in " + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex] + ". Drag " + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex] + " into the FACT maker"; 
								}
								openToasts.push(toastr.success(txt, "Good.", 
									{
										onHidden: function () {
											openToasts.pop();
										}
									}));

								openToasts.push(toastr.success)
							} else { // Dropped wrong element
								openToasts.push(toastr.warning("We want to say that z is in " + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex] + ". Drag z into the FACT Maker", "Nice Try",
									{
										onHidden: function () {
											openToasts.pop();
										}
									}));
							}
							break;
						}
						break; // 'element' case

						case 'set':
							var txt	= "We want to say that " + data.firstEl.name + " is in " + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex];
							switch (data.completeSteps) {
								case 8:
									data.factMakerSet = data.sets[dragData.index];
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
															self.expectedJustifications = [fact1, fact2];
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

									case 11:
										toastr.clear(openToasts.pop());
										if (_.isEqual(self.set, data.newGuy)) { //dropped correct set
											if (_.isEqual(self.element, data.z)) {
												var txt = "Our FACT now says that z is in " + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex];
												if (self.justifications.length < 2) { // Missing Facts
													txt = txt + ". Now drag in the relevant FACTS";
												} else { //Have all facts facts
													txt = txt + ", and we have both of our justifications. Now drag our new FACT into the FACTS on the left. ";
													self.flash = true;
												}
											} else  if (self.element) { //Wrong element
												var txt = "We want to say that z is in " + self.set.strEquivalents[self.set.eqActiveIndex] + ". Drag z into the FACT maker";
												// openToasts.push(toastr.success());
											} else { //Missing element
												// openToasts.push(toastr.)
												var txt = "Our FACT will say that something is in " + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex] + ", but what? Drag z into the FACT Maker.";
											}
											openToasts.push(toastr.success(txt, "Nice",
												{	
													onHidden: function () {
														openToasts.pop();
													}
												}
											));
										} else { //dropped irrelevant set
											openToasts.push(toastr.warning("We want to prove that z is in " + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex] + ". Drag " + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex] + " into the FACT maker", "Not Quite",
												{
													onHidden: function () {
														openToasts.pop();
													}
												}
											));
										}									
										break;
							} 
							break;
				}
				break; // 'element', or 'set' case
			case 'fact':
				switch (data.completeSteps) {
					case 8:
						if (self.expectedJustifications.indexOf(data.facts[dragData.index]) >= 0) {
							toastr.clear(openToasts.pop());
							self.justifications.push(data.facts.splice(dragData.index, 1)[0]);
							data.updateScopes();
							// $rootScope.$broadcast("removeFacts", {
							// 	facts: [data.facts[dragData.index]]
							// });
							switch (self.justifications.length) {
								case 1:
									openToasts.push(toastr.success("That's it! We need one more fact to prove that " + data.firstEl.name + " is in " + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex], "Good", 
										{
											onHidden: function () {
												openToasts.pop();
											}
										}
									));
									break;
								case 2:
									self.flash = true;
									// $scope.$apply();
									openToasts.push(toastr.success("These two facts justify our new fact. Now we can conjur the new fact by dragging it into the FACTS on the left", "Very Good", 
										{
											onHidden: function () {
												openToasts.pop();
											}
										}
									));
									break;
							}
						} else { //irrelevant fact
							if (data.facts[dragData.index].elementName != data.firstEl.name) { //Wrong element
								var txt = "That fact is about the element " + data.facts[dragData.index].elementName + ", but we need to use one about " + data.firstEl.name +".";
								toastr.clear(openToasts.pop());
								openToasts.push(toastr.warning(txt, "Almost", 
									{
										onHidden: function () {
											openToasts.pop();
										}
									}
								));

							} else { // Wrong set
								var txt = "That fact is about the set " + data.facts[dragData.index].setSyntax + ", but we need one that's about " + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex];
								toastr.clear(openToasts.pop());
								openToasts.push(toastr.warning(txt, "Almost", 
									{
										onHidden: function () {
											openToasts.pop();
										}
									}
								)) 
							}
						}
						break; // Seteps = 8
					case 11:
						var fact1 = data.findFact(data.z, true, data.left, data.facts);
						var fact2 = data.findFact(data.z, true, data.right, data.facts);
						self.expectedJustifications = [fact1, fact2];
						if (self.expectedJustifications.indexOf(data.facts[dragData.index]) >= 0) {
							toastr.clear(openToasts.pop());
							self.justifications.push(data.facts.splice(dragData.index, 1)[0]);
							data.updateScopes();
							switch (self.justifications.length) {
								case 1: // 1/2 relevant facts dropped
									openToasts.push(toastr.success("Solid. We need one more fact to prove that z is in " + data.newGuy.strEquivalents[data.newGuy.eqActiveIndex], "1/2 Justifications",
									{
										onHidden: function () {
											openToasts.pop();
										}
									} ));
									break;
								case 2: // 2/2 relevant facts dropped
									self.flash = true;
									data.completeSteps = 11;
									openToasts.push(toastr.success("These two facts justify our new fact. We can conjur the new fact by dragging it into the FACTS on the left", "2/2 Justifications", 
										{
											onHidden: function () {
												openToasts.pop();
											}
										}
										))
									break;
							}
						} else { //irrelevent fact
							toastr.clear(openToasts.pop());
							if (data.facts[dragData.index].elementName != 'z') { //Wrong element
								openToasts.push(toastr.warning("That fact is about the element " + data.facts[dragData.index].elementName + ", but we need to use one about z.", "Almost", 
								{
									onHidden: function () {
										openToasts.pop();
									}
								}));
							} else { //Wrong set
								openToasts.push(toastr.warning("That fact is about the set " + data.facts[dragData.index].setSyntax + ", but we need one that's about " + data.left.strEquivalents[data.left.eqActiveIndex] + ", or about " + data.right.strEquivalents[data.right.eqActiveIndex], "Almost",
									{
										onHidden: function () {
											openToasts.pop();
										}
									}));
							}
						}
						break;
					default:

						break; //default Steps
				}
				break;
		} // Dragdata switch (outer)

	};

	this.dragStart = function () {
		data.factInfo = {
			set: self.set,
			element: self.element,
			justifications: self.justifications,
		};
		switch (data.completeSteps) {
			case 8:
			case 11:
				if (self.flash) {
					self.flash = false;
					$rootScope.$broadcast("toggleFlashFacts");
				}
				break;
		}
	};

	this.dragEnd = function () {
		data.factInfo = null;
		switch (data.completeSteps) {
			case 8:
				$rootScope.$broadcast("toggleFlashFacts");
				if (self.justifications.length === 2 && _.isEqual(self.set, data.newGuy) && _.isEqual(self.element, data.firstEl) ) {
					self.flash = true;
					$scope.$apply();
				} else {
				}
				break;
			case 11:
				$rootScope.$broadcast("toggleFlashFacts");
				if (self.justifications.length === 2 && _.isEqual(self.set, data.newGuy) && _.isEqual(self.element, data.z)) {
					self.flash = true;
					$scope.$apply();
				}
				break;
		}
	};

	$rootScope.$on("clearFactMaker", function (ev) {
		self.justifications = [];
		self.element = null;
		self.set = null;
	});

	$rootScope.$on("flashFactMaker", function (ev) {
		self.flash = true;
	});

	$rootScope.$on("unflashFactMaker", function (ev) {
		self.flash = false;
	});
}]);