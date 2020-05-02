## Ch 3: Variables and Expansions
### What is expansion?
* We need a way to make our commands more dynamic, turning them into a sort of a template for how to perform actions that can re-use over and over
* Expansion is the practice of replacing part of our command code with a situationally specific piece of code

### Pathname Expansion
* We can replace pathnames with a pattern that tells bash to expand the pathnames for us.
* Important to note that the command will never even see our pathname expansion pattern; it is evaluated and expanded by bash well before the command starts.
    - Expansion is always performed by bash itself and always before running the command
* To perform a pathname expansion, we write a syntactical **glob pattern** in place of where we want to expand pathnames. A glob is the name of the type of pattern supported by the bash shell
* Some patterns
    - `*`: matches any kind of text or even no text at all
    - `?`: matches any one single char
    - `[characters]`: a set of chars within rectangular braces matches a single char, only if it's in the given set
    - `[[:classname]]`: specify name of a class of chars instead of having to enumerate each char yourself. Bash knows about various char classes. some char classes: `alnum`, `alpha`, `word`, etc.
* We can combine these glob patterns together to describe all sorts of pathname combos and also with literal chars to tell bash that part of the patterns should include exact text.
* Also notee globs will never jump into subdirectories, only in their own; if we want a glob to go look at pathnames in a diff directory we have to provide a literal pathname
* Bash also has built support in more advanced glob patterns, extended globs.

### Tilde Expansion
* Replacing a tilde, `~` in a pathname with the path to the current user's home directory
* Can also expand home directory of another user by putting username right after tilde: `~someotherusername`

### Command Substitution
* Command substiution is a popular method of expanding data into command args. Essentially write a command within a command and ask bash to expand inner command into its output and use that output as arg data for the main command.
* Value expansions allow us to expand data into command args. Fairly consisteent syntax, all starting with `$`
* Command substitution essentially expands the value of a command that was executed in a subshell. As such, syntax is combo of val-expansion prefix `$` followed by the subshell to expand: `(...)`
    - a subshell is essentially a small new bash process used to run a command while main bash shell waits for the result


* Aside with single and double quotes: all value expansions ie. all syntax with a `$` prefix, can only expand inside quoted arguments if the argument was *double-quoted*. Single-quotes will turn `$` syntax into literal chars
    - A warning: "Never leave a value expansion unquoted. If you do, bash will tear the value apart using word-splitting, delete all whitespace from it and perform hidden pathname expansion on all the words in it!"

### How do I store and re-use data? / Bash parameters
* bash params are regions in memory where you can temporarily store some info for later use.
* Not unlike files, we write to these params and read from them later but unlike files, we're using system memory not disk to write info so access is much faster.
* types:
    - positional params
    - special params
    - shell variables

### Shell Variables
* Essenetially a bash param that has a name. Store info in them through var assignment and access that info later using parameter expansion
`name=nwilliams`
`echo "Hello, $name. How are you?`
`echo "Hello, ${name}. How are you?`
* Note param expansions allow you to wrap curly braces around your expansions to tell bash beginning and end of your param name is. Usually optional but sometimes a necessity!

* Assignment used `=` operator. No syntactical space around operator, other languages permit it, bash does not!
`name = nwilliams` #Run command `name` with arguments `=` and `nwilliams`

* We can combine assignment and other value expansions:
`contents="$(cat hello.txt)`

* While expanding a parameter, it is possible to apply an operator to the expansing value which can modify the value in many useful ways. It only changes the value that is expanded, it does not mutate the value in your variable
* In summary: Shell variables are params you can freely assign values to. Done using `=` operator. Params can be expanded to inline their data into a command's arguments, done with `$` symbol but sometimes needing to be wrapped by `{}`. Param expansions should ALWAYS be double-quoted for consistency and to prevent any potential white-space ein them from causing word-splitting in addition to triggering unexpected pathname completion. When expanding, you can apply a special param expansion operator to mutate the expadned value in any way.

* Appending a shell var:
`greeting=hello`
`greeting="$greeting world`
`greeting+=" world"`

### Environment Variables
* Two separate spaces where vars are kept. The first is shell vars. Second is the process environment
* Unlike shell vars, env vars exist at the process level. Means they are not a feature of the bash shell but rather a feature of any program process on your system.
* You can store variables in the env and you can store vars in the shell. The env is something EVERY process has, while shell space is only avail to bash processes. As a rule, you should put your vars in the shell space unless you explicity require the behavior of env vars.
* When you run a new program from the shell, bash will run it in a new process which will have its own env. But unlike shell processes, ordinary processes do not have shell vars, only env cars.
* More importantly when a new process is created, its env is populated by making a copy of the env of the creating process

* Falsity that the env is a system-global pool of vars that all processes share, often believed to be true as a result of seeing same vars avail in the child process.
* When you create an env var in the shell, any child process created after will inherit this var as a reesult of being copied over from your shell into child's env. However, since env is specific to each process, changing or creating new vars in child will not affect the parent

* While most vars will be shell vars, you may want to "export" some of your shell vars into the shell's process env and effectively export your var's data to each child process you create
    - Your system uses env vars for all sorts of things mainly providing state info and default configs
* Env vars generally only useful to those programs that know about and support them explicitly, some vars have very narrow usage

### Shell Initialization
* When you start an interactive bash session, bash will prepare itself for usage by reading a few initialization commands from different files on your system. We can use these files to tell bash how to behave.
* One in particular gives you oppurtunity to export vars into the env, the `.bash_profile` which lives in the home directory
    - at the end of this file you should have the `source ~/.bashrc` because when `.bash_profile` exists, bash behaves curious in that it stops looking for its standard shell initializtion file, `~/.bashrc`, the `source` command remedies this
* if no `.bash_profile`, bash will try to read from `~/.profile` instead, a more generic shell profile config file also read by other shells

### What else can I use params for?
* There are positional params, special params and vars. Vars are esseentially params with a name

* Positional params: params with a number (a positive int), expanded using the normal param expansion syntax. `$1`, must have curly braces if more than one digit `${10}`
    - Expanded values that were sent into the process as args when it was created by the parent, `grep Name registrations.txt` => `$1` Name, `$2` registrations.txt
    - Also a zero'th positional param which expands to the *name* of the process, which is decided by the program creates it
    - These are READ-ONLY params, but we can change the values of the set or shifting them around, rarely used
    - when starting a new bash shell using `bash` command, there is a way to pass in positional params
    `bash -c 'echo "1: $1, 2: $2, 4: $4"' -- 'New First Argument' Second Third 'Fourth Argument'`
    - Bash command, passing `-c` option following by argument that contains some bash shell code. `--` technically used to pass zero'th positonal param, it is good to use to clear separation between bash's args and args in your shell code
    - RULE: Note that our argument containing bash code is 'single-quoted'
* Special params: params whose name is a single symbolic char, used to request state information from the bash shell

### Shell internal vars
* we know what shell vars are, but bash shell also creates a few vars for us. Used for lookng up certain state info from the shell or changing shell behaviors
* internal shell vars are shell vars with ALL UPPERCASE NAMES. same for nearly all env vars.
* in order to not accidentally overwrite over of these, make ALL shell vars in lower-case, for env give it an ALL UPPERCASE NAME

### Arrays
* A param that can hold a list of strings.
* Arised to address problem of storing lists of things in simple str vars, which must be split into the separate elements.
* When we need to work with lists of things in bash, we should ALWAYS be as explicit as possible about what the diff elements in this list are.
* To create earray variable, we use `=( )` operator

`files=( myscript hello.txt "05 Between Angels and Insects.ogg" )`

* spaces used to separate elements so if a space is part of the var, it must be QUOTED
* To expand, suffix param name with `[@]` and wrap in `{}`

`rm -v "${files[@]}"`

* Failure to wrap in double-quotes will cause word-split of all values in your array, resuilting in a broken list of word arguments
* `[@]` expands elems are distinct args, `[*]` expands as a single arg. This single arg operator is only really useful for displayling a list of elems to the user.
* Special param operators we learned can be applied to array expansions.
* `${parameter[@]/pattern/replacement}` operator and all of its variants has its replacement logic applied to each element distinctly, as it's being expanded: