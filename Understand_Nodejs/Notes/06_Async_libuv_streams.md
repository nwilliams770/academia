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