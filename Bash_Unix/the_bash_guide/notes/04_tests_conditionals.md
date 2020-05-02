## Ch 4: Tests and Conditionals
* Conditionals are like choices in games: each critical decision changes the game situation in one way or another.
* If you finish a game and retry, making a diff choice, we call this *branching*. Every choice sets us on a new branch that affects our env in a different way than others.

### The if compound
* `if` `then`, `elif` `then`, `else` `fi`
* We start  with `if` followed by a command list which will be executed by  bash and upon completion, bash will hand the final exit code to the `if` compound to be eval'd
`if mv hello.txt ~/.Trash/; then echo "Moved hello.txt into the trash."`
`elif rm hello.txt; then echo "Deleted hello.txt."`
`else echo "Couldn't remove hello.txt." >&2; exit 1; fi`
* Bash hands final exit code to `if`, if it is a `0` (0 = success), first branch is executed.
* Essentially an `if` compound is a statement that expresses a series of potential branches to execute, each preceded by a command list (ie a sequence of commands) that evals whether or not that branch should be chosen.
* Nearly all `if` and other conditionals you'll see will have nothing more than Simple commands as its conditional, nevertheless possible to provide a whole list of commands.
    - When we do, important to undeerstand that only the final exist code after executing the entire list is relevant for the branch's eval
* Consider below:

`read -p "Breakfast? [y/n] "; if [[ $REPLY = y ]]; then echo "Here are your eggs."; fi`

`if read -p "Breakfast? [y/n] "; [[ $REPLY = y ]]; then echo "Here are your eggs."; fi`

* Both identical in operation; in first, `read` command precedes `if`, in latter, `read` is embedded in the initial branch; boils down to choice of style or preference:
    - Embedding the data-gathering command creates a "wholesome" approach to the conditional: the conditional becomes a unit which consists of all its dependencies
    - Preceding the data-gathering command to the conditional separates the two distinct operations; also makes the conditional more symmetric or "balanced" when other `elif` branches become part of the statement