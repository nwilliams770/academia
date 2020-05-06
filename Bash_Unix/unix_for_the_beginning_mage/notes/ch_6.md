## Ch 6
* search for commands using `apropos [search_term]`
* `grep` (global regular expression print); behaves like cat but we can add terms to pull specific text; can also search directories
    - `grep d shelf` => searches shelf for all files that contain a "d"
    - works even better with pipes! `ls /bin | grep d`
* `>`|`<` redirection operator to redirect output to somewhere else

* We can channel info through several streams: these streams are known as file descriptors
* Unix can support 10 FDs numbered 0 to 9 but the basic three are:
    - 0 | stdin
    - 1 | stdout
    - 2 | stderr