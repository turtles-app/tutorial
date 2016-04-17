app.directive("ryDragAndDroppable", function () {
	return {
		scope: {
			type: '=',
			index: '=',
			drag: '&',
			dragStart: '&',
			dragEnd: '&',
			dropAllowed: '&',
			dragenter: '&',
			dragleave: '&',
			drop: '&'
		},
		link: function (scope, element, attrs) {
			var el = element[0];
			draggable = true;

			///////////////////
			// Drag Handlers //
			///////////////////
			el.addEventListener("dragstart", function (ev) {
				dragData.type = scope.type;
				dragData.index = scope.index;
				var dragStart = scope.dragStart();
				dragStart();
			});

			el.addEventListener("dragend", function (ev) {
				dragData.type = "";
				dragData.index = null;
			});
			///////////////////
			// Drop Handlers //
			///////////////////
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