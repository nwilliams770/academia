### Basics
* Network topology: layout pattern of which devices are interconnected.
* OSI Model: Open Systems Interconnection, conceptual model that standarises communication of a telecommunication or computing system; doesn't care about underlying internal stucture nor technology. Goal is interoperability of diverse systems with standard communication protocols.
Partitions a system into abstraction layers, with each layer serving the one above it and served by the layer below it.
* Protocol: Set of rules or algos which define the way two entities communicate across a network. There exists different protocols defined at each layer of OSI model.

Unique identifiers of a network:
* Hostname: unique label assignd to each device in a network.
* IP Address: Internet Protol or Logical Address, label assigned to each device in a network. Length is 32-bits
* MAC (Media Access Control) Address: aka physical address, unique identifier of each host and is associated with the NIC (Network Interface Card), assigned to NIC at time of manufacturing; 48-bit length

Why have all 3?
* Most simply they serve different functions!
* IP Address provides location (in a global context), computer name or hostname provides local context, MAC provides individual indentifaction in a local only context, and an absolute form of identification, one that doesn't really change and also can loosely indicate what the device is

* Port: logical channel which data sent/received to an application. A host can have multiple apps running, each is indentified using the port number on which they are running. 16-bit int.
* Socket: Unique combo of IP address and Port number together

* DNS Server: Domain Name system. Server which translates web addresses or URLs into corresponding IP addresses.
* ARP: Address Resolution Protocol. Used to convert IP address to its corresponding MAC Address. Used by Data Link Layer to identify MAC address of host machine

### Internet, Web
* Internet is global network of smaller networks interconnected using standardised communication protocols; standards describe a framework known as Internet Protol suite (layered system of App layer, transport layer, network layer)
    - Some non-www "applications" include email, voice over IP, IM, streaming audio/video


* World wide web subsection of internet, an application of the Internet; system of Internet servers that support specially formatted markup language, HTML! These servers are running HyperText Transport Protocol that can provide documents embedded with media, programs, and links to any other servers.
    - We need special software called a web browser to access these servers

* URI: Uniform Resource Indetifier, like an address providing unique global identifier to a resource on the Web; URL, uniform resource locator (URL) most commonly used form of an URI. Mainly two parts
    - Protocol used in transfer e.g. HTTP
    - domain name

### Goals of Networks
* Elements:
    - At least two computers
    - transmission medium either wired or wireless
    - protocols or rules that govern the communication
    - network software such as Network Operating System
* Criteria:
    - Performance: measured in terms of transit time for a message to travel from one device to another and response time, elapsed time between inquiry and response. Dependent on:
        - num users
        - type of transmission medium
        - capability of connection network
        - software efficiency
    - Reliability: measured by
        - frequency of failure
        - recovery from failures
        - robustness during catastrophe
    - Security
* some important goals
    - Resource sharing
    - High reliability
    - inter-process communication
    - flexible access

### Line Configuration in Computer Networks
* A link is a communication pathway that transfers data from one device to another (a device is any device capable of sending and receiving data)
* For communication to occur, two devices must be connected in some way to the same link at the same time. Two possible types:
    - Point-to-point connection
    - Multipoint connection

* Point-to-point
    - dedicated link between two devices
    - entire capacity of link is for transmission between those two devices
    - most are actual wire or cable connecting the two ends but other options avail such as satellite or microwave links
    - network topology considered one of the easiest and most conventional
    - simplest to establish and understand
    - EX: remote and television, two work stations

* Multipoint
    - aka multidrop config, two or more devices share a single link
    - more than two devices sharing a link means that the capacity of the channel is shared. With shared capacity, two possibilities in multi-point line config:
        - spatial sharing: several devices can share the link simultaneously
        - temporal (line) sharing: if users must take turns using the link

### Transmission Modes in Computer Networks
* Transmission mode means transferring of data between two devices, aka communication mode
* Simplex mode: comm is unidirectional e.g. one-way street. Only one of the two devices can transmit and only one can receive. EX: keyboard and monitors, keyboard can only introduce input and monitor only output
* Half-duplex mode: each can transmit and receive but not at the same time. EX: walkie-talkies!
* Full-duplex mode: both stations can transmit and receive simultaneously. In this mode, signals going in one direction share the capacity of the link with signals going in other direction. EX: cellphones.
can occur in two ways:
    - either link must contain two physically separate transmission paths, one for sending and one for receiving
    - or capacity is divided between signals travelling in both directions

### Unicast, Broadcast, and Multicast in Computer Networks


### TCP/IP vs OSI Model: What's the Diff?
* OSI Model is a logical and conceptual model that defines network comms used by systems open to interconnection and comm with other systems. Defines a logical network and describes computer packer transfer by using various layers of protocols
* TCI/IP (Transmission Control Protocol/Internet Protocol) determines how a specific computer should be connect to the internet and how you can transmit data between them. Helps create a virtual network when multiple computer networks are connected together. *Offer highly reliable and end-to-end byte stream over an unreliable internetwork*


#### Characteristics of OSI and TCP/IP Models
OSI:
* Layer only created where definite levels of abstraction are needed
* Function of layer should be selected as per internationally standardized protocols
* Num of layers large enough to keep separate functions in different layers but small enough that architecture doesn't become very complicated
* Each layer relies on lower layer to perform primitive functions and every level should be able to provide services to next higher layer
* Changes in one layer should not need changes in other layers

TCP/IP:
* Flexible architecture
* Adding more systems to a network is easy
* Network remains intact until source and destination machines functioning properly
* connect-oriented protocol
* reliability and data that arrives out of sequence should be put back in order
* allows flow control implementation so sender never overpowers receiver with data

Differences:
* OSI provides clear distinction between interfaces, services and protocols, TCP/IP does not
* TCP/IP uses only the Internet layer, OSI uses network layer to define routing standards and protocols
* OSI, 7 layers; TCP/IP 4 layers
* OSI, transport layer is only connection-oriented; a layer of TCP/IP is both connection-oriented and connectionless
* OSI, data link layer and physical are separate, TCP, both are combined as single host-to-network layer
* OSI defined after advent of internet, TCP/IP after
* OSI min header size 5 bytes; TCP is 20 bytes
* OSI developed by ISO (International Standard Org), TCP developed by ARPANET

