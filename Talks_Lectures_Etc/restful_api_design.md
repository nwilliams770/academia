## RESTful API Design — Step By Step Guide
(source)[https://hackernoon.com/restful-api-design-step-by-step-guide-2f2c9f9fcdbf]
APIs are the default means of communication between the systems so it is important to design RESTful APIs that avoid common mistakes.
Because of the mandates issued by Jeff Bezos, forcing all teams to expose data and functionality through service interfaces, Amazon could build scalable systems and later offer those as services as Amazon Web Services.

Some guiding principles: 
- Keep it simple: base URL should be simple (EX: `/products` for multiple `/products/12345` for single)
-  Use nouns and not the verbs: we have HTTP methods with us to describe the APIs better for for the API URLs, avoid using verbs
- Use the right HTTP methods (do people really struggle with this kind of thing?):
    - GET - get a resource or collection of resources
    - POST - create a resource or collection of resources
    - PUT/PATCH - update existing resource or collection of resources
    - DELETE - delete the existing resource or collection of resources
- Use plurals: debatable topic but usually prefer to use plural because the base URL is cleaner and more clear when requesting a specific item because the ID is usually in the URL
- Use parameters: sometimes we need an API which should be telling more than just the id; we should make use of query parameters to implement this
    - `/products?name=’ABC’` should be preffered over `/getProductsByName`
- Use proper HTTP codes: most of us only use two--200 and 500. Some other common codes:
    - 200 OK - operation performed successful
    - 201 CREATED - when you use POST to create a new resource
    - 202 ACCEPTED - used to acknowledge the request sent to the server
    - 400 BAD REQUEST - used when client side input validation fails
    - 401 UNAUTHORIZED / 403 FORBIDDEN - user or system not authorized to perform a certain operation
    - 500 - NEVER to be thrown explicity but might occur if system fails
    - 502 BAD GATEWAY - used if server received invalid response from upstream server
- Versioning: some use versions as dates, some as query params, some keep it prefixed to the resource (`/v1/products` and `/v2/products`). Good practice to keep backward compatibility so that if you change API version, consumers get time to move to the next version.
- Use pagination: use of pagination is a must when you expose an API which might return huge data, that is, ssned the data in reasonably sized chunks
    - use of `limit` and `offset` are recommended (in SQL, limit determines max number of rows returned and offset)
    - advised to keep a default limit and offet
- Supported Formats: most modern day apps should return JSON responses
- Use proper error messages: good practice to keep set of error messages that are descriptive and potentially advise a fix
- Use of Open API specifications: use of these specs can be helpful in abiding best standards (source)[https://swagger.io/resources/open-api/]