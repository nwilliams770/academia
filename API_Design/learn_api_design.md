## Learn API Design
Collection of readings and articles on API design. [source](https://github.com/dwyl/learn-api-design)
"You only have one chance to get it right...A good API needs to appeal tothe most powerful emotion: Laziness" - Joshua Bloch

So what are the characteristics of a good API:
- Easy to learn
- Intuitive / easy to use even without documentation
- Hard to misuse
- Easy to read and maintain code that uses it
- Sufficiently powerful to satisfy requirements/needs
- Easy to evolve (the simpler the initial API the easier it will be to extend)
- Appropriate to audience (make it beginner friendly)
- Opinionated (means people don't have to think)

Types of APIs:

### REST
Representation State Transfer -- architectural style consisting of guidelines and best practices for creating scalable web services. 
Note that a protocol would be built in this arcitectural style with the architectural restraints, HTTP is one such protocol.
HTTP is a request-response protocol between client (user agent) and web server (origin server)
- GET - safe (there are no side effects from performing that action), indempotent (request can be done multiple times), cacheable (response can be cached by an intermediary along the way)
- PUT - imdempotent
- DELETE - idempotent
- HEAD - safe, idempotent
- POST
Let's look at some characteristics a RESTful protocol is supposed to have:
- Resources (app state and functionality):
    - URI (locator, name, or both); URL refers to subset of URIs that in addition to identifying a resource, provide means of location the resource by describing its primary access mechanism (e.g. network locartion)
    - Uniform Interface for transfering state between client and server
        - Methods
        - Represetation (e.g. hypertext, the body of request)
- Protocol
    - Client-server
    - stateless (each request is independent from the others, this is valuable between each request may not go through the same proxies and gateways so there amy be no visibility between those actions)
    - cacheable (response headers of HTTP requests will show control data, might show how long response can be cached)
    - layered (multiple intermediaries can be added between requests such a proxies--chosen by user agent--and gateways--chosen by origin server--, and may optimize or cache, which is WHY these requests must be statelsss)

Benefits of REST protocol:
- Network Performance:
    - Efficiency: caching helps us a lot. Your request may not even have to hit the origin server. With user agent cache, you may never need to hit network at all
    - Scalability: Use of gateways allows you to direct large amounts of traffic based on various parameters of the requets coming in. Caching helps lower amount of requets hitting server. Statelessness allows us to route through different gateways and proxies, helping to prevent bottlenecking and allowing more intermediaries to be added as needed
    - User-perceived performance: Reduced set of known media types

Note that these benefits aren't for free, you must structure your app in order to reap them
Let's take a look at two other protocols to look at structuring
- XML-RPC:
    - Remote procedure calling using HTTP is transport and XML as conding. Designed to be simple while allowing compelx data strctures to be transmitted, processed, and returned
    - All requests in XML-RPC are POST requests, so it is isn't safe, idempotent or cacheable
    - All requests go to the same URI which means that if you want to distribute tasks amongst multiple origin servers, you'd have to look at the body of the request to get the method name
    - Gives the least amount of info to intermediaries therefore least performant with off-the-shelf parts

- Atom Publishing Protocol
    - App-level protocol for publishing and editing Web resources. The protocol is based on HTTP transfer of Atom-formatted representations, documented in Atom Syndication Format.
    - Designed with RESTful characteristics in mind so takes advantage of some of those performance benefits

Other idioms in building a protocol to get some advantages:
- Long-lived images
    - If you have large images, set cache for images to very long time. If you need to update image, upload new image to a new URI and change HTML to point to that new URI, keep HTML in a cache timeline so it can be easily updated

What does it mean to be resourced-based like REST is?
- Things (resources) vs actions | nouns vs verbs | REST vs SOAP-RPC
- Resources indentified by URIs, multiple URIs may refer to the same resource
    - EX: resource => person (Todd) | service => contact info (GET) | representation => name, address, phone number
- Representation of the resource is not the resource itself
6 Constraints of REST:
- Uniform interface
    - defines interface between client and server, we use the HTTP spec with URIs being resource names and HTTP verbs as actions to take on those resources. We get status from our HTTP resonse body. Note, REST is an architectural style and does NOT need to use HTTP
- Stateless
    - Server contains no client state
    - Each request is self-descriptive e.g. has enough context to process the messages. Any session state is held on the client
    - There are things that are built in a RESTful fashion but is stateful such as OAuth2
- Client-server
    - Assume a disconnected system, a client of a RESTful API will need to understand that it won't always have a direct connection to a database/these resources
    - Separation of concerns
    - Uniform interface is the link between the two
- Cacheable
    - Server responses (representations) are cacheable
        - Implicity: if it's not denoted, in general a client can cache something
        - Explicity: server specifies max age, duration, etc
        - Negociated
- Layered System
    - Client can't assume direct connection to server
    - Software or hardware intermediaries between client and server
    - Improves scalability
- Code on demand
    - Server can temporarily extend client by transfering logic to client
    - Client executes logic:
        - Java applets
        - JavaScript
    - The only optional constraint

#### 5 Functionalities Every API Must Have ([source](https://blog.newrelic.com/engineering/apipunchlist/))
** Article seems more like library suggestions as opposed to detailed info

1. Error Handling
Standard approach is to return any errors with respective HTTP code, these aren't always codified via a framework so keep in mind additional actions in handling of errors

2. Error logging
Once error handling is in place, errors need to be logged so they can be reviewed. Many manys to log, some libraries are [log4js](https://github.com/nomiddlename/log4js-node), [bunyan](https://github.com/trentm/node-bunyan), [winston](https://github.com/flatiron/winston)

3. Validation
[validator.js](https://github.com/chriso/validator.js)
4. Authentication and authorization
[passport](http://passportjs.org/)
5. Testing

#### Best Pracices for Design a Pragmatic RESTful API ([source](https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api))
Very difficult to make significant changes to your API once it's realeased so you ideally want to get as much right as possible up front. 
Answers you will find! Based upon findings from designing API for Enchant, Zendesk alternative

Key Requirements for the API:
Best practices for a pragmatic API designed for today's web applications, no attempts to satisfy a standard if it doesn't feel right. API must strive for:
- It should use web standards where they **make sense**
- It should be friendly to the developer and be explorable via a browser address bar
- It should be simple, intuitive, and consistent to make adoption not only easy by pleasant
- Should provide enough flexibility to power the majority of the UI
- Should be efficient while maintaining balance with the other requirements

Use RESTful URLs and actions:
REST (intro'd by Roy Fielding) involves separating API into logical resources which are manipulated using HTTP requests where the method has a specific meaning
But what can be made a resource? Although internal models may map neatly to resources, it isn't necessarily a one-to-one mapping. Key is to **not leak irrelevant implementation details out of your API**
Once resources defined, must identify what actions apply to them and how those would map to your API. 
Let's see a basic AF example:
- GET /tickets - Retrieves a list of tickets
- GET /tickets/12 - Retrieves a specific ticket
- POST /tickets - Creates a new ticket
- PUT /tickets/12 - Updates ticket #12
- PATCH /tickets/12 - Partially updates ticket #12
- DELETE /tickets/12 - Deletes ticket #12
Look at all that functionality on just a single `/tickets` endpoint!
NOTE: You may want to be all grammatical and try to changes `/tickets/12` to `ticket/12`..WRONG. Keep it simple and plural

How do you deal with relations? If a relation can only exist within another resource, RESTful principles provide useful guidance. Let's elaborate on our basic example, each ticket consists of a number of messages so it can be mapped to the `/tickets` endpoint:
- GET /tickets/12/messages - Retrieves list of messages for ticket #12
- GET /tickets/12/messages/5 - Retrieves message #5 for ticket #12
- POST /tickets/12/messages - Creates a new message in ticket #12
- PUT /tickets/12/messages/5 - Updates message #5 for ticket #12
- PATCH /tickets/12/messages/5 - Partially updates message #5 for ticket #12
- DELETE /tickets/12/messages/5 - Deletes message #5 for ticket #12

If a relation can exist independently of the resource, it makes sense to just include an indentifier for it within the output representation of the resource. API consumer would have to hit relation's endpoint but if relation is commonly requested alongside resource, API could offer different functionality to automatically embed relation's representation and avoid second hit to API

What about actions that don't fit into the world of CRUD operations? 
Fuzzy territory, some approaches:
1. Restructure the action to appear like a field of a resource. This works if action doesn't take parameters. For example, an `activate` action could be mapped to a boolean `activated` field and updated via a PATCH to the resource
2. Treat it like a sub-resource with RESTful principles. Example, Github API lets you start a gist with `PUT /gists/:id/star` and unstar with `DELETE /gists/:id/star`
3. Sometimes you really have no way to map action to a sensible RESTful structure. For example, a multi-resource search doesn't make sense to be applied to a specific resource's endpoint. In this case, `/search` 

SSL Everywhere - All The Time
SSL: Secured Sockets Layer
- web protocol for enhancing web security, TLS is an improvement on SSL but SSL is generally used to refer to both SSL and TLS
Allows web clients and servers to:
- verify each other's indentity
- encrypt messages
- ensure integrity of messages sent between them
Always using SSL simplifies authentication efforts -- guaranteed encrypted communications allows us to get away with simple access tokens instead of having to sign each API request
Watch for non-SSL acccess to API URLs. Do not redirect to SSL counterpartrs but throw a hard error instead. Do not want poorly configured clients to sent requets to an uncrypted endpoint just to be silently redirected to the actual encrypted endpoint

Documentation
API only as good as it's documentation! Should be easy to find and publically avail, do not put them in some downloadable PDF or require sign in, they should be front and center
Should show examples of complete request/response cycles. 
Must include any deprecation schedules and details surrounding externally visible API updates. Updates delivered via a blog (ie a changelog) and/or a mailing list

Versioning
Versioning helps you iterate faster and prevents invalid requests from hitting updated endpoints. 
Mixed opinions about whether API should be included in URL or header, one method, done by Stripe, has major version in the URL but the API has date based sub-versions which can be chosen using a custom HTTP header.

Result filtering, sorting, and searching
Best to keep base resource URLs as lean as possible. Complex result filters, sorting and advanced searching can all be implemented as query params on top of the base URL
- Filtering: use a unique query parameter for each field that implements filtering. EX: `/tickets` which have open state => `GET /tickets?state=open`. `state` is a query param that implements a filter
- Sorting: similar to filtering, a generic parameter `sort` can be used to describe sorting rules, where complex sorting requirements can be described by comma separated fields, each with a possible unary negative to imply descending sort order. EX: `GET /tickets?sort=-priority` => retrieves tickets in descending order of priority | `GET /tickets?sort=-priority,created_at`=> retrieves list of tickets in desc order of priority. within specific priority, older tickets ordered first
- Searching: when full text search is used as a mechanism of retrieving resource instances for a specific type of resource, can be exposed on the API as a query param on resource's endpoint. Let's say `q` EX: `GET /tickets?q=return&state=open&sort=-priority,created_at`=> retrieve the highest priority open tickets mentioning the word 'return'

Aliases for common queries
To make API experience more pleasant, consider packaging up sets of conditions into easily accessible RESTful paths. EX: recently closed tickets query => packaged up as `GET /tickets/recently_closed`

Limiting Which Fields Are Returned By The API
API consumer doesn't always need the full representation of a resource--the ability to select and choose return fields goes a long way in letting the API consumer minimize network traffic and speed up their own usage of the API
Use a `fields` query param that takes comma separated list of fields to include. EX: `GET /tickets?fields=id,subject,customer_name,updated_at&state=open&sort=-updated_at`

Updates & Creation Should Return A Resource Repsentation
A PUT, POST, or PATCH call may make modifications to fields of the underlying resource that weren't part of the provided params (EX: created_at or updated_at timestamps). To prevent API consumer from having to hit the API again for updated representation, have the API return updated (or created) representation as part of the response. 
In case of POST, use HTTP 201 and include Location header that points to URL of new resource

Should You HATEOAS?
Tf is HATEOAS (Hypermedia as the engine of application state)? Roughly, states that interaction with an endpoint should be defined within metadata that comes with the output representation and not based on out-of-band information
Come back to HATEOAS in detail but the TL;DR is that it's not recommended for API design at this point!s

JSON Only Responses
Why not XML? Verbose, hard to parse, hard to read, data model isn't compatible with how most programming languages model data and its extendibility advantages are irrelevant when your output representation's primary needs are serialization

If your customer base consists of a large number of enterprise customers, you may have to support XML anyway, now you've got this question:
- Should the media type change based on Accept headers or based on URL?
    - To ensure browser explorability, should be in URL. Most sensible option is to append `.json` or `.xml` extension to the endpoint URL

snake_case vs camelCase for field names
If using JSON as primary representation format, right thing is to follow JS naming conventions. Snake case is 20% easier to read however so think about that

Pretty print by default & ensure gzip is supported
Make it easier to debug and more plesant to use, have prettyprint as the default.
If gzip compression is supported, the extra data added from prettyprint is quite small (8.5% without gzip, 2.6% with) so having it default is totes fine

Dont use an evelope by default, but make it possible when needed\
Many APIs wrap their responses in evelopes like this:
```json
{
  "data" : {
    "id" : 123,
    "name" : "John"
  }
}
```


