### Getting Other Services
- You can use any of the other AngularJS services by passing them as params into your main app controller
- To include other modules, we need to include the script in entry file and also declare dependencies as we define our app module

### Dependency Injection and Minification
- **Minification**: Shrinking file sizes for faster downloads and performance
- If we were to run our code through a minifier, our current setup breaks because we lose all the unique variable names Angular depends on for dependency injection
- We use a different syntax built into Angular in order to work around this error: 
  myApp.constroller('mainController', ["$scope", "$log", function(a,b,) { a.info(b) }])
  - Our minifier will preserve our strings and Angular will inject the appropriate POJOs into the function corresponding to their order in the array
  - Note: This DOES depend on the order of params
    myApp.controller('mainController, function($scope, $log) {})
    - This method does not depend on order


04 Databinding and Directives ************************
### Scope and Interpolation
- $scope is the object looks towards for interpolating data in the view

### Directives and Two Way Data Binding
- **Directive**: An instruction to AngularJS to manipulate a piece of the DOM (add a class, hide this, create this, etc.)
  <!-- <input type="text" ng-model="handle" />
  <h1>twitter.com/{{ handle }} </h1> -->
  - We are binding the input to a variable in our scope and rerendering
  - We can also use other services to process this bound variable before displaying it somewhere else on the page
  
##