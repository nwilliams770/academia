## Topics
* Concurrency and Parallelism [source](https://medium.com/rungo/achieving-concurrency-in-go-3f84cbf870ca)
* Channels [source](https://medium.com/rungo/anatomy-of-channels-in-go-concurrency-in-go-1ec336086adb)
* Goroutines [source](https://medium.com/rungo/anatomy-of-goroutines-in-go-concurrency-in-go-a4cb9272ff88)
* Stack and Heap [source](http://net-informations.com/faq/net/stack-heap.htm)
* Go Method Sets [source](https://stackoverflow.com/questions/33587227/golang-method-sets-pointer-vs-value-receiver) | [source](https://stackoverflow.com/questions/19433050/go-methods-sets-calling-method-for-pointer-type-t-with-receiver-t?rq=1)
* Go's Scheduler [source](https://rakyll.org/scheduler/)
* Context package

---

### Stack vs Heap
**Stack:**
* Special region of your computer's memory (RAM) that stores temporary variables created by each function
* LIFO (Last In, First Out); like stacking trays or plates, the first to be placed on top is first to be removed
    * Every time a function declares a new var, it is pushed onto the stack
    * Every time a function exits, all the vars pushed onto the stack by the function are freed (e.g. popped off the stack, deleted)
* Grows and shrinks as functions push and pop variables
* No need to manage memory yourself, varaibles are allocated and freed automatically
* Has size limits
* Stack variables are local in nature, they only exist while the function that created them is running

Stack as an ADT:
* Pretty much the same, it's a linear Last In First Out data structure. 
* Push and Pop operations to add and remove respectively
* Because it is LIFO, we only need to maintain a pointer on the most recently added element e.g. the top of the stack
* Vs. a queue
    * Queue is also linear but with two sides: the rear, where elements can only be inserted, and the front, where elements can only be deleted/removed
    * Follows First In First Out principle
    * Enqueue and Dequeue operations to add and remove, respectively
    * Must always maintain two points: one to the element at the beginning of the queue and the last element in the queue, elements at the front and rear

**Heap:**
* Region of computer's memory that is not managed automatically for you, and is not as tightly managed by the CPU, more free-floating region of memory
* Because memory is not automatically managed, we risk memory leaks; memeory set aside that is not released/freed-up when done
* No size restrictions on variable size (unlike stack)
* Slower read/write because one has to use pointers to access memory on the heap

Heap as an ADT:
* Tree-based data structure in which tree is a complete binary tree. 
    * full binary tree is all nodes other than leaves have 2 children. **complete** binary tree is a binary tree in which every level, except leaves, is completely filled (e.g. has data) and as far left as possible.
* Generally 2 types:
    * Max-heap: In a Max-Heap the key present at the root must be thr greater among the keys present at all of it's childen. Must be tree for all sub-trees
    * Min-heap: Key at the root must the minimum, same for sub-trees
* When adding to a heap, to maintain its properties of shape and structure, we must only ever add a node at the **left-most available** spot at the lowest level (sometimes we must swap nodes in order to maintain the max-/min- structure) 



**Stack vs Heap: Pros and Cons**
* Stack:
    * Fast access
    * Don't have to explicitly de-allocate vars
    * Space managed efficiently by CPU, memory will not become fragmentedd
    * local vars only
    * limit on stack size (OS-dependent)
    * variables cannot be resized
* Heap:
    * vars can be accessed globally
    * no limit on memory size
    * (relatively) slower access
    * no guarantee of efficient use of space, memory may become fragmented over time as blocks of memory are allocated then freed.
    * you must manage memory

---

### Method Sets
* Quick review:
    * **Referencing**: Taking the address of an existing variable and, using the `&` operator, setting a pointer variable
    * **Dereferencing**: Dereferencing a pointer means, using the `*` operator, to retrieve the value from the memory address that is pointed by the pointer.
* This section is mainly concerned with this question: Why do T and *T have different method sets?
* Go spec says: "The method set of any other type T consists of all methods with receiver type T. The method set of the corresponding pointer type *T is the set of all methods with receiver *T or T (that is, it also contains the method set of T)
    * T has its own method set, while *T has its own method set plus the method set of T, because it can dereference receiver *T to T and call the method. Therefore, we can call some method with receiver *T of variable type T
* You cannot call a method of *T on T, but the compiler is smart enough to take the reference of the variable for you
    * From docs: "A method call x.m() is valid if the method set (of the type of) x contains m and the argument list can be assigned to the parameter list of m. If x is addressable and &x's method set contains m, x.m() is shorthand for (&x).m()
    * To highlight this, a return value (in this case one that returns a value of type T), which is non-addressable, will error out in this case because we cannot use the reference operator to get the pointer as there is no address in memory yet

---

### Concurrency and Parallelism
General Topics:
* Concurrency vs Parallelism
* Computer Processes and Threads
* Threads vs Goroutines

Concurrency: The ability to **deal with** multiple things at once
* By dividing CPU time on single-core machines, we achieve the sensation of doing multiple things at once while we are in reality doing one thing at a time

Parallelism: The ability to **do** multiple things at once
* Multi-core machines can do things in parallel
* Go recommends using goroutines on one core only but we can modify a Go program to run goroutines on different processor cores if we want

If we want to understand and effectively use Go's architecture of concurrency, we must look at computer processes:
* When a program is run, OS is responsible for allocate memory address space for process' heaps and stacks, a program counter, a process id (PID)
* A process is a container than has compiled the code, memory, different OS resources, essentially a program in the memory
    * has at least one thread (primary thread), when primary thread is done, process exits.
    * `stack` is memory set aside as `scratch space` (temporary space in memory) for a thread of execution
    * a stack is created at compile time and usually of a fixed size, 1-2MB and can only be used by its corresponding thread
    * a `heap` however is a shared memory space where data from one thread can be accessed by other threads as well

Threads:
* We talked about dealing with multiple things vs doing multiple things, a "thing" here is an activity performed by a thread
* **Multithreading**: Multiple things happening concurrently or parallelism, multiple threads runnin in series or parallel
    * Where multiple threads are spawned in a process, a thread with memory leak (failure to release discarded memory) can exhaust resources of other thread and make process irresponsive
* **Thread scheduling**: execution of multiple threads in some order
    * used when coordinating multiples threads that might share some data so that only one can access particular data at a time
        * multiple threads trying to access/change data at the same time will cause a race condition
    * OS threads are scheduled by the kernel (the core of a computer's OS, with complete control of everything within the system)

Concurrency in Go:
* Unlike Java, which has a traditional thread class which can be used to create multiple threads in a given process, Go provides the `go` keyword
    * function calls preceded by `go` will be run in a new goroutine
        * goroutines behave like threads but are technically abstractions over threads
* When we run a Go program, Go **runtime** (runtime library that is part of every Go program) creates a few threads on a core on which goroutines are multiplexed (spawned)
    * One thread executing goroutine and if that goroutine is blocked, it will be swapped for another goroutine to execute on the thread
        * Like thread scheduling by handled by Go runtime
* You can use `GOMAXPROCS` environ var or call `runtime.GOMAXPROCS(n)` to divide goroutines among available CPU cores

Threads vs Goroutines:
* These points can shed some light why goroutines are cheaper and a key solution for achieving the 'most concurrent' applications:
    * **Thread** (OS):
        * Managed by kernel and hardware dependencies
        * Generally, fixed stack size, 1-2MB
        * Stack size determined during compile time and is fixed
        * No easy medium to communicate between threads
        * Identified by TID
        * Significant setup and teardown cost as thread must request lots of resources from the OS and return them when done
        * Preemptively scheduled [more](https://stackoverflow.com/questions/4147221/preemptive-threads-vs-non-preemptive-threads)
    * **Goroutine**
        * Managed by go runtime library and no hardware dependencies
        * Typically 8KB of stack size
        * Stack size of go managed in runtime and can grow, up to 1GB, possible by allocating and freeing heap storage
        * goroutines use `channels` to communicate with other goroutines with low latency
        * goroutines have no identity
        * created and destroyed by go runtime. Cheap compared to threads as go runtime already maintains the pool of threads for goroutines. Os is not aware of goroutines
        * cooperatively scheduled
---

### Go's work-stealing scheduler
* Job of the Go scheduler is to distribute runnable goroutines over multiple worker OS threads that runs on one or more processors
* In multi-threaded computation, two paradigms have emerged:
    * **work-sharing**: When a processor generates new threads, it attempts to migraete some of them to other processors with the hopes of them being utilized by idle/underutilized processors
    * **work-stealing**: An underutilized processor actively looks for other processor's threads and "steals" some
* Migration of threads occurs less frequently with work stealing than work sharing. When all processors have work to run, no threads being migrated. And as soon as there is an idle processor, migration is considered.

Scheduling basics:
* Go has an M:N scheduler that can also utilize multiple processors. At any time:
    * M goroutines need to be scheduled on N OS threads that runs on at most GOMAXPROCS numbers of processors. 
    * Scheduler uses following terminology:
        * Go: goroutine
        * M: OS thread (machine)
        * P: processor
* There is a P-specific local and a global goroutine queue. Each M should be assigned to a P. Ps may have no Ms if they are blocked or in a system call.
* At any time, only one M can run per P. More Ms can be created by scheduler if required.
* Each round of scheduling is simply finding a runnable goroutine and executing it. The search happens in the following order:
```go
runtime.schedule() {
    // only 1/61 of the time, check the global runnable queue for a G.
    // if not found, check the local queue.
    // if not found,
    //     try to steal from other Ps.
    //     if not, check the global runnable queue.
    //     if not found, poll network.
}
```
* Once runnable G is found, it is executed until it's blocked

Stealing:
* newly created Gs or existing Gs that become runnable are pushed onto a list of runnable goroutines of current P
* When P finishes executing G, it tries to pop a G from own list of runnable goroutines
    * If list is now empty, P chooses a random other processor (P) and tries to steal a half of runnable goroutines from its queue

Spinning threads:
* The scheduler always wants to distribute as much as runnable goroutines to Ms to utilize the processors but at the same time we need to park excessive work to conserve CPU and power. Contradictorily, scheduler should also need to be able to scale to high-throughput and CPU intense programs
* Constant preemption is expensive and a problem for high throughput programs if performance is critical
    * OS threads shouldn't frequently hand-off runnable goroutines between each other, it leads to increased latency
    * In the presence of syscalls, OS threads need to be constantly blocked and unblocked, costly and lots of overhead
* In order to minimize the hand-off, Go scheduler implements **spinning threads**
    * Spinning threads consume a little extra CPU power but minimize the preemtion of the OS threads, a thread is spinning if:
        * An M with a P assignment is looking for a runnable goroutine
        * An M without a P assignment is looking for available Ps
        * Schedule also unparks an additional thread and spins it when it is readying a goroutine if there is an idle P and there are no other spinning threads
    * At most GOMAXPROCS spinning Ms at any time. When a spinning thread finds work, it takes itself out of spinning state
    * When new goroutines created or an M is being blocked, scheduler ensures there is ay least one spinning M
        * ensures that no runnable goroutines that can be otherwise running and avoids excessive M blocking/unblocking

* Scheduling events can be traced by the execution tracer. You can use it to investigate if you believe you have poor processor utilization.

---

### Goroutines (Anatomy of a Goroutine)
* As goroutines are lightweight compared to OS threads, it is common for a Go app to have thousands running concurrently

What is a goroutine?
* Simply a function or method running in the background currently with other goroutines
* When we call a function or method with the `go` prefix, it executes in a goroutine

* By default every Go app creates one goroutine, the **main goroutine** that the `main` function operates on
    * goroutines are scheduled coopereatively therefore, go scheduler will not pass control to other goroutines until explicitly specified, the main goroutine is put to sleep (time.Sleep) or blocked, or it executes completely
        * this can be demonstrated by trying to print something from another goroutine, we will not it on the console because once main executes, the program exits too
    * we can't just use `time.Sleep` in production though, we don't know how long our goroutines will takes and this is where channels comes into play

* Noteworthy to state that like, functions, we can anonymous, immediately invoked, goroutines

---

### Channels (Anatomy of a Channel)
* A communication object using which goroutines can communicate with each other, a data transfer pipe where the data can be passed into or read from
    * One goroutine can send data into a channel while other goroutines can read that data from the same channel
    * A channel can only transport data of **only one data type**
* We declare a channel using `chan`, zero-value of channel is `nil` so it will be set to that by default. To create a ready-to-use channel, we must use `make` as well
    * `c := make(chan int)`
        * notice that when you print this channel, it looks like a memory address; channels by default are pointers
        * we can mostly communicate with channels by passing them as arguments to functions or methods
        * `<-` to read and write from a channel, can also use it with other operators to short-hand assignment:
            * `var data int | data = <- c` OR `data := <- c`
        * Channel operations blocking in nature
            * when data is written to channel, goroutine is blocked until some other goroutine reads it from that channel
            * channel operations tell the scheduler to scheduler another goroutine

Deadlock:
* If a goroutine is blocked and there are no other goroutines available to pass control to, that's where a `deadlock` error occurs crashing the whole program
    * "If you are trying to read data from a channel but channel does not have a value available with it, it blocks the current goroutine and unblocks other in a hope that some goroutine will push a value to the channel. Hence, this read operation will be blocking. Similarly, if you are to send data to a channel, it will block current goroutine and unblock others until some goroutine reads the data from it. Hence, this send operation will be blocking."

Closing a Channel:
* Goroutines that are reading channels can check if the channel is still open e.g. values can still be read from it: `val, ok := <- <channel>` 
* A channel can be closed using the built-in `close` function; `close(<channel>)`

* When dealing with reading multiple values sent through a channel, inifnite for loop syntax, `for{}` can be used
```golang
func squares(c chan int) {
    for i := 0; i <= 9; i++ {
        c <- i * i
    }

    close(c)
}

func main() {
    fmt.Println("main() commence")
    c := make(chan int)

    go squares(c)

    for val := range c {
        // Note how we are using `for val:= range c` instead of `for{}`; `range` will read the value from the channel one at atime until it is closedd.
        fmt.Println(val)
    }

    fmt.Println("main() stopped")
}
```

Buffer size or channel capacity:
* The second param of the `make` function is the capacity of a channel or the buffer size. By default, a channel buffer size is 0 and is also called an **unbuffered channel** e.g. whatever written to the channel is immediately available to read
* What is our buffer wasn't zero?
    * Goroutine is blocked until after buffer is full and a new value is attempted to be added (that is to say, a channel of buffer size 3 will not block the goroutine until a *fourth* value is attempted to be addded to it)
    * When full, any value sent to channel is added to buffer by throwing out last value in buffer which is available to read.
    * Note that reading is a thirsty operation, when it begins, it will not stop until buffer is entirely read and that you are not prevented from reading from a buffer that isn't entirely full
* Similar to a slice, a buffered channel has a length and capacity:
    * length is number of values queued in channel buffer while capacity is buffer size
    * use `len` and `cap` to check these just like slices
* Using buffered channels and the `for range` syntax, we can read from closed channels. Data still lives in the buffer of a closed channel so we can read it.

Unidirectional channels:
* We've only seen channels where we can do read and write operations but we can create unidirectional, read-only or send-only channels, NOTE *these channels are different types than a read-send channel*
    * `roc := make(<-chan int)`
    * `soc := make(chan<- int)`
* Why use unidirectional channels? It increased the type-safety of a program, making it less prone to error

Anonymous goroutine:
* We can implement channels with anonymous goroutines as well, just something to keep in find out there in the field

Channel as a data type:
* channels are first-class values and can be used anywhere like other values. We can even implement channels that send/receive other channels

Select:
* `select` used to perform an operation on only one channel out of many, conditionally selected by `case` blocks
* Just like `switch` but instead of boolean operations, we add channel operations like `read`, `write`, or a fix of `read` and `write`
* Blocking except when it has a default case
    * default case is non-blocking and the entire select statement is non-blocking if there is a default case
    * default cases are useful when there are no channels available to send or receive data and avoid deadlocks

Adding timeout:
* Available services should response in a timely manner so we can have the default case be run after a set amount of time
* This can be implemented with a `case` with a channel operation that unblocks after defined time
    * logical provided by `time` package's `After` function: `case <-time.After(2 * time.Second)`

WaitGroup
* Let's say we want to know if all goroutines finished their jobs
* We can do something somewhat opposite to a `select` statement, *all* conditions need to be true instead of just one
* We can leverage `WaitGroup` to track our goroutines and the 

Worker pool:
* A collection of goroutines working concurrently to perform a job/task.
* In `WaitGroup` we saw a collection of goroutines woring concurrently but they did not have a specific job, with channels in that WaitGroup there's some job to do and it becomes a worker pool

Mutex:
* each goroutine has their own stack therefore do not share any data between themselves but there might be race conditions when some data in heap is shared between multiple goroutines.
    * long story short is that you shouldn't rely on Go's scheduling algorithm and implement your own logic to synchronize different goroutines
* One way to go about doing that is implementing the mutex
    * Mutex (mutual exclusion) is a programming concept where only one routine (thread) can perform multiple operations at a time.
        * the routine acquires a lock on the value, does whatever it needs to do, then releases the lock

**Concurrency Patterns:**
*Examples of these two patterns are both in the [source](https://medium.com/rungo/anatomy-of-channels-in-go-concurrency-in-go-1ec336086adb)
Generator:
* Generating large amounts of data can be computationally expensive so we can use channels to do the generatiion of sequences concurrently such as fibonacci sequences

Fan-in & fan-out:
* fan-in: multiplexing strategy where inputs of several channels are combined to produce an output channels
* fan-out: demultiplexing strategy where a single channel is split into multiple channels

---

### Context [source](https://blog.golang.org/context)
* In Go servers, each request handled by its own goroutine, which often start additional goroutines to access backend databases and services.
* If a request is cancelled or times out, all goroutines working on that request should exit quickly so the system can reclaim any resources they are using (this can be called "leaking goroutines")

Enter the `context` package:
* easy to pass request-scoped values, cancelation signals, and deadlines across API boundaries to all goroutines pertaining to the request





### Lesson 1: Dev Environment
You will learn:
* Go workspace
* IDE's
* shell / bash commands (for unix, linux, mac)
* environment variables

General topics:
* GUI: graphical user interface
* CLI: command line interface
* Terminal: text input/output environment 
    * console: physical terminal
    * in unix, linux called shell or bash
    * in windows command prompt, windows command, cmd, dos prompt
* Instruction set architecture: Instructions given to CPU and the corresponding OS which is written to make that system operate
    * x86 (32-bit) or x86-64 (64-bit version e.g. 64 bits can be processed at a time by your machine)

**Go workspace**
Workspace (how computer and code is organized) in Go is quite opinionated for efficiency and team optimziation:
* one folder, any name, any location, needs:
    * bin: binary (compiled)
    * pkg: archived folders, e.g. pre-compiled code that hasn't changed since last compilation
    * src: namespacing, package management
        * github.com
            * \github.com username\
                * folder with code / repo
* `go get` used for package management
* GOPATH points to your go workspace
* GOROOT points to your binary installation of Go


* Let's go over the anatomy of a channel :
    * Declare a new chan using `chan`, `var c chan int` but this will yield a `<nil>` channel. We must declare a channel using `make` to use it, `c := make(chan int)`
    * A channel may transport one and only one data type
    * Channels by default as pointers. Mostly, when you want to communicate with a channel, you pass it as an argument to the function or method, so when the goroutine receives that channel as an arg, no need to dereference it to push or pull data from that channel
    * Read/write from channel using `<-`, `c <- data`, `data := <- c` or `var int data ... data <- c`
    * Channel operations are blocking in data!
        * When data written to the channel, goroutine is blocked until some other goroutine reads it from what channel (like a relay race, they have to pass at the exact same time)