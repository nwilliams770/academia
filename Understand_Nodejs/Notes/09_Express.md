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