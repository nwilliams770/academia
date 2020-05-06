## Ch 7
* first slash in filesystem is known as root, but it is also the name of a user in the Unix system!
* Root can do anything, can't lock out of any files or directories and cannot prevent from running any commands
* You can't log into a Unix system as "Root" but you can use the root account by switching to root while you're logged in, `su` (super user or substitute user)
    - note, newer Unix systems like Ubuntu and Mac OS X have moved away from the `su` command to a different root-enabling command called `sudo`, which allows you to run a single command as root instead of switching completely to root.
* Some unix systems have a special group called "wheel". Only group members of wheel may `su` to root and use root capabilities
* Root has UID of 0, this is the same across every Unix system