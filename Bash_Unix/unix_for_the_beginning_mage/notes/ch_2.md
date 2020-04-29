### Intro to the Filesystem
* Our world of Unix starts with `/`, the *root*
Basic navigation:
* `pwd` - print working directory (directory of the filesystem you're currently in)
* `mkdir [name]` - make directory
    - some 'spells' ask for extra information, this extra information is called arguments
* `cd` change directory
    - `cd` with no args will take us back to root
    - `cd ~` the tilde (~) is an alias for root
    - `cd ..` goes to parent directory if not root
    - `cd [path]`
* `ls` list, lists everything in working directory
* `whoami` prints username