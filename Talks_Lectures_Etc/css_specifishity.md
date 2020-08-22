# CSS Specificty
[source](http://www.standardista.com/css3/css-specificity/) | [diagram](http://www.standardista.com/wp-content/uploads/2012/01/specificity3.pdf)
* Specificity weight notation: X-Y-Z:
    - X: # of ID selectors
    - Y: # of class selectors, attribute selectors, and pseudo-classes
    - Z: # of type selectors and pseudo-elements
    - *: universal selector has no value
    - +, >, ~: combination selectors, they allow for more specific targeting of els, do not increase specificity
    - :not(x): negation selector has no value but argument passed increases specificity
* Specificity is important because it determines which CSS property when two or more declarations apply to the same el with competing property deeclarations.
    - Most specific takes preference
    - If equal specificity, last declared in source order takes precedence

## Weights
* !important: Takes highest precedence even over inline styles. Never to be used in production but handy in debugging
* style="": Style attributes on an element take precedence over any styles declared in an external or embedded stylesheet. Also something not to be used in production
* id: Highest weighted (1-0-0 per id)
* class/pseudo-class/attributes (includes `[id=""]`): all have same weight of 0-1-0
* type: element type selectors and pseudo-els (:first-letter, :after) have lowest weight with 0-0-1 per element

Note that the final weight value X-Y-Z is not a number but a matrix, a single ID selector will overpower all class, attribute, and pseudoclass selectors

## Some less obvious things
* "*" selector has no value; *.myClass will be overwritten by p.myClass, even if it is last in cascade
* Combinators like ~, >, and + have no value in weighting of selectors. Help you be more specific in what you are targeting  but can be overwritten but selector with same weight:
    - ul > li {color: red;} 0-0-2
    - ul li {color: blue;} 0-0-2
    - Here li's would be blue as these have same weight but blue is declared later
* :not has no value, but selectrors without the negation selector do
    - li.myClass 0-1-1
    - li:not([title]) 0-1-1
    - Same weight because we count the attribute selector IN the :not, but not the :not itself
* Specificity is not inherited.
    - <div id="x" class="y"><p>Hi</p></div>
    - div#x.y {color:red;} 1-1-0
    - p {color:blue;} 0-0-1
    - The paragraph will be blue! Although the first declaration is more specific and colors are inherited, the second declaration is actually applied to/targeting the element whereas the first is applied to the parent.
    - Color is only inherited if not specifically declared on the descendant, in this case, it is!