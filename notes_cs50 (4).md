####Lecture 2
- Do-while loops vs while loops
    - Scope is something to pay attention to and it can be practical to declare variables without assigning them just to make them available in the desired scope.
    - This can cause some problems however, take for example the following:
    `int n;
        while(n > 0)
        {
            printf("Give me a positive number: ")
            n = get_int();
        }`
    - At first this looks alright but when we first declare n it is UNDEFINED if not assigned some random garbage value that was stored in memory. It'd be more practical to use a do-while loop:
    `int n;
        do
        {
            printf("Give me a positive number: ")
            n = get_int();
        }
        while (n > 0);`
    - Here we get user input BEFORE checking the value, more stable logic.
- A design principle: consider `for (int i = 0; i < strlen(some_string); i++)`
    - On EVERY iteration of the for loop, we're reinvoking the function strlen which is costing us performance
    - It is most efficient to refactor as `for (int i = 0, n = strlen(some_string); i < n; i++)`
- C and strings
    - suppose we want to write our own strlen function--how the hell would we know if we're at the end of the string?
    - C always put a **sentinel or flag value** at the end of every string--represented as \0 (means 8 bits of 0s eg 1 byte of 0s). We can check for it in something like this 
        `while (s[n] != "\0")
        {
            n++;
        }`
- In the past we've been using `int main(void)` but there are other functions we can use:
    - `int main()`: function that expects unknown number of arguments or unknown types
    - `int main(void)`: function that expects no args.
    - `int main(int argc, string argv[])`: function expects argc number of arguments and argv[] arguments

- When writing multiple functions, their declarations are usually right at the TOP of the file and they all tend to follow the same pattern:
    - return-type name(argument-list)
        - return-type is what kind of primitive the funtion will output
        - name of func
        - set of inputs, each of which has a type and name
    - function DEFINITION is pretty much the same as declaration just with your curly braces

- Scope: why is it important to make a distinction between local and global vars?
    - local vars in C are **passed by value** in function calls; the callee receives a copy of the passed variable, not the variable itself

- Arrays
    - note that arrays in C are TYPE-specific and can only hold one type of data (in a contiguous memory location)
    - declared as: type name[size]
    - instantiation syntax: bool truthtable[] = {false, true, true }; when you instantiate an array this way, you don't need to declare the size, compiler will know
    - multidimensional arrays same syntax: bool truthtable[10][10]
    - we cannot assign one array to another; must iterate over to copy each el into it
    - Arrays in C are not passed by value, but **passed by reference**. The callee receives the actual array, which means it can be mutated!

- Command-line arguments
    - Note that when using the command line to run your program './program_name' does count as an argument

- Directing writing constants into your code can be referred to as using **magic numbers** -- we can made our code a little more readable if we store that magic number in a descriptive variable and use the variable instead
    - for (int i=0; i < 52; i++) can be re-written as...
    int deck_size = 52;
    for (int i=0; i < deck_size; i++)
- C provides a **preprocessor directive** (also called a **macro**) for creating symbolic constants:
    - #define NAME REPLACEMENT
- At the time your program is compiled, #define goes through your code and replaces NAME with REPLACEMENT

#### Lecture 3
- When composing a string, we MUST EXPLICITLY include room for the \0; if we do not, the last character of our string will be cut off due to lack of allocated memory!
- Big O (upper bound), Big Omega (lower bound); if upper bound and lower bound are the same, we use Theta
- `main` will return `0` by default and should return `1` if any error is encountered

#### Lecture 4
- In memory, the only thing we need to know when storing a string in a variable is the location in memory of the FIRST letter--we already know the string terminates with a sentinal character so our computer can just iterate through until it hits one
    - This is why we can't just compare two identical strings such as:
        `a = "hello"; b = "hello"; a == b => false;`
    - What's store in the variable is just a pointer to the first character (literally just a byte) in the array;
- string in C is just a synonym for char *;
    - '*' is the symbol to represent an address/location
    - char is because we are pointing to a character
- In order to actually copy a string we need to use the malloc to allocate the amount of bytes for it (including the \0 nul) and iterate over to copy them in
- Intro to pointer arithmatic:
    - We know that indexing into an array using square brackets is just syntactic sugar AND we know that `char *s = get_string("string : ");` is storing the MEMORY ADDRESS of the first char in the inputted string
    - We can iterate over this using a for loop..but to access every char we don't need to index into the array, instead we can leverage that memory address:
        `for (int i = 0, n = strlen(string); i < n; i++)
        {
            printf("%c\n", *(s + i));
        }
    - "*" has different meanings based on context in C (obviously multiplication):
        - If you see a data type before it, you are declaring a POINTER variable (so its the address of that kind of data type)
        - *() means go to that address
- Let's say we don't have the training wheels of get_int or get_string, how could we get user input?
    - We have a method called scanf()
        - `int x;
           printf("x: ");
           scanf("%i", &x);`
        - What's the ampresand though? It means get the address of something!
        - So scanf takes a format string to tell it what type of data to expect as well as the ADDRESS of the variable we'd like to assign it to
- Functions do not gain access to each other's memory spaces so it's important, when passing variables between functions, to update at the variables MEMORY ADDRESS as opposed to the copy reference that is passed

- NOTE: When declaring a pointer such as `char *s;` BE WARY. What that is doing is declaring a pointer to a space in memory. WE DON'T KNOW that occupies that space in memory, most likely some random garbage value. 
    - We are also not creating any space in memory for whatever the input will be, instead we just made a pointer to a random place in memory

- About pointers:
    - pointer and pointee are seperate -- don't forget to set up the pointee
    - dereferece(*) a pointer to access its pointee 
    - assignment(=) between pointers makes them point to the same pointees

- Call stacks: 
    - When a func is called, system sets aside space in memory for that function to do necessary work
        - Chunks of memory are normally called **stack frames** or **function frames**
        - Many functions stack frame may exist in memory at a given time
    - Frames are arranged in a stack and the frame from the most recently called is always on top; then a new fucntion call pushed a new frame onto the stack and when a function finishes its frame is popped off the stack
- File pointers:
    - The ability to read and write data to files is the primary means of storing **persistent data**
    - The abstraction of files that C provides is a data structure known as FILE
        - We will be using pointers to them, FILE*, almost universally
    - fopen()
        - opens file and returns file pointer to it
        - always check the return val to make sure you don't get back NUL
        - `FILE* example_ptr = fopen("file1.txt", <operation>);`
        - operations such as "r" read, "w" write, "a" append
    - fclose()
        - closes file pointer to by the given file pointer
        - `fclose(<file pointer>);`
    - fgetc()
        - reads and returns the next char from file pointed in
        - NOTE: the operation of the file pointer passed in as a param must be "r" for READ or you will suffer an error
            - `char ch = fgetc(<file pointer>);`
    - fputc()
        - Write or appends the specified character to the pointed-to file
        - Note: operation for the file pointer must be "w" for WRITE
    - fread()
        - Reads the qty units of size from file pointed to and stores them in memory in a buffer (usually an array) pointed to by buffer
        - `fread(<buffer>, <size>, <qty>, <file pointer>);`
        - With this we can move beyond writing char by char
        `double* arr2 = malloc(sizeof(double) * 80);
        fread(arr2, sizeof(double), 80, ptr);`
        - Note that, for an array, it's really just a pointer to address of first el, so we can just pass that in BUT for a single variable such as `char c` we need to pass the POINTER `&c`;
    - fwrite
        - Write qty units of size to the file pointed to by reading them from a bugger pointed to by buffer
        - `fwrite(<buffer>, <size>, <qty>, <file pointer>);`
- Pointers:
    - Pointers provide an alternative way to pass data between functions
        - Up to this point, we only passed data by value and when we do, we only pass a copy of that data
    - If we use pointeres instead, we have the power to pass the variable itself
        - that means a change made in one func can impact what happens in another func
    - Memory is just a huge array of 8-bit wide bytes
    - Data type to size (in bytes aka 8 bits)
        - int & float // 4
        - char // 1
        - double & long long // 8
    - Like every el in an array has an index, every piece in our RAM has an address for access
    - POINT ARE JUST ADDRESSES
    - Some examples:
        - `int k;` creating a 4-byte space for an integer
        - `k = 5;` assigning 5 to that space
        - `int* pk;` declaring a pointer to an integer
        - `pk = &k;` pk gets the address of k
    - A pointer: value is a memory address, type describes the data located at that address
        - As such, pointers allow data structures and/or vars to be shared among functions
    - Simplest pointer avail in C is the NULL pointer
        - This is quite handy because if we create a pointer and don't set it's value immediately, we should set it to NULL so it isn't pointing to some potential garbage value in memory
        - Can check for NULL-ness using (==)
    - A easy way to create a pointer is to simple extract to addy of a var. we can do this with the & operator
    - Main purpose of pointer is to allow us to modify or inspect location to which it points
        - we do this by **deferencing** the pointer
        - if we have a pointer-to-char called pc, then *pc is the data that lives at that address
        - used in this context, "*" is know as the **deference operator**
            - goes to refernece, accesses the data, allowing you to manipulate it
        - `int* px, py, pz` will create int pointer px, and two int vars py and pz
        - `int* pa, *pb, *pc` will create three seperate pointers
    - Back to a string, it DOESNT exist--it's just an alias for char* (so 4 or 8 bytes depending on your system/machine)
    
    - Dynamic memory allocation:
        - We can use pointers to get access to a block of dynamically allocated memory at runtime
            - Why important? We may not always know how much memory we need, what if we are dealing with user input?
        - This memory comes from a pool of memory called the **heap**--all prior memory we were working with came from the **stack** (same chunk just two different pools)
        - General rule: named vars live on stack, unnamed vars live on heap
        - We can get this dynamically-allocated memory by making calling malloc(), passing # of bytes requested; will return a pointer to that memory if it can, NULL if it cannot
        - EX:
            `int x;` vs `int *px = malloc(sizeof(int))`; (we use sizeof(int)) instead of explicitly declaring 4 for less magic numbers
            `float stack_array[x];` vs. `float* heap_array = malloc(x * sizeof(float));`
        - A warning..   
            - DA memory is not automatically returned to system for later use when the function in which it's created finishes execution.
            - failing to return memory back to the system when you're finished with it results in a **memory leak** which can compromise performance
            - when you finish working with DA memory you must `free()` it.
            `char* word = malloc(50 * sizeof(char));`
            `free(word);`
        - Three golden rules:
            - Every block of memory that you `malloc()` must be subsequently `free()`d
            - Only memory that you `malloc()` should be `free()`d
            - Do not `free()` a block of memory more than once
    - Hexadecimal:
        - **hexadecimal system**, a base-16 system, is a much more concise means to express data on a computer's system (0-9, a-f)
        - Mapping is easier because a group of four binary digits (bits) is able to have 16 different combinations, and each one of those maps to a single hexadecimal digit
        - We prefix them with 0x just as a marker for parsing
        - Why important? Used a lot for memory addresses which tend to be expressed in hexadecimal. 
## Lecture 5
-  malloc, calloc, realloc
    - malloc allocates memory, calloc clears (0s) entire chunk of memory, realloc is a little cooler
        - if you pass realloc() a pointer and new memory size, it will look for a new chunk of memory of the specified size and copy everything over for you
        - why's this cool? it allows us to construct dynamically sized ADTs; once we've reached our capacity, we can realloc the container and increase the amount of allocated memory.
- We can also leverage `typedef struct` to define objects and create more abstracted data types such as a linked list: 
    - `typedef struct node
        {
            int number;
            struct node *next;
        }
        node;`
    - and here's some new syntax:
        `// this is just a pointer named numbers that points to a node structure
        node *numbers = NULL;
        bool found = false;
        for (node *ptr = numbers; ptr != NULL; ptr = ptr->next)
        {
            if (ptr->number == number)
            {
                found = true;
                break;
            }
        }`
        - -> essentially means follow the pointer to the data structure and look at that property of the structure
    - Stack => LIFO (last in first out) // queue => FIFO (first in first out)
- Structures:
    - Structures provide a way to unify several variables of diff types into a single new var type
    - We use structures (`structs`) to group together elements of a variety of data types that have a logical connection
    - note that when defining a `struct` for example `struct car`, struct car is the name, not car 
    - Once we defined a structure, we typically do in top of file if not seperate .h file
    - We can access the various fields or members of that structure using the dot operator
    - Structures, like variables of all other data types, do not need to be created ont he stack. We can dynamically allocate structure at run time if our program requires it
        - In order to access the fields of structures in that situation, we first need to deference the pointer to the structure and then access fields. 
        - `struct car *mycar = malloc(sizeof(struct car));`
            - `(*mycar).year = 2011;`
            - `strcpy((*mycar).plate, "CS50");`
        - This is a little cumbersome though, there's a shorter way. The arrow operator makes this process easier, it does two things:
            - First, it deference the pointer on the left side of operator
            - Second, it access the field of the right side of operator
            - `mycar->year = 2011;`
- Defining custom types:
    - The C keyword `typedef` provides a way to create a shorthand or rewritten name for data types
    - The basic idea is to first define a type in the normal way, then alias it to something else
    `typedef <oldname> <newname>`  
    `typedef unsigned char byte` (now we just need to say byte whenver we want an unsigned char)
    - Even in the CS50 library did certain things become abstracted away, such as string!
        - `typedef char* string;`
    - typedef works great with defining custom data types because we can alias them to be less verbose
        - `typedef struct car car_t;` 
        - We can combine this into one single step too
            - `typedef struct car
                {
                    int year;
                    char model[10];
                    double engine_size;
                }
                car_t;`
- Linked Lists:
    - So far, we've only had one kind of data structure for representing collections of values: an array
        - but arrays aren't that flexible and can be costly when it comes to specific operations
    - A linked list node is a special kind of struct with two members:
        - data (char, int, float)
        - pointer to another node of the same type
        `typedef struct sllist
        {
            <VALUE> val;
            struct sllist* next;
        }
        sllnode;`
        - Note that, while defining this struct, we cannot use the typedef alias when defining members of the struct sllist

- Hash Tables:
    - Hash tables combine the random access of an array with the dynamism of a linked list
    - This means...insertion, deletion, and lookup can all start to lean towards \( \theta \ \Theta \)(1)
    - To do this, we need a structure whereby when we insert data into the structure, the data itself gives a clue where we will find it should we need to look it up
    - The trade off for these perks are that hash tables are not good at ordering or sorting data, but we won't always care about that in all cases
    - Combo of two things we're familiar with:
        - a **hash function** which returns a nonnegative int value called a hash code
        - an **array** capable of storing date of the type we wish to place into the data structure
    - Let's say we have a collision in our hash codes, for some odd reason our hash function yielded the same codes
        - One way we can do this is by **linear probing**; if we have a collision, we try to place the data in the next consecutive el until we find a vacancy (even if it means wrapping around to the beginning of the array)
        - subject to clustering however, with each collision increasing likelihood that cluster will grow. ultimately reducing our lookup time
        - resolution is chaining, each element in array is just a pointer to a linked list
- Tries:
    - So far ADTs mapping of key-value pairs (arrays have indices, value is data at that location; hash tables have a key of hash code of the data, value is a linked list of data hasing to that hash code)
    - Enter Tries..paths from a central root node that have a path via pointers to leaf nodes
    - Each node contains an array of pointers and our data. We 'traverse' the nodes to add or look up data by storing a piece of the key in each node. This creates a unique path (how we do handle collisions though?) of nodes, each holding segments of the key, the end of which has a pointer to a node that holds our data!
    - Look up and inseration are both in constant time, although extremely costly in memory 
- Stacks:
    - Commonly implemented as an array or linked list
    - golden rule is that most recently added element is that only element that can be removed (LIFO structure); push and pop API is le minimum.
    - note that if implemented with an array, we have a limited capacity
    - as opposed to deleting elements off our stack, we can just use a counter to determine where the 'top' is, effectively overwriting unused els as we push other els in
- Queue:
    - implemented as array or linked list--follows FIFO, data is enqueued to the end of the queue and dequeued from the front
    - because of this rule, we keep track of the size of our queue is order to track the 'oldest' el; to determine where to enqueue els, just add front + size % capacity
    - with linked lists; maintain pointers to head and tail of list, adding to tail and removing from head
- Bloom Filters:
    - A variant of hash tables, developed by Burton Bloom in 1970
    - Can quickly answer "Is this in the set?" "have I seen this before?"
    - BUT you can get false positives (says it's seen something when it hasn't)
    - constant time complexity for adding items and if they are present
    - Implementation:
        - we essentially have a fixed amount of buckets (imagine an array) full of false values--we have k independent hash functions each within the range of however many buckets we have
        - We run our data through each hash function--and updating the false value to true in the index of each hash code result (so "cow" hashes to 5 and 8--we mark index 5 and 8 as true)

- When weighing what ADT to use and when:
    - Arrays:
        - Insertion is bad -- lots of shifting els (let's say if we have to add to the middle of the array as opposed to the end)
        - Deletion bad -- shifting after removal (same case)
        - Lookup is good -- random access, constant time (if we have an index)
        - Ok to sort but stuck with a fixed size, no flexibility
    - Linked lists
        - Inserted is easy-- just add to frnt
        - Deletion easy- once you find the el
        - Looking is costly and relies on linear search
        - Difficult to sort--unless you want to sacrifice really fast insertion, you'd have to traverse entire structure to sort as you construct
        - Relatively small size but larger than arrays
    - Hash tables
        - inseration is two-steps--hash then add
        - deletion is easy--once el is found
        - look up is on average better than linked lists because you are splitting an nth linked list into x amount of segments
        - not ideal ADT if you if sorting is goal, array is better
        - more space costly than linked list
    - Tries
        - insertion is complex-lots of dynamic memory allocation, but it is a fixed amount of operations and becomes less as ths structure is built out
        - deletion is easy--just freeing a node
        - fast look up
        - already sorted -- sorts as you build in most cases
        - become ginormous in very little time

- Tour a Makefile
    - `CC = clang` - specifies we should use clang for compiling

## Lecture 6
- Classic question: What happens when we type facebook.com
    - Back in the day we used 'www.' to indicate this was for a website
    - HTTP is a protocol that determines how the clients talks to the web server
- IP addresses is 4 ints from 0 to 255 (EX: 0.0.0.0, 255.255.255.255) -- 32-bits
- DCHP -- another protocol that actually has a device send request for an IP address and a server responds, assigning one from an available pool of addresses
- `nslookup WEB-ADDRESS` command will get us the IP address of a specific web address
- `traceroute WEB-ADDRESS` see the path of routers from origin to destination
- How does a server know what the request/type of information is? We need another piece of info: TCP (Transmission Control Protocol) => there is a list of different codes that specify what info we have or what we want to do
- Sometimes packets of information get lost on the way; buffers can overload or many requests can be happening at once
    - TCP comes into play; each fragment of information will be numbered or ordered and the TCP protocol will make ANOTHER request for any envelope that didn't make it

- A quick overview:
    - IP Address: just a means for your machine to uniquely identify itself to send and receive information
    - If each IP Address is 32-bits, there's roughly 4 billion addresses. We've been slowly phasing out 32-bit address and moving to 128-bit ones (IPv4)
    - DHCP
        - How do we get an IP address? Somewhere between your machine and internet is a DHCP (Dynamic Host Config Protocol) server that assigns them
    - DNS
        - DNS (Domain Name System) helps us translate IP addresses to more memorable names. Like the yellow pages of the web
        - DNS servers are largely de-centralized
    - Access Points
        - IP address assigned to a router, whose job it is allow data requests for all devices on your local network to be processed through a single IP address
        - Modern networks have access points that combine multiple technologies while business wide-area networks (WANs) still have seperate devices to allow easier scaling
- IP:
    - Internet is just an interconnected network of smaller networks woven together and agreeing upon mutual communication
    - They communicate via IP (Internet Protocol)
    - We still greatly rely upon phyiscal, wired, connections to transmit large volumes of data and there's no way we can connect EVERY network to every other network
    - But we still need every network to talk to each other and this is where **routers** come into play
        - each network connected to X amount of routers, which are in turn connected to some other networks and routers, and each router has intructions built in on how to move the info to its destination
        - this routing info is usually stored in a routing table, inside the router
        - Another crucial part of IP is splitting data into **packets**
            - sending large data packets has potential to create a ripple effect to that would throttle the network for all others
            - also, if anything gets lost, we lose ALL the data, smaller packets is faster and allows us to easily replace a packet if it gets lost for some reason
        - IP is a connectionless protocol. Not a strictly defined path from sender to receiver
            - Means that, in response to traffic that might be clogging up one route, packets can be "re-routed" around the jam to follow the optimal path, based on the current state of the network
- TCP: 
    - Tramission Control Protocol
    - IP is protocol for getting info from sending machine to reveiving machine, TCP is directing trasmitted packet to the correct program on the receiving machine
    - Important to know BOTH where the receiver is and what the packet is so TCP and IP are practically inseparable pair: TCP/IP
    - TCP **guarantees** delivery
        - Does so by including how many packets receiver should expect, the order of them, and transmits that info alongside the data
    - Each program/utility/service is assigned a **port number** so coupled with an IP address, we can now uniquely identify a specific program on a specific machine
        - EX of standardized port #s: 
            - FTP (file transfer) port 21
            - SMTP port 25
            - DNS port 53
            - HTTP port 80
            - HTTPS 4443
    - Steps of TCP/IP
        - When program sends data, TCP breaks it into smaller chunks and communicates packets to network, adding TCP layer onto the packet
        - IP routes each packet, from sender the receiver, wrapping it with the IP layer (where its going)
        - When received, TCP looks at header to see which program it belongs to, and since routes of the packets may differ, TCP must also order the packets when preseting them to their destination
    - If any pointer, a router using IP drops a packet, TCP would use the additional info inside the headers to request a replacement packet
    - After packets arrived, TCP ensures they're organized and can be reassmbled, then delivers to the correct service
- HTTP: 
    - Hyper Text Transfer Protocol
    - In addition to protocols that dictate how info is communicated from machine to machine or app to app (IP and TCP, respectively), it is often that the program itself has a set of rules for how to interpret data that was sent
    - HTTP is one such ex of an **application layer protocol** which dictates format by which clients request web pages from a server and the format via which servers return info to client
    - Other app layer protocols:
        - FTP
        - Simple Mail Transfer (SMTP)
        - Remote Desktop (RDP)
    - EX of HTTP request line:
        - method request-target http-version

## Lecture 7 Dynamic Programming
- Name designed to sound cool to RAND management and US Dept of Defense.. a more descriptive name is a look-up table
- A way of looking at certain kind of problems (a category of algorithms):
    - I end up asking the same question over and over, so rather than doing that work all over, we save the answer and just look it up for when we're asked again
    - An example:
        - for (int i; i < strlen(str); i++)
            - we're asking to calc strlen each iteration, easier to just store length in a var for later look up!
- Note that, in each example case, we HAVE to fill out the entire table, this may be n^2 cells but that's way less than doing EVERY possible combination
- Example of this is Image Composition, Seam Carving, DNA strand matching

## Lecture 8, Lecture 9 Python
- What we've done previously: source code => compiler (clang) => machine code
- In Python, source code => (compiler => byte code =>)interpreter; Python is both the name of the language and name of the program used to interpret
- In C, it's convention to for your program to automatically invoke the `main` function; in Python, you need to explicitly invoke `main`
- In C, single quotes for char, double quotes for string; in Python, they're equivalent
- Before we just had comments, denoted using "#"; we also have these nifty doc-strings in Python that we denote using """Some comment"""
    - These comments can be rounded up and used to create a doc file, which is like a user's manual for what all your functions do, what values they return, etc.
    - A useful way to comment on all your methods
- Previously, we had a prototype of all our functions we were going to use. This was because clang did not know a function existed until it sees it, so when a func was being called in main, we'd error out because we hadn't seen it yet!
- 2 ways of importing CS50 library:
    - `from cs50 import function_name` // `from cs50 import *`
        - The second one is BAD practice, potential collisions/shadowing of variables as you're importing everything into the namespace
    - `import cs50` is safer, you just have to invoke methods through the cs50 obj, cs50.get_int()
- C ints are 32-bits, Python ints are 64
- Fundamental feature of Python: named parameters!
    - `print("??", end="")`
    - When calling a function, we don't name them as we pass them in, but in Python, if a function takes multiple args, you can explicity name them
    - This is GREAT because it means that ordering of arguments in a function call don't matter if you explicitly name them!
- web server is just a program running on a physical machine, that listens for http requests and responds to them
- Python supports tuples! EX:`tuple = ("0.0.0.0", 800)`
- We'll be using Flask (a mini framework) and it is a library that we import (`from flask import Flask`) and software that we can call from the command line `flask run`
- Python:
    - Inspired by C (Cpython, primary interpreter, written in C)
    - We learn' Python 3 up in here!
    - Only declare variables by initialization (must assign a value to it)
    - Python arrays (known as lists) are not fixed size, they are dynamic and you can mix types
    - The interpreter reads your code from top to bottom so there's no need for a `main` func. If you do, you must have this line `if ___name___ == "__main__": 
        main()`
    - style is CRUCIAL to Python--tabs and indentation mean something so you must be attentive when writing your code
    - to invoke python interpreter in terminal `python <file>`
- Flask:
    - Python has native functionality to support networking and more, so you can write backends in Python
    - web frameworks make it even easier, abstracting away the minutia of Python's syntax and providing helper functions
    - getting started:
        in an application.py or whatever other name you want for it..
        - `from flask import Flask` importing the Flask class
        - `app = Flask(__name__)` initiate the app, __name__ just means the file, so create a Flask app based on whatever file this line of code appears in
        - then just add funcs that define the behavior of the app
        - to run it in IDE is simple too
            - `export FLASK_APP=application.py
               export FLASK_DEBUG=1
               flask run`
    - Data can be passed in via URLs as well as forms
        @app.route("/show/<number>")
        def show(number):
            return "You passed {}".format(number)
- SQL:
    - SQL is the language, MySQL is the open source platform which you can establish the type of relational DB that SQL is most adept at working with
    - Many installs of SQL come with a GUI tool called phpMyAdmin to make it more user friendly
    - CHAR in SQL: not a data type, it's a fixed-length string
    - VARCHAR is specified by a MAXIMUM possible length of a string that can be stored
    - SQLite can store all these things but it groups them into more generalized, overarching affinities
    - INSERT, SELECT, UPDATE, DELETE -- pretty much only opereations you'll ever need
    - We can split tables up and design them in a way where we can JOIN them temporarily to do more complex queries with more efficiency

## Lecture 11: JavaScript
- big difference we see between JS and Python is the existence of lamda functions (anonymous functions). but we have do while loops again!
- Allows us to make adjustments to the DOM after code has left our server and loaded onto client's browser
- When working on forms, we can give our input fields name attributes and can easily access them through dot notation just by having selected the form
- AJAX: browsers executing http requests after the page has initially loaded and leverages an important JS feature, callbacks!
- another global object in the browser othan that `document` is `navigator` -- comes with a big API to use geolocation services
- JavaScript:
    - Objects are a lot like structs in C, but objects can have METHODS `function (object)` vs `object.function()`
    - we still have for loops but we can use diff syntax to dictate what we want to iterate over
        - for each ONLY for arrays, can iterate the els as well as index
        - for in is for iterating through properties of an object, gives access to the keys
        - for of for iterating over "iterable collcetions" like arrays, strings, NodeLists
- AJAX:
    - Async JavaScrpt and XML allows use to dynamically update a webpage even more dynamically!
        - just a small portion of page is updating as opposed to ENTIRE page
    - central to this ability is using a special JS object called XMLHTTPRequest
        - once have this obj, we have to define its `onreadystatechange` behavior (this is a func that is called when the async HTTP request has completed)
