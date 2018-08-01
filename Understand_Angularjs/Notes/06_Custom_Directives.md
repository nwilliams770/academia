06 Custom Directives *********************************************
#### Aside: Var Names and Normalization
- **Normalize**: To make consistent to a standard
- When writing custom attributes, AngularJS will convert from standard syntax to camel case and vice-versa e.g. understandAngular => understand-angular

#### Creating a Directive
- EX:
	myApp.directive("searchResult", function() {
	return {
		restrict: "EA" (E for element, A for attrib, the directive will only load on element or attrib; defaults as "AE")
		template: "<Some HTML We'd like to reuse as a component as a string>",
		- We can use templateURL instead of just copying and pasting html
		templateUrl: 'directives/searchresult.html'
		replace: true (this is replace our custom tag so we don't have any weird stuff in our HTML)
		
		using this property will ISOLATE the scope, we are now defining the scope ourselves so it can't be affected by what's going on with it's parent page 
		scope: {
			personName: "@" <=== the @ symbol is like prop-types, telling us to expect text specifically
		}
		}
	})
	in our view...
	<!-- <search-result></search-result> -->
- It's best practice to start storing directives in a directory, with each component as a seperate file


#### Scope 
- Directives can access the model that is available to them via $scope
- We can access the scope set within the parent template, this can be dangerous if we are reusing templates across our app
- We can essentially poke holes through our custom scope to provide access to certain values
	- We do this via attributes
	<!-- <search-result person-name={{ person.name }}></search-result> -->
	Like React, we're essentially threading down specific values we want to become available to the component

- Let's say we want to pass an object? We must specify with the "=" which signifies that there is a two-way binding e.g. whatever happens to the object here will affect it where it was passed from

- What if we want to pass a function? Again we have to specify in the attribute:
	<!-- <search-result person-name={{ person.name }} formatted-address-function="formattedAddress(person)"></search-result> -->

	and in the isolated scope: { formattedAddressFunction: "&" }
	- when we want to call this function we must pass it an oject map to properly get our params working
	{{ formattedAddressFunction({ person: personObject }) }}
	- The name of the name-value pair is just the name of the param we stated in the attribute

#### Repeated Directives
- Let's say we have an array of people in our previous example instead of just one, how can we map over that array in order to render all those people? Simple! We can leverage our ng-repeat in a parent div. Note we don't even need to change the namespacing because we were already using person
<!-- <div ng-repeat="person in people">
	<search-result person-object="person" formatted-address-function="formattedAddress(aperson)"></search-result>
</div> -->

Even cleaner we can put the ng-repeat directly on the custom directive!
<!-- 	<search-result person-object="person" formatted-address-function="formattedAddress(aperson)" ng-repeat="person in people"></search-result> -->

#### Understanding 'Compile'
- 'Compile' and 'Link': compiles converts and linker generates file computer interacts with. NOT what happens in Angular
- compile is a property we can add to our directive object and it accepts a function with elem and attrs as parameters
  - elem is the HTML structure of the directive, we can interact with it before it is added to the DOM
  - it returns an object with two properties: pre(link) and post(link), both expect functions and have three params: scope, elem, and attribs; for all intents and purposes, only use post, pre is dangerous
- When do you want to use these hooks? When the amount of work you need to do with the data is more involved than what you can do in the view. Perhaps we want to add some listeners, or process data based on some complex logic.
- Compile is to edit the HTML of the directive before it's used and returns pre and post list object functions that deal with the instance of the directive being used. 
- Instead of using an empty compile return a pre function, we can just use the link property on our directive object
- NOTE: the link function runs every time an instance of the directive is created so PERFORMANCE IN THAT FUNCTION IS IMPORTANT

#### Understanding 'Transclusion'
- **Transclusion**: Including one document inside another. Place a document inside another at particular point.
- Let's say we'd like to insert some HTML onto a directive we are using, but only for a specific view. We don't want to create an entirely new directive just for that small piece, so we can use transclusion to add the extra HTML. 
- we first add transclude: true to our directive object; we also must add <ng-transclude></ng-transclude> to our directive, that will define where the HTML sits (we can also add ng-transclude as an attribute to an html tag instead) 