#### Review: Single Page Apps and the Hash
- Fragment indentifier:
	<a id="bookmark">go here</a>
	...further down page...
	<a href="#bookmark">go to bookmark</a>
	#bookmark is our fragment indentifier!
- There is also a "hashchange" event in javascript as well as a window.location.hash value
- Our has value can essentially serve as an HTML and allow us to create single-page apps

#### Routing, Templates, and Controllers
- We have a route service (in the form of a module to download and add) for Angular in order to develop a single page app
- We can also use the $location service in order to determine what our URL is and do work when it changes
ex: 
	var myApp = angular.module('myApp', ['ngRoute']);
	myApp.config(function ($routeProvider) {
	$routeProvider

	.when('/', {
	templateURL: 'pages/main.html'
	controller: 'mainController'
	})
})
- Because of this, we no longer need to specify a controller within our mainApp HTML and instead we just have :
	<div ng-view></div>
	- This is where all our HTML will live, it will update properly contingent upon our routing and controllers
- We can also have pattern matching in our routes and pass data using $routeparams
		.when('/second/:num', {
	templateURL: 'pages/main.html'
	controller: 'secondController'
	})

	In our controller we inject $outeparams we can access the wildcard with the name we call it in the route
	$scope.number = $routeparams.num

- Note that we can hook multiple routes to the same controller and view and use the OR-equals pattern to prevent any errors due to lack of data or undefined variables


05 Custom Services *********************************************
##### Aside: Singletons
- **Singleton**: The one and only copy of an object. Angular services are implemented as singletons.
- What about $scope though? That is our one exception!

#### Creating a Service
- myApp.service("serviceName", function () {
	var self = this;
	this.name = 'John Doe';
	this.namelength = function() {
		return self.name.length
}
})
- We then inject this service into our controller same as any other
- Why care? Because this service is singleton, we can do some valuable stuff with it such as share data and services between controllers/pages