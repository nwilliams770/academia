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