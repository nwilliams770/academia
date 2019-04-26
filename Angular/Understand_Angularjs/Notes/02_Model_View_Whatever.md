## Model, View, Whatever!
What does AngularJS aim to solve?
- Complexity of managing the DOM, the HTML, the logic, and the data itself manually. 

#### Review: Model, View, Whatever...
- We're used to seeing the MVC structure but in Angular the "Whatever" is something that ties or binds the model and view so that whatever happens in one, happens in the other
- This can be controllers, view models, Angular don't really care (Angular is MV__)

#### Review: HTML Custom Attributes
- Like how HTML5 has the "data-" prefix when using custom attributes, Angular uses "ng-" but you can also do "data-ng-"

#### Modules, Apps, and Controllers
- We will only have one object in the global namespace, which will be our app
	var myApp = angular.module('myApp', []);
	- In our HTML... <html lang="en-us" ng-app="myApp">
- We will also specify a controller WITHIN our app and add a view into our app HTML that the new controller will handle
	- myApp.controller('mainController', function () {
})

#### Dependency Injection
- **Dependency Injection**: Giving a function an object. Rather than creating an object inside a function, you pass it to the function.
- Ultimately preventing a function from depending on a singular object to work effectively, 

#### The Scope Service
- Note that all AngularJS services start with a $
- The idea is that we can add variables and functions to the $scope and that becomes the bridge between the controller and the view

#### Getting Other Services
- You can use the same dependency injection method from $scope to get other services as well