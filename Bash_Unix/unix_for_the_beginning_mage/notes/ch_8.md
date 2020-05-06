## Ch 8
* daemon: a long-running background process that answers requests for services
* Anytime we run a program, even bash, we start a process. We can see all processes running by using `ps`, `-a` flag for all processes
    - PID: Process ID
    - TT: location for your terminal
    - STAT: state, shows state of the process
    - TIME: how much processing time Unix has used on the process
    - COMMAND: name of the command
* To see all all daemons, we add the `x` flag in conjunction with `a` flag, `ps -ax`
* we can see all work daemons are doing in real time, using `top` (quit using `q`)

* We can run processes in the background by terminating a command with `&` (`nano &`), something like this will be output: `[1] 678` and corresponds to job number and process ID (PID) respectively
* we can see all jobs we have running by using `jobs`
    - `+` prefix is most recent one placed in the background
    - `-` prefix is second most recent
    - all after have no prefix
* We can bring background processes to the "foreground" using the `fg` command which accepts a job number as an argument: `fg [job_number]`
* When run something in the background? When it takes a long time to run, but there's no limit to how many terminals we can have open, unlike in the old says
* We can kill a process using `kill [process ID]`
    - sometimes a nomral kill won't work so we have to use `kill -9`, several numbers we can use as options with `kill`, try kill man page for more info