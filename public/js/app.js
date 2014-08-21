// Create a new AngularJS module, aka an application.
// Note that the array syntax here indicates that we are
// creating a new module; if absent, we would be requiring
// an existing module. The array is a list of module dependencies.
var app = angular.module("learning", ["ngResource"]);

// Implement our own "repeater" directive
// Note that Angular implicitly converts camelCase to dash-separated values, e.g.,
// myRepeater => my-repeater
app.directive("myRepeater", function () {
	var directive = {
		restrict: "A",
		transclude: "element",
		priority: 1000,	
		terminal: true,

		// The compile function is where the magic happens, as they say.
		// This is where we use the provided expression and the scope to
		// build the resulting HTML.
		compile: function myRepeaterCompile($element, $attr, linker) {
			// $attr will contain the attribute information for the element.
			// It will have a property for our directive, using its name: myRepeater
			var expression = $attr.myRepeater,
				regex = /^(\w+) in (\w+)$/;

			console.log("provided expression: " + expression);

			// Now we need to validate and parse the expression
			var matches = regex.exec(expression);
			if (matches !== null) {
				var itemName = matches[1],
					collectionName = matches[2],
					parent = $element.parent(),
					elements = [];

				// We need to return a linker function,
				// a function responsible for registering DOM listeners and updating it as well.
				// Our linker function will be very basic, simply iterating over the variable
				// named by `collectionName` in our current scope, "killing and refilling" all
				// elements every time the collection changes.
				return function ($scope, $transclude) {
					$scope.$watchCollection(collectionName, function (collection) {
						var i;
							
						console.log("myRepeater collection changed: " + collectionName, collection);

						if (angular.isArray(collection)) {
							// we destroy all of the elements
							// and their associated scope everytime the collection changes
							if (elements.length > 0) {
								for (i = 0; i < elements.length; i++) {
									elements[i].el.remove();
									elements[i].scope.$destroy();
								}
								elements = [];
							}

							for (i = 0; i < collection.length; i++) {
								var itemScope = $scope.$new();
								itemScope[itemName] = collection[i];

								linker(itemScope, function (clone) {
									parent.append(clone);
									var block = {};
									block.el = clone;
									block.scope = itemScope;
									elements.push(block);
								});
							}
						}
						else {
							console.log("myRepeater can only iterate arrays: " + collectionName);
						}
					});
				};
			}
			else {
				console.log("Invalid expression: " + expression);
			}	
		}
	};

	return directive;
});


// Create a model for our server-side data: characters from the show Adventure Time.
app.factory("Character", function ($resource) {
	var character = $resource(
		"/api/characters/:id",
		{ id: "@id" }
	);


	return character;
});

app.controller("myController", function ($scope, Character) {
	// Load list of all characters from the server
	// I personally am not a big fan of the promise syntax, since it abstracts away
	// the asynchronous nature of what's actually happening. Let's write to the console
	// here to illustrate what's happening.
	//
	// Note that `characters` will be assigned to when the data is returned.
	Character.query(function (data) {
		console.log("Data retrieved from server: ", data);	
		$scope.characters = data;
	});

	// Exposing $scope to the console so we can play!
	window.$scope = $scope;
});
