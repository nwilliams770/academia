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
Why? Easy to include additional metadata, pagination information, some REST clients don't allow access to HTTP headers.
Why no more? Becoming unnecessary with standards like CORS and Link header from RFC 5988
CORS (cross-origin resource sharing): Allows you to use resources from other sites in your site.
- Problem: Same origin constraint on browsers, can only make AJAX requests to the same origin as the page that was making the call. This is so websites aren't sending your data off to other websites, super sketchy! BUT, if we want resources from another site, such an images, some JS, what have you, we have to do a lot of work to "fake" like those resources are coming from us using proxy servers

How should an envelope be used in exceptional cases
2 situations where envelope really needed: if API needs to support cross domain requests over JSONP or if the client is incapable of working with HTTP headers. 

Autoloading related resource representations
Many cases where related or referenced data from resource being requested needs to be loaded as well. Rather than requiring consumer to hit API, we can add `embed` param to allow related data to be returned alongside original resource
`GET /tickets/12?embed=customer.name,assigned_user`
Ability to implement depends on internal complexity. Potential [N + 1 select issue](http://stackoverflow.com/questions/97197/what-is-the-n1-selects-issue)

Rate limiting
Standard to add rate limiting to an API, hence intro of HTTP 429 Too Many Requests status.
Can be useful to notify consumer of limits before they hit it, popular method is using HTTP response headers:
- `X-Rate-Limit-Limit` - number of requests in current period
- `X-Rate-Limit-Remaining` - number of remaining requets in current period
- `X-Rate-Limit-Reset` - number of secs left in current period?
    - Why secs instead of timestamp? We don't need all that info like date, and possibly time zone, user only cares about time left till new period

Authentication
RESTful API is stateless so request authentication should not depend on cookies or session, each request should come with some sort of authentication credentials.
Always using SSL, that can be simplified to a randomly generated access token that is devliered in the user name field of HTTP Basic Auth. 
In  other cases, OAuth 2 can be used to provide token. If using JSONP, which cannot send HTTP Basic Auth credentials or Bearer tokens, special query param `access_token` can be used

Caching
HTTP provides built-in caching framework. Must include some additional outbound response headers and validation when you receive some inbound request headers. 2 approaches:
- ETag (Entity Tags): when generating response, include HTTP header ETag with hash or checksum of resource representation. If inbound HTTP request contains `If-None-Match` header with matching ETag value, API should return `304 Not Modified` status instead of output representation of resource
- Last-Modified: Works like an ETag, but uses timestamps. Response header `Last-Modified` contains timestap which is validated against `If-Modified-Since`

Errors
Representation of error should be no different than representation of resource, just with its own set of fields. API errors usually break down into 2 types: 400 series for client issues & 500 series for server issues. All 400 series errors should come with consumable JSON error representation. Validation errors for PUT PATCH and POST will need a field breakdown.

Status codes
A nice little reference of common and meaningful status codes
200 OK - Response to a successful GET, PUT, PATCH or DELETE. Can also be used for a POST that doesn't result in a creation.
201 Created - Response to a POST that results in a creation. Should be combined with a Location header pointing to the location of the new resource
204 No Content - Response to a successful request that won't be returning a body (like a DELETE request)
304 Not Modified - Used when HTTP caching headers are in play
400 Bad Request - The request is malformed, such as if the body does not parse
401 Unauthorized - When no or invalid authentication details are provided. Also useful to trigger an auth popup if the API is used from a browser
403 Forbidden - When authentication succeeded but authenticated user doesn't have access to the resource
404 Not Found - When a non-existent resource is requested
405 Method Not Allowed - When an HTTP method is being requested that isn't allowed for the authenticated user
410 Gone - Indicates that the resource at this end point is no longer available. Useful as a blanket response for old API versions
415 Unsupported Media Type - If incorrect content type was provided as part of the request
422 Unprocessable Entity - Used for validation errors
429 Too Many Requests - When a request is rejected due to rate limiting

#### PUT vs POST [source](https://stackoverflow.com/questions/28459418/rest-api-put-vs-patch-with-real-life-examples) & PUT vs PATCH [source](https://stackoverflow.com/questions/630453/put-vs-post-in-rest)
PUT v POST:
- `POST` requests origin server to accept entity enclosed in request as a new subordinate resource indentified by `Request-URI` in the `Request-Line` e.g. used to **create**
- `PUT` requests enclosed entity be stored under supplied `Request-URI`. If that refers to an already existing resource, enclosed entity should be considered as a modified version of one residing on origin server. If `Request-URI` does not point to existing resource, and that URI is capable of being defined as new resource by requesting user agent, origin server can create resource with that URI. e.g. **create or update**

Which to use when and why?
- Both can be used, you don't need to support both, but keep in mind what object you're referencing in the request
- Consider:
    - Do you name your URL objects you create explicitly or let server decide? If you name them, use PUT, if you let server decide use POST
    - PUT is **idempotent** (making multiple identical request has same effect as making a single request), which is nice to have!
    - You can also update or create a resource with PUT with same object URL
    - You can have 2 POST requests coming in at same time making modifications to a URL, and they may update diff parts of object
Let's see an example:
Modifying or update a resource
```
POST /questions/<existing_question> HTTP/1.1
Host: www.example.com/
```
CANNOT do this with POST, URL is not yet created so we'll get a 'resource not found' error
```
POST /questions/<new_question> HTTP/1.1
Host: www.example.com/
```
But instead must do this if you want to use POST:
```
POST /questions HTTP/1.1
Host: www.example.com/
```
Creating new resource: 
```
PUT /questions/<new_question> HTTP/1.1
Host: www.example.com/
```

PUT vs PATCH:
- `PATCH` requests that a set of changes described in the request entity be applied to resource identified by the `Request-URI`
Why and when to use?
- First must understand that PUT requires the **entire** entity which **replaces** the any existing entity at that URI while PATCH only updates the fields that were supplied. 
- Since PUT requests include the entire entity, if you issue the same request repeatedly, it should always have some outcome and is therefore idempotent
```
PUT /users/1
{
    "username": "skwee357",
    "email": "skwee357@gmail.com"       // new email address
}

PATCH /users/1
{
    "email": "skwee357@gmail.com"       // new email address
}
```
- If we were to send a PUT request without each field, there is a potential for **data loss** as we'll lose whatever fields aren't specified in the request
Based on these examples, it looks like PATCH may be idempotent as well--every time we send a PATCH request we'll get the same response, so how is it not? 
Well let's define idempotence:
- The term idempotent is used more comprehensively to describe an operation that will produce the same results if executed once or multiple times [...] An idempotent function is one that has the property f(f(x)) = f(x) for any value x.
Consider this example:
We have a `/users resource` and calling `GET /users` returns a list of users. Rather than PATCHing `/users/{id}` suppose we PATCH via `/users`:
```
PATCH /users
[{ "op": "add", "username": "newuser", "email": "newuser@example.org" }]
```
Let's also say that the `/users` resource allows duplicate usernames. If we issue the exact same PATCH request, the subsequent `GET /users` returns
```
[{ "id": 1, "username": "firstuser", "email": "firstuser@example.org" },
 { "id": 2, "username": "newuser", "email": "newuser@example.org" },
 { "id": 3, "username": "newuser", "email": "newuser@example.org" }]
 ```
Despite having issued the EXACT SAME PATCH request against the same endpoint, the `/users` resource has changed!
Note that a PATCH request can be implemented in such a way as to be idempotent

Some good API examples and useful resources
- Github, Twitter, Stripe, Google, Parse REST API
- [Public APIs](https://github.com/toddmotto/public-apis)
- [RESTful web API Doc Generator](http://apidocjs.com/)

### Streaming
Websockets:
First a little intro:
- protocol that allows real-time interactive communication between client browser and a server. Completely different protocol than HTTP that uses bidirectional dataflow
- With HTTP, a request is needed to response, we are constantly asking the server for new messages per se but web sockets don't need you to send a request in order to respond, we just have to listen for any data
- What are they useful for?
    - real-time applications
    - chat apps
    - IoT (internet of things)
    - online multiplayer games
- **NOT RECCOMMENDED** for a RESTful API as HTTP verbs are awesome at that already
- Can we currently use them and get support? YES! IE 10+, Safari/iOS Safari 7.1+, Android 4.4+ & Android Chrome
- WebSockets account for network hazards such as proxies and firewalls (and can traverse them), making streaming possible over any connection and with the ability to support upstream and downstream communications over a single connection => less burden on servers
- Designed to work with existing Web infrastructure which is why WebSocket connection starts its life as an HTTP connection guaranteeing backwards compatibility.
- The protocol switch from HTTP to WebSocket is referred to as the "WebSocket handshake" <- weird
    - if server understands protocol HTTP connection breaks down and replaced by WebSocket over **the same underlying TCP/IP connection**, uses same ports as HTTP and HTTPS by default

Intro to the HTML5 WebSockets API [source](https://www.sitepoint.com/introduction-to-the-html5-websockets-api/)

Problem: In real-time apps, the client-server connection must be persistent and in order to create that illusion, long polling usually used which can really burden the server!
Solution: WebSockets! Establish persistent socket connection between client and server that remains open until client or server wants to close it

An Implementation Example:
Call the `WebSocket()` constructor to create a connection
```javascript
var connection=new WebSocket("ws://localhost:8787",['soap','json']);
```
`ws:` and `wss:` are URL schemas for normal and secured WebSocket connections, respectively. Second param here is used to define sub protocol name, a string or array of strings
During connections lifetime, browser will receive several events such as connection opened, message received, and connection closed. We need to handle these events:
```javascript
var connection=new WebSocket("ws://localhost:8787",'json');
connection.onopen = function () {
  connection.send('Hello, Server!!'); //send a message to server once connection is opened.
};
connection.onerror = function (error) {
  console.log('Error Logged: ' + error); //log errors
};
connection.onmessage = function (e) {
  console.log('Received From Server: ' + e.data); //log the received message
};
```
Note: `connection.send()` can be used to send binary as well, either a `Blob` or an `ArrayBuffer`
```javascript
// Send image drawn on canvas to server
var image = canvas2DContext.getImageData(0, 0, 440, 300);
var binary_data = new Uint8Array(image.data.length);
for (var i = 0; i < image.data.length; i++) {
  binary_data[i] = image.data[i];
}
connection.send(binary_data.buffer);
```

### Versioning an API
#### You're versioning wrong [source](https://www.troyhunt.com/your-api-versioning-is-wrong-which-is/)
Three common schools of thought for versioning your API:
1. URL: place API version into URL, `/api/v2/breachedaccount/foo`
2. Custom request header: Same url but add a header that details version
3. Accept heady: modify accept header to specify version

And here's why they apparently suck
1. URLs such because they should represent the entity: We're wanting to fetch some data, not a version of some data, semantically it's not correct yet it's easy to use!
2. Custom request headers such because it's not really a semantic way of describing the resource: HTTP spec gives us a means of requesting the nature we'd like the resource represented in with the accept header
3. Accept headers such because they're harder to test: You can have to carefully construct the request and configure the accept header appropriately

Most important thing is to provide **stability**, so you can provide consumers of your API with a choice between either of those wrong ways! IF a version isn't specified, we default to V1

Our author prefers specifying via the accept header, because:
1. URl should not change, URL represents the resource so unless we're trying to represent different version of the resource then URL should not change
2. Accept headers describe how you'd like the data. Semantic of the HTTP spec and just as semantics of HTTP verbs make sense, so too does way client would like content represented

From accompanying stackoverflow article:
"I would conclude that API versions should not be kept in resource URIs for a long time meaning that resource URIs that API users can depend on should be permalinks.

Sure, it is possible to embed API version in base URI but only for reasonable and restricted uses like debugging a API client that works with the the new API version. Such versioned APIs should be time-limited and available to limited groups of API users (like during closed betas) only. Otherwise, you commit yourself where you shouldn't."

Consider having the services be bound to a base URI. When you have URI clearly visible, API history becomes visible/apparent in the URI design and is prone to changes over time, which goes against REST guidelines. 

A way to work around this is implement latest API version under versionless base URI and make versioned URI aliases:
```
http://shonzilla/api/customers/1234
http://shonzilla/api/v3.0/customers/1234
http://shonzilla/api/v3/customers/1234
```

Also, clients pointing to OLD API version URIs will be informed they are using an obsolete or not supported version anymore. 
Return any of the 30x HTTP status codes that indicate redirection that are using in conjunction with `Location1 HTTP header that redirects to approriate version:
"301 Moved permanently indicating that the resource with a requested URI is moved permanently to another URI (which should be a resource instance permalink that does not contain API version info). This status code can be used to indicate an obsolete/unsupported API version, informing API client that a versioned resource URI been replaced by a resource permalink.

302 Found indicating that the requested resource temporarily is located at another location, while requested URI may still supported. This status code may be useful when the version-less URIs are temporarily unavailable and that a request should be repeated using the redirection address (e.g. pointing to the URI with APi version embedded) and we want to tell clients to keep using it (i.e. the permalinks)."

#### API Evolution [source](https://www.mnot.net/blog/2012/12/04/api-evolution)
Suggested Practices:

Keep compatible changes out of names. Names should be stable over time and identify with known set of semantics, corresponding to major version number. "Names" as in anything that's an indetifier, URL, media type, link relation name, HTTP header, etc

Avoid major new versions, people have to look at it, understand it, write new software to it, debug it, etc. Huge invsetment on both sides

Make changes backwards-compatible. If you want to add support for a new HTTP method or add a new resource, this doesn't necessitate a new version. Adding support for a new format can be achieve through content negotiation. 

Think about forwards-compatibility: Evolution is about figuring out how to limit breakge that your changes incurs on clients

### Caching
#### Caching API Requests [source](https://thoughtbot.com/blog/caching-api-requests)
^ pretty nice snippets
Some requests will frequently occure with same params and return same result, if we cache our request or response, we can reduce HTTP requests, can improve performance and avoid hitting rate lmits. 

Don't always need to cache entire API response, we can save space, avoid adding operational overhead of Memcache or Redis and avoid repeating the JSON parsing step if we cache only the URL requested

