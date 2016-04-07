app.directive("ryDraggable", function(){
	return {
		scope: {
			drag: '&',
			dragStart: '&',
			dragEnd: '&',
			type: '=',
			index: '='
		},
		link: function (scope, element, attrs) {
			var el = element[0];
			el.draggable = true;
			el.addEventListener("dragstart", function (ev) {
				dragData.type = scope.type;
				dragData.index = scope.index;
			});

			el.addEventListener("dragend", function (ev) {
				dragData.type = "";
				dragData.index = null;
			});
		}
	}
});