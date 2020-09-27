### Review .call and .apply
- .call let's you invoke a function but can be passed a object which will have the method called on it. E.g. you can invoke one object's method as if it was another object's, you can change what the this keyword points to
- You can also pass other params to the function itself: obj1.call(obj2, param1, param2, ...);
- Apply is the same as call but you pass the extra params as an array obj1.apply(obj2, [params1, params2, ...])

### Inheriting from the Event Emitter
- When creating our chain of inheritance, we are hooking into the function constructor's prototype. This do NOT accomodate for objects and methods that are directly added to the object. EX: function Greetr () { this.greeting = "hi" }
- To fix this we do function Greetr() { EventEmitter.call (this); this.greeting = "hi"; }
- (util).inherits just connects the prototypes, not what directly attaches properties and methods to the object

- When using classes, to set up our chain of inheritance as well as methods/property inheritance, we first have:
Greetr extends EventEmitter (this handles prototype inheritance)
in constructor..
super(); (this handles properties and methods)
- This class structuring is totally fine for modules

### Review ES6 Classes
- Doesn't change anything going on under the hood, just some syntactic sugah
- Side note; 'use strict'; should be used for production level code

*************** 06_AsyncCode, libuv, event loop, streams, files, etc

### JS is Synchronous / Callbacks
- Async just means that more than one set of code is running at the same time
- While NodeJS is asynchronous, JavaScript and the V8 engine is synchronous

- **Callback**: A function passed to some other function that we assume will be invokved at some point

### libuv, the Event Loops, and Non-Blocking Async Code
- System Events that occur within the C++ core of Node are handled by a C library called libuv
- libuv handles events occuring in the operating system and communicate an events done-ness to the V8 engine. HOWEVER, because it is synchronous, it will wait until nothing else is running to execute that callback
-**non-blocking**: Doing other things without stopping your program from running. Node accomplishes this by doing this asynchronously

### Streams and Buffers
- **Buffer**: A temporary holding spot for data being moved from one place to another. Intentionally limited in size
- **Stream**: A sequence of data made available over time. Pieces of data that eventually combine into a whole
- It's common that a stream and buffer word in tandem. Data coming down the stream is gathered in a buffer, than processed

### Binary Data, Char Sets, and Encoding
- Binary data is just representing data in 1's and 0's, each 1 or 0 is called a bit (and 8 bits make a byte)
- How is binary represented? Let's see an example for the number 5
	- 0 1 0 1 corresponds to (0 x 2^3) + (1 x 2^2) + (0 x 2^1) + (1 x 2^0)
- A char set is just a representation of characters as numbers e.g. ASCII or Unicode
- **Character Encoding**: How chars are stored in binary. The numbers (or code points) are converted and stored in binary
- An example of character encoding is UTF-8 where each number, REGARDLESS of its size is represented using 8 bits. This allows for a large amount of numbers to be encoded while creating a clean system for reading them

### Files and fs
- the 'fs' module is part of the C++ core that handles interacting with files; we can require it in our node app and work with it!
- Note that while there is the option to read a file synchronously with readFileSync or asynch with readFile; readFile of course take an error-first callback
- **Error-First Callback**: Call backs that take an error as their first param; null if no error, otherwise will contain an obj describing error. This is a standard so we know how to order our params for callbacks
- Side Note: When linking to other files you can use dirname in Node preceded by two underscores

### Streams
- Recall a stream is just a sequence of data. Data is split into **chunks** being sent through a stream.
- In Node, the Stream module inherits directly from Event Emitter (logically so!) Furthermore, there are many other types of Streams that inherit from the Stream module (e.g. Readable, Writable, Duplex, etc.)
- **Abstract (base) class**: A type of constructor you never work directly with but inherit from. We create bew custom objects which inherit from the abstract class
- Hooking into 'fs', we can effectively create read and write steams, declare a callback so that the write stream writes directly after a chunk is read, specify the chracter encoding, as well as the buffer size if we don't want the default

### Pipes
- **Pipe**: Connecting two streams by writing to one stream as it is being read from another. In Node you pipe from a Readable to Writable
- In our previous example, it is quite common to write each chunk to a writable stream as it is coming in from a readable. 
- Node makes this easier for us by having a method .pipe 
- Note that what is RETURNED from .pipe is the specified destination, allowing us to pipe the chunk through various streams as long as they're both readable and writable

*************** Section 7 HTTP and being a web server

### TCP/IP Protocols
- We know that the client-server model is a client asking for services in the form of a request and a server performs services and sends a response. But how do client and server identify each other and how is the info actually transfered?
- IP (Internet Protocol) is our identifier. We make the connection via a socket (created by the OS) which is where the info is sent
- Info is structured within it's own type of protocol (HTTP, FTP, SMTP) but the way that info is sent is via TCP (Transmission Control Protocol)
- Despite the way the info is structured, TCP stipulates that that info is broken up and sent through the socket. These broken up pieces are called packets!
- Your OS already has this ability but Node gives us the ability to access it

### Addresses and Ports
-**Port**: Once a computer receives a packet, how it knows what program to send it to. When a program is setup on the OS to receive packets from a particular port, it is said that the program is 'listening' to that port
- A socket address: IP_address:port_number (EX: 72.132.160:443) (note a domain name maps to a socket address)

### HTTP
- **HTTP**: A set of rules for data being transferrred on the web. HyperText Transfer Protocol. It's a format defining data being transferred via TCP/IP
- **MIME Type**: A standard for specifying the type of data being sent. Multipurpose Internet Mail Extensions (ex: app/json, image/jpeg, text/html)

### HTTP_Parser
- Http_Parser is a C Program that parses requests and responses
- It's wrapped in the JavaScript side of the Node core and has other features added to it
- Side Note: '127.0.0.1' is the standard IP address for the local system e.g. localhost

### Outputting HTML and Templates
- **Template**: Text designed to be the basis for final text or content after being processed. There's usually specific language so the template system knows what to replace and where
- In our simple web server, we were just rendering HTML in the browser. Now that we need to inject new values into our template, we have to convert that binary data into a string, then send it back

### Streams and Performance
- Streams are fundamental to performance, especially when you have heavy traffic and sending large files or large amounts of data
- For instance, in our prev example, we can create a read stream from our html file and directly pipe it to our response
- By doing this, we're sending info a chunk at a time, our buffer stays small, and the application will be more performant

- If you want to do something such as fill a template as we go, we need to write a custom stream! 

### Review: APIs and Endpoints
- **API**: A set of tools for building an app. Application Programming Interface. On the web, usually made avail via a set of URLs which accept and send only data via HTTP and TCP/IP
- So instead of a URL usually giving us a web application, we get lovely, lovely data! We can even send an API request with some data which will be processed in some way
- **End Point**: A URL in a web API. Sometimes that endpoint does multiple things based on the HTTP request headers


******************* 08 NPM: the Node Package Manager
### Review: init, nodemon, package.json
- npm init common command even for non-Node projects because of the ease in setting up
- "^2.10.6" the ^ means any patch or minor update will be done automatically; ~ means only patches
- You can access packages via the require func and like core Node features, we don't need to specify a diretory (ex: var moment = require("moment") )
- we can specify dev dependencies as well from the CLI using npm such as testing packages (by saying --save-dev)
- we can also use the CLI to download packages globally (ex: npm install -g nodemon)
- Why use nodemon? Nodemon will allow us to run our app and watches if any files change then restart server accordingly, super helpful! Smart to install globally

******************* 09 Express
- Express just handles the very mundane server set up we did with Node; view it was a wrapper for a lot of the core Node functionality and modules we looked at earlier
- **Environment Variables**: Global variables specific to the environment (server) our code is living on. Different servers can have diff variables settings and can access those values in code.
- EX: let port = process.env.PORT || 3000; 
	  app.listen(port);
	- process is a global object avail in node. So either way use a environment variable called PORT or we use 3000 (suggested for local)
- **HTTP Method**: Specifies the type of action the request wishes to make. GET POST DELETE etc also called verbs
- Let's look at a simple example:
	app.get("/", function (req,res) {
	res.send("hello world!");
})
	- Note we can have multiple verbs for the same url and don't need to specify the type of data we're sending
	- we can also use res.json({ JS Object }) to convert a JS object to JSON and send it at the same time!

### Review: Routing
- With Express there are various matching patterns we can do and use variables as well, here's a brief example:
app.get("/person/:id", function (req,res) {
	res.send(`hello, person: ${req.params.id}`);
})

### Review: Static Files and Middleware
- **Middleware**: code that sits between two layers of software. In Express, sitting between request and response
- **Static**: Not dynamic. E.g. HTML, CSS, images
- Let's see a simple example done with Express:
	app.use('/assets', express.static(_ _ dirname + '/public' (our style.css file is in a folder named public)));
	- In our HTML head we add a link tag to our css with the href=assets/style.css (the browser will make a request then to '/assets'! and our middleware fill look for this file!)
- In Express you are also given a third param: function(req, res, next); next() will just move to the next relevant middleware

### Templates and Template Engines
- Express, unlike Rails, is very unopinionated and leaves a lot of options on how you want to use a template engine
- With a simple line, most packages will hook into our express app:
	app.use('view engine', 'ejs');
	- common to have our engine look for files in a views directory
- With a template engine, we no longer have to customize the response, we can just use res.render("view-name")
- can also pass a POJO to res.render(view-name, POJO)

### Querystring and Post Params
- In Express, we are able to access the name-value pairs in a query string by accessing it via req.query.(name); this data can be passed along to our view or processed in some other way
- This is only applicable to GET requests, what about POST? If we want to do that, we need to parse the body of the request which Express can't do alone
- We have to add body-parser to parse the bodies; PAY ATTENTION to documentation on how to properly use packages/modules when you download them
- When we receive a POST request, the MIME type is x-www-form-urlencoded along with the body, which both need to be parsed. We might also have some JSON we want to parse as well
- Simple example:
	var bodyParser = require("body-parser")
	var urlencodedParser = bodyParser.urlencoded({extended: false})

	it's just a callback that is executed before the response
	app.post('/person', urlencodedParser, function (req,res) {
		res.send("thanks!");
		console.log
})

### Review: RESTful APIs and JSON
- **REST**: Representational State Transfer. An architectural style for building APIs. We decide that HTTP verbs and urls mean something

## Structuring An App
- Prev examples will not work on large-scale in terms of structure, let's discuss some options as well as the express-generator that creates a particular directory structure


******************* 10 JavaScript, JSON, and Databases
### NoSQL and Documents
- NoSQL: A variety of technologies that are alternative sto tables and SQL. One of those is a document database, MongoDB is one of those
- Essentially sacrificing hard drive space for greater flexibility; hard drive space is cheaper than having to completely restructure your database

### MongoDB and Mongoose
- Most popular way of using MongoDB in Node is with an npm package named Mongoose
- High-level implementation is that you extract Schema, a function contructor, from the package and define your schema for each model. You can then generate your model and apply your schema to it. 
- They way MongoDB stores data makes it very natural/easy to manipulate and work with within Node and JavaScript in general

******************** 11 The MEAN Stack
- Mongo, Express, Angular, Node
	- Mongo: Stores data
	- Express: Routing, ease in writing APIs and working with HTTP
	- Angular: managing code and UI in the browser
	- Node: JS on the server, handle HTTP requests and responses
### AngularJS
- Popular browsers written in C++ and also have embedded JS engines that give them access to extra features (Google used V8 engine)
- **DOM**: Document Object Model. Structure that browsers use internally to store and manage web pages (usually a collection of C++ objects)
- Once our HTML is processed by the browser, the DOM is generated in a hierarchal fashion, much like how HTML is structured in general
- Because each browser has a different JS engine, behavior might be different for the same code. So we use a framework to keep everything manageable for us

******************* 12 The Dreadful To-Do App
- Important Take Aways:
	- 


