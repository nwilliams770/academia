### HTTP

### Outputting JSON
- Leverage JSON.stringify()
- **Serialize**: Translating an object into a format that can be stored or transferred ex. JSON, CSV, XML 'deserialze' is coverting back into an obj

### Routing
- Routing is mapping HTTP requests to content (whether that file exists on the server or an external server)

### TCP/IP Protocols
- We know that the client-server model is a client asking for services in the form of a request and a server performs services and sends a response. But how do client and server identify each other and how is the info actually transfered?
- IP (Internet Protocol) is our identifier. We make the connection via a socket (created by the OS) which is where the info is sent
- Info is structured within it's own type of protocol (HTTP, FTP, SMTP) but the way that info is sent is via TCP (Transmission Control Protocol)
- Despite the way the info is structured, TCP stipulates that that info is broken up and sent through the socket. These broken up pieces are called packets!
- Your OS already has this ability but Node gives us the ability to access it

### Addresses and Ports
-**Port**: Once a computer receives a packet, how it knows what program to send it to. When a program is setup on the OS to receive packets from a particular port, it is said that the program is 'listening' to that port
- A socket address: IP_address:port_number (EX: 72.132.160:443) (note a domain name maps to a socket address)

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