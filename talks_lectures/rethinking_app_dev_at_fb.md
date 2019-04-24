# Hacker Way: Rethinking Web App Dev at Facebook
- Problem: MVC  model fell apart because codebase became too unpredictable and fragile, hard to introduce those new to the codebase and adding new features drastically complicated rest of codebase
- Why else is this a problem? We can have potentially endless cycles between views and models. The solution (at this time) was unidirectional dataflow of Flux. 
    - Action => Dispatcher => Store => View (note that view can have actions triggered and sent to dispatcher)
- Use explicit data instead of derived data
- Separate data from view state
- Avoid cascading effects by preventing nested updates
    - Let data layer (store) completely finish proccessing before handling any other actions from the dispatcher

- Problem: Always re-render, but efficiently and without messing up the UX or create flickers
    - Solution is React: UI interface
- Here's another problem, we have to deal with a stateful browser DOM, which was not designed to be rapidly throwing out DOM nodes
- React builds a DOM subtree, diffs with previous tree, and computes minimal set of DOM mutations and puts them in a queue, and batch executes all the updates
- "Simplicity is prerequisite for reliability" - Edgar Dijkstra

- Let's quickly review REST however:
    - REpresentational State Transfer, architectural style for providing standards between computer systems on the web. REST-compliant systems are often called **RESTful systems**. Stateless and separate concerns of client and server
    - Separation of Client and Server:
        - Implementation of client and server can be done independently. As long as each knows what messages to send to the other, they can be separate and modular
        - Separation improves flexibility of interface and improves scalability by simplifying server components
        - Diff clients hit same REST endpoints, perform same actions, and receive same responses
    - Statelessness:
        - Server and client do not need to know anything about what state the other is in. Neither needs previous messages to understand the **current** message
        - Enforced through use of resources rather than commands. 
    - REST requires a client make a request to server in order to retrieve or modify data on the server, generally consists of:
        - HTTP verb
        - header
        - path to resource
        - optional payload