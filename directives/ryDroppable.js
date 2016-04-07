app.directive("ryDroppable", function () {
	return {
		scope: {
			dropAllowed: '&',
			dragenter: '&',
			dragleave: '&',
			drop: '&'
		},
		link: function (scope, element, attrs) {
			var el = element[0];
			el.addEventListener("dragover", function (ev) {
				var allowed = scope.dropAllowed();
				if (allowed()) {
					ev.preventDefault();
				}
			});

			el.addEventListener("drop", function (ev) {
				var drop = scope.drop();
				drop();
			});

		}
	}
});