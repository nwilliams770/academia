## Intro to Containers, VMs, Docker
[source](https://www.freecodecamp.org/news/a-beginner-friendly-introduction-to-containers-vms-and-docker-79a9e3e119b/)
[source](https://www.freecodecamp.org/news/docker-simplified-96639a35ff36/)
* Containers and VMs have similar goals: to isolate an app and its dependencies into a self-contained unit that can run anywhere

### Virtual Machines
* Emulation of a computer that executes programs like one; runs on top of physical machine using a **hypervisor**, which, in turn, runs on a host machine or on *bare-metal*
* **hypervisor**: Software, firmware, or hardware that VMs run on top of, which themselves run on physical computers (referred to as "host-machine")
    - Host machine provides a VM with *resources*, including RAM and CPU
    - These resources can be distributed as you see fit so one VM can be provided more resources than other VMs on the same host machine
    - VM often call *guest machine*
* Guest machine contains both application and whatever it needs to run that application (system binaries and libraries), entire virtualized hardware stack (including virtualized network adapters, storage, CPU), and accompanying guest operating system

Hosted hypervisor vs bare-metal hypervisor:
* Hosted virtualization hypervisor runs of OS of host machine; VM doesn't have direct access to hardware so must go through host operating system in order to do so
    - Benefit here is that underlying hardware is less important because the host operating system is responsble for it!
    - Downfall is that this additional layer between hardware and hypervisor creates more resource overhead and lowers performance
* Bare metal hypervisor tackles the performance issue by installing on and runnin gfrom host machine's hardwares, so doesn't need a host operating system to run on
    - This hypervisor has its own device drivers (in most fundamental sensee, software that lets OS and a device communicate with each other) and interacts with each component directly for any I/O, processing, OS-specific tasks
    - Benefit is better performance, stability, scalability
    - Downfall is limited compatibility because hypervisor can only have so many device drivers built into it
* We need a hypervisor because it provides the VMs with a platform to manage and execute the guest OS; allows hosts to share resources amongst the VMs running on top of them
    - Note that the hypervisor is not limited to or per VM, there is one hypervisor for ALL potential VMs running on top of host OS

### Containers
* Unlike a VM which provides hardware virtualization, a container provides OS-level virtualization by abstracting the "user space".
* Containers *share* the host system's kernel (core of a computer's OS with complete control over everything in the system) with other containers
* Containers package up **just the user space**, not the kernel or virtual hardware like a VM does and each container gets its own isolated user space to allow multiple containers to run on a single host machine
* OS-level architecture is being shared across containers, only the bins and libs are being created from scratch, that's why they are lightweight!

### Enter Docker
* Docker is an open-source project based on Linux containers; it uses Linux Kernel features like namespaces and control groups to create containers on top of an OS
* Containers are not a new thing; Google's used thier own for years and Solaris Zones, BSD jails and LXC are other Linux container technologies that have been around for years

Why everyone jumping on the Docker boat then?
1. **Ease of use**: Docker has made it easer to take advantage of containers to quickly build and test portable apps.
2. **Speed**: Lightweight and fast. They take up fewer resources because they are sandboxed environments running on the kernel. Can creaete a run a Docker container in seconds compared to VMs which might take longer because they have to boot up an OS everytime
3. **Docker Hub**: "App store for Docker images". 10k+ public images that are readily avail for us
4. **Modularity and Scalability**: Can break out app functionality into different containers (Postgres database in one container, server in another, and node app in another). Docker makes it easy to link these containers together

### Docker Piece-by-Piece
Engine:
* Layer on which Docker runs; manages containers, images, builds, etc. Runs natively on Linux systems.
* Composed of:
    - Docker Daemon that runs on host computer
    - Docker Client that communicates with Docker Daemon to execute commands
    - REST API for interacting with Daemon remotely

Client:
* What we, the users, communicate with; e.g. the UI

Daemon:
* What actually executes commands send to Docker client, like building, running, distributing containers. Runs on host machine but we never communicate directly with it

Dockerfile:
* Where we write instructions to build a Docker image. Some instructions can be:
    - `RUN apt-get y install some-package`
    - `EXPOSE 8000`
    - `ENV ANT_HOME /user/local/apache-ant`
* Once we have a setup dockerfile, we can build an image from it!

Docker Image:
* Read only-templates that we build from a set of instructions dictated by a given Dockerfile.
* Define both what you want packaged app and its dependecies to look like and what processes to run when launched
* Each instruction adds a new "layeer" to the image, with layers representing a portion of the images file system that either adds or replaces the layer below it.

Union File System:
* A stackable file system; files and directories of separate file systems (branches) transparently overlaid to form a single file system
* Contents of directories which have the same path within the overlaid branches are treated as a single merged directory
    - Removes need to create separate copies of each layer
    - When layers need to be modified, a copy will be created and modified, leaving original unchanged
    - File system appears writable without actually allowing writes
Benefits:
1. **Duplication-free**: layers help avoid duplicating a complete set of files every time you use an image to create and run a new container, cheap and fast instantiation
2. **Layer segregation**: Making a change is fast; when an image is changed, Docker only propogates the updates to the layer that was changed

### Volumes
* "Data" part of a container that allow us to persist and share a container's data
* Separate from default Union File System and exist as normal directories and files on host filesystem.
* When you want to update, you make changes to it directly
* Can be shared and reused among multiple containers

### Docker Containers as a whole
* Wrap an app's software with everything app needs to run; including OS, app code, runtime, sys tools, sys libs, etc.
* Containers built off Docker images; since images read-only, Docker adds a read-write system over the read-only file system of the image to create a container
* Docker also creates a network interface so container can talk to local host, attaches avail IP address to container and executes process that you specified to run when defining the Docker image
* Once successfully created, you can run in any environment without having to make changes

### Digging into "containers"
* "Container" is an abstract concept to describe how a few different features work together to visualize a "container"
1. **Namespaces**: Namespaces provide containers with their own view of the underlying Linux system, limiting what container can see and access. When a container is run, Docker creates namespaces that the specific container will use.
Several different types of namespaces in a kernel that Docker makes use of:
* **NET**: Provides a view of the network stack of the system (network devices, IP addresses, IP routing tables, etc.)
* **PID**: Process ID. Provides a scoped view of processes a container can view and interat with, including an independent init (PID 1), the "ancestor of all processes" e.g. the process that is first run on startup that starts all other processes
* **MNT**: Gives a container its own view of the "mounts" on a system. So processes in different mount namespaces have different views of filesystem hierarchy
* **UTS**: Unix Timesharing System. Allows a process to identify system identifiers (i.e. hostname, domainname). UTS allows containers to have their own hostname and NIS domain name that is independent of other containers and the host system
* **IPC**: InterProcess Communication. IPC namespace is responsible for isolating IPC resources between processes running inside each container
* **USER**: Used to isolate users within each container. Allows containers to have a different view of the uid and gip ranges, as compared with the host system. A process's uid and gid can be different inside and outside a user namespace, which allows a proceess to have an unpriviledged user outside a container without sacrificing root priviledge inside a container

2. **Control Groups (cgroups)**
* A Linux kernel feature that isolates, prioritizes, and accounts for resource usage (CPU, memeory, disk I/O, network) of a set of processes. In this sense, a cgroup ensure Docker containers only use the resources they need and, if needed, sets up limits to what resources. Cgroups also ensure that a single container doesn't exhaust resources and bring entire system down

3. **Isolated Union file sysyem**:
Let's go over some fundamentals to better understand how this works:

File systems:
* Your harddrive only stores bytes, but how those bytes are organized is through file systems
* Your OS, under the hood, makes use a file system to organize information on your hard drive.
    - Imagine a global array containing all the memory that can be stored on your hard drive, how does an application know where to write to? Even further, how does your application know it's not overwriting something?
    - A file system has direct access to the hard drive via addressing (a specific memory address) that exposes itself via the API `read` and `write` (`seek`, `tell`)
    - Knowing this, a directory (or folder) is just another file that stores some information like its name and pointers (paths) to all its contents
    - Some famous file systems as FAT 32, NTFS, etc.
