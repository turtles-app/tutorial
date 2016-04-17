app.controller("factMakerController", ['$scope', '$rootScope', 'data', function ($scope, rootScope, data) {
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
				break;
		}

	};

	this.dragStart = function () {
		console.log("dragStart fact maker");
	};

	this.dragEnd = function () {
		console.log("dragEnd fact maker");
	};
}]);