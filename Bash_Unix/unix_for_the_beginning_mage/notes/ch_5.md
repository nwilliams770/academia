## Ch 5
* File permissions:
    - R: read
    - W: write (create edit delete)
    - X: execute (the binary file)
    - `- rwx rx rx` - respectively: owner, creator of file, group (all users must be belong at least one), and other, all who are not the owner and does not belong in the group
* `chmod [u:user g:group o:other a:all][+ -][r w x]`
    - shorthand: R: 4, W: 2, X: 1, None: 0; sum all desired actions, if any, then following UGO pattern to form: `chmod 654 shelf` (`chmod u+rwx, g+rw, o+r`) note: all places must be filled, `chmod 4` will be eval'd as `chmod 004`

* Types of files:
    - plain file (-): can hold any type of information, from music to binary to text, can have `x` action set on it to become executable
    - directory (d): nothing more than a file, but a special file. Like a phone book, it contains information about the files "inside it"; when you want to access a file, the directory will be consulted on how to reach it
    - link (l): a file that points to another file (permissions are prefixed with `l`); can be created with `ln` command, with two types:
        - hard link is like an exact clone of file, thinks it's a real file, not a pointer
        - soft link is a separate file whose only job is to point to the correct file
    - pipes (p): connects two programs together to share info
    - block device (b): device file, used to interact with hardware, reads info in blocks (ex: hard drive)
    - char device (c): device file, used to interact with hardware, reads info in a stream (ex: modem)