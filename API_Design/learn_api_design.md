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

How do you deal with relations? 
