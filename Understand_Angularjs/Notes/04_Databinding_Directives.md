04 Data Binding and Directives ******************
#### Watchers and the Digest Loop
- AngularJS extends the event loop in JS in order to automatically control the binding between model and view (e.g. the Angular Context)
- Let's say we add something to the scope object and add it to the page, Angular will track that value using a Watcher. It keeps track of the old value, new value, and any events that may cause a change to that value
- This is executed via the Digest Loop (a Digest Cycle is one loop of this loop). Digest Loop will check if a value is changed, if so it will do another cycle to see if that change will lead to another value change, and so on and so forth until all values are updated
- When doing some code such a setTimeout, you can avoid triggering a digest cycle and the DOM won't update, oh no!
- We can use a method such as $scope.$apply(function ( {
	
})) to work within the Angular context AND use services that provide a lot of functionality

#### Common Directives
- We've used ng-model as a custom attrib to specify to Angular that we'd like to build a connection between that view and a specific model, we can use other directives to work out other logic in our view
- EX: ng-if="handle.length !== 5" or ng-hide/ng-show
- another EX: ng-repeat is a for in loop for iterating through large amounts of data
- A fun directive in Angular is ng-cloak, which will hide an el until Angular has processed it. Prevents any shotty or slow updating of values
- There's directives for most browser events to handle them properly

#### Review: The XMLHTTPRequest Object
- How do we get a send data from our front end? 
- XMLHttpRequest object that goes out and makes requests on its own; it was conceptualized by Microsoft and adopted by all browsers
- This is quite a complex object, you may be familiar with jQuery AJAX requests, which wrap this object
- Angular also wraps this object for ease of use, voila $http service
- NOTE that we cannot just get our data from the backend and slap it onto the $scope, we need to use $apply in order to work within Angular context

#### External Data and $http
- Example of $http:
	$http.get("/api")
		.success(funcion (whateverWeWantToNameOurData) {
			$scope.rules = result
			**Note we don't need to wrap in $apply because we already working in Angular context**
		})
		.error(function (data, status) {

			})

#### Scope and Interpolation
- $scope is the object looks towards for interpolating data in the view

#### Directives and Two Way Data Binding
- **Directive**: An instruction to AngularJS to manipulate a piece of the DOM (add a class, hide this, create this, etc.)
  <!-- <input type="text" ng-model="handle" />
  <h1>twitter.com/{{ handle }} </h1> -->
  - We are binding the input to a variable in our scope and rerendering
  - We can also use other services to process this bound variable before displaying it somewhere else on the page