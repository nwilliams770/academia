## Servers and Clients
- **Server** is a computer performing services. **Client** asks for services
- Request and Response are in stanardized format
- Standard format on Internet for responses/requests is HTTP for browser-web server communication
- Nice thing about Node is that your back and front ends can be written in the same language and share libraries of code

## What does JS Need to Manage A Server?
- Better ways to create reusuable pieces
- Dealing with files, Databases
- Ability to communicate over the internet
- Send responses and requests in standard format
- Way to deal with work that takes a long time

## The C++ Core and JS Core
###C++ Core
- A core of features/utilities built in C++ and made available to JavaScript via the hooks in the v8 
engine
###The JavaScript Core
- There are C++ features in Node but also a lot of JavaScript that makes that features available and easy to use (a lot of wrappers essentially)
- Node is a framework but also a library full of JS functions that make Node easier to work with

### The Node Split
- Node originally open source at Joylent
- Those who wanted updates continued with them on their own, io.JS
- Finally the two have come together and are working collaboratively on a new Node version (that is Node 4.0)