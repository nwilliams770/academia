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