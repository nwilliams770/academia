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