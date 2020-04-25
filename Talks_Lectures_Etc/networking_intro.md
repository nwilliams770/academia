[source](https://www.geeksforgeeks.org/computer-network-tutorials/#basics)
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

### More Networking Terminology
* Computer network: two or more devices share a range of services and info in the form of emails, messages, databases, websites, audio, vid, etc.
* Protocol: Set of defined rules that must be followed by every connection device across a network in order to communicate and share info. A number of protocols combine together to form a protocol suite or stack
    - IP: Internet protocol
    - FTP: File transfer protocol
    - SMTP: Simple mail transfer protocol
    - HTTP: Hyper Text transfer protocol
* Network reference models were developed to allow diff products from diff manufacturers to interoperate on a network; it serves as a blueprint, detailing standards for how protocol communication should occur
    - Most widely recognized are OSI, and TCP/IP (DoD, Department of Defense)

* Network types often categorized by size and unfctionality, according to size, three types:
    - LANs: Local Area Networks
    - MANs: Metropolitan Area Networks
    - WANs: Wide Area Networks

* Internetwork is a general term to describe multiple networks connect together; Internet is more well-known one

* Some networks categorized by function instead of size:
    - SAN: Storage Area Network, provides systems with high-speed loss-less access to high-capacity storage devices
    - VPN: Virtual Private Network, allows for information to be securely sent across a public or unsecure network, such as the Internet. Common users of VPN are to connect branch offices or remote users to a main office.

* In a network, any connected device is called as **host**. A host can serve in the following ways:
    - act as Client, when requesting information
    - act as Server, when providing information
    - as Peer, when requesting and providing information

### Types of area networks - LAN, MAN, and WAN
* LAN, MAN, and WAN three major types of networks designed to operate over area they cover, each with similarities and differences. An obvious diff being geographical areas they cover
* Other types of networks too though!:
    - PAN Personal Area Network
    - SAN Storage Area Network
    - EPN Enterprise Private Network
    - VPN Virtual Private Network

LAN, Local Area Network:
* Connects devices in a way that personal computer and workstations can share data, tools, programs
* Connected by a switch or stack of switches using a private addressing scheme as defined by TCP/IP protocol.
* Private addresses are unique in relation to other computers on the local network
* Routers at the boundary of a LAN, connecting them to the larger WAN
* Data transfer rate is fast as num computers link is limited

MAN, Metropolitan Area Network
* Connects two or more computers that are apart but resides in the same or different cities
* Covers large geographical area and may serve as ISP, Internet Service Provider
* Designed for customers who need a high-speed connectivity

WAN, Wide Area Network
* Extends over a large geographical area, although might be confined within bounds of a state or country.
* Could be a connection of LAN connection to other LAN's via telephone line or radio waves and limited to an enterprise or accessible to the public
* Two major types: Switched WAN and Point-to-Point WAN


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

### Types of Network Topology
- Arrangement of networks which comprises of nodes and connecting lines via send and receiver

Mesh Topology:
* Every device connected to another device via a particular channel
* N number of devices connect each other in mesh topology means total ports required by each device is N - 1 and numbeers dedicated links is N * (N - 1) / 2
* Pros:
    - robust
    - data is reliable because data transferred among the devices through dedicated links or channels
    - provides security and privacy
* Cons:
    - installation and config difficult
    - cost of cables is high
    - cost maintenace high

Star Topology:
* All devices connected to a single hub through a cable. Hub is central node and all other nodes connected to it, can be passive in nature i.e. not intelligent
* Pros:
    - For N devices connected, N cables needed to connect them
    - Each device requires only 1 port to connect to hub
* Cons:
    - If concentrator (hub) on which topology relies fails, system crashes
    - Cost on install high
    - Performance based on single concentrator (hub)

Bus Topology:
* Every computer and network device is connected to a single cable; transmits data from one end to another in single direction
* Pros:
    - only 1 cable is required (backbone cable), and N droplines for N devices
* Cons:
    - if common cable fails, system crashes
    - if network traffic heavy, increases collisions in network. To avoid this, variious protocols used in MAC layer

Ring Topology:
* A ring forms connecting a device exactly with its two neighboring devices
* One station is known as monitor station which takes all responsibility to perform operations
* To transmit data, station has to hold token, after transmission token is released for other station to use
* when no data transmission, token will circulate in the ring
* two types of token release techniques: Early token release releases token after transmitting data, Delay token release releases token after acknowledgement is received from the receeiver
* Pros:
    - possibility of collision minimal
    - cheap to install and expand
* Cons:
    - troubleshooting difficult
    - addition of stations in between or removal of stations can disturb whole topology

Hybrid Topology:
* Collection of two or more topologies, scalable topology and reliable but also costly

### Transmission Modes in Computer Networks
* Transmission mode means transferring of data between two devices, aka communication mode
* Simplex mode: comm is unidirectional e.g. one-way street. Only one of the two devices can transmit and only one can receive. EX: keyboard and monitors, keyboard can only introduce input and monitor only output
* Half-duplex mode: each can transmit and receive but not at the same time. EX: walkie-talkies!
* Full-duplex mode: both stations can transmit and receive simultaneously. In this mode, signals going in one direction share the capacity of the link with signals going in other direction. EX: cellphones.
can occur in two ways:
    - either link must contain two physically separate transmission paths, one for sending and one for receiving
    - or capacity is divided between signals travelling in both directions

### TCP/IP vs OSI Model: What's the Diff?
* OSI Model is a logical and conceptual model that defines network comms used by systems open to interconnection and comm with other systems. Defines a logical network and describes computer packer transfer by using various layers of protocols
* TCI/IP (Transmission Control Protocol/Internet Protocol) determines how a specific computer should be connect to the internet and how you can transmit data between them. Helps create a virtual network when multiple computer networks are connected together. *Offer highly reliable and end-to-end byte stream over an unreliable internetwork*

### OSI Model
* 7 layer architecture
1. Physical Layer: actual physical connection between devices, contains info in the form of bits. Responsible for transmitting individual bits from one node to then next. Some functions of physical layer are:
    - Bit synchronization: provides the synchronization of bits by providing a clock which controls both sender and receiver
    - Bit rate control: defines the transmission rate, e.g. bps
    - Physical topologies: specifies way in which different devices/nodes are arranged in a network
    - Transmission mode: defines way in which data flows between two connection devices, simplex, half-duplex, full-duplex

2. Data Link Layer (DLL): responsible for node to node delivery of the message. Make sure data transfer is error-free from one node to another, over the physical layer. When a packet arrives in a network,  the DLL is responsible for transmitting it to Host using its MAC address,

* packet (note a packet in the DLL is referred to as Frame) received from network layer is further divided into frames depending on frame size of the network interface card. DLL encapsulates sender and receiver's MAC address in header
* some functions are:
    - Framing: provides a way for sender to transmit a set of bits that are meaningful to the receiver by attaching special bit patterns to the beginning and end of the frame
    - Physical addressing: after creating frames, DLL add MAC address of sender/receiver in header of each frame
    - Error control: DLL provides error control mechanism in which it detects and retransmits damanged or lost frames
    - Flow control
    - Access control: when a single comm channel is shared by multiple devices, MAC sub-layer of data link helps determime which device has control over the channel at a given time
* Two sublayers: Logical Link Control (LLC) and Media Access Control (MAC)

3. Network Layer
* Works for the transmission of data from one host to the other located in different networks. Takes care of packet routing ie selection of shortest path to transmit the packet, from num routes avail. Sender & receiver's IP address are placed in header by the network layer
some functions are
    - Routing: network layer protocols determine which route is suitable from source to destination
    - Logical addressing: In order to indentify each device on internerwork uniquely, network layer defines an addressing scheme. Sender and receiver's IP address are placed in header by network layer.

4. Transport Layer
* Data in transport layer is referred to as Segments. Responsible for End to End delivery of complete message. Also provides acknowledgement of the successful data transmission and re-transmits the data if an error is found
Sender's side:
* Receives the formatted data from upper layers, performs Segmentaton and also implements Flow & Error control to ensure proper data transmission. Adds source and destination port number in its header
Receiver's side:
* Reads port number from header and forwards data which it has received to respective application. Also performs sequencing and reassembling of segmented data
some functions are:
* Segmentation and Reassembly: acceepts message from session layer, breaks it into smaller units. Each segment produced has a header. At destination station reassembles the message
* Server point addressing: in order to deliver message to correct process, transport layere header includes port address

Services provided by transport layer:
* Connection oriented servicee: three-phase process which includes connection establishment, data transfer, termination / disconnection
    - receiving device sends an acknowledgement back to source after a packet or group of packets is received
* connection less service: one-phase process where receiver does not acknowledge receipt of a packet. Less reliable but faster!

5. Session layer
* Responsible for establishment of connection, maintenance of sessions, and ensures security
functions are:
- session establishment, maintenance, and termination: allows the two processes to establish, use, and terminate a connection
- synchronization: allows a process to add checkpoints which are considered as sync points into the data. help to indentify error so that data is re-sync'd properly and that ends of messages are not cut prematurely resulting in data loss
- dialog controller: session layer allows two systems to start communication with each other in half-duplex or full-duplex

6. Presentation layer
* Also called translation layer. Data from app layer is extracted here and manipulation as per the required format to transmit over the network
functions are:
- translation: for example, ASCII to EBCDIC
- encryption/decryption: data encryption translates data into another form or code. encrypted is cipher text and decrypted is plain text. Key value used for encryption/decryption
- compression: reduces num bits that need to be transmitted on the network

7. App layer
* Implemented by network applications which produce the data which has to be transferred. Layer also serves as a window for app services to access network and for displaying the received info to the user
functions are:
- network virtual terminal
- FTAM-File transfer access and management
- mail services
- directory services

### TCP/IP Model Transmission Control Protocol / Internet Protocol
* OSI Model is just a referencee/logical model, TCP/IP was developed by the Department of Defense (DoD) in 1960s and is based on standard protocols (still a conceptual model)
* Also known as Internet protocol suite, commonly referred to as TCP/IP as those are the foundational protocols in the suite
* Concise version of OSI model, 4 abstraction layers
1. Network Access Layer
* Combo of DLL and physical layer of OSI model, looks out for hardware addressing and protocols present in this layer allow for physical transmission of data

2. Internet Layer
* Parallels OSI's network layer. Defines protocols which are responsible for logical transmission of data over entire network, main protocols are:
    - IP: Internet protocol and responsible for delivering packets from source host to destination host by looking at IP addresses in packet headers. 2 versions: IPv6 and IPv4
    - ICMP: Internet Control Message Protocol. Encapsulated within IP datagrams and responsible for providing hosts with info about network problems
    - ARP: Address Resolution Protocol, finds hardware address of a host from a known IP address. ARP has several types

3. Host-to-Host layer
* Analogous to transport layer in OSI model, responsible for end-to-end comm and error-free data delivery; shields upper-layer apps from complexities of data, main protocols are:
    - TCP: Transmission Control Protocol, provides reliable and error-free comm between end systems. Sequences and segments data, acknowledgement feature and controls flow of data. Lots of overhead due to features but very effective
    - UPD: User Datagram Protocol, no such features but go-to protocol if your app does not require reliable transport because its so cost-effective. Unlike TCP which is connection-oriented, UDP is connectionless

4. App Layer
* Functions of top three layers of OSI: App, presentation, and session layer. Node-to-node comm and controls UI specifications, some main protocols are:
    - HTTP and HTTPS: Hypertext transfer protocol, used by World Wide Web to manage communication between browsers and servers. HTTPS is HTTP-Secure, a combo of HTTP and SSL (Secure Socket Layer). Efficient in cases where browser needs to fill out forms, sign in, authenticate, and carry out bank transactions
    - SSH: Secure Shell, terminal emulation software. More preferred because of ability to maintain the encrpted connection. Sets up a secure session over a TCP/IP connection
    - NTP, Network Time Protocol. Used to sync clocks on our computer to a standard time sourcee. Useful in bank transactions.


### User Datagram Protocol (UDP)
* Transport layer protocol, part of the Internet protocol suite referred as UDP/IP.
* It is unreliable and connectionless
* Though TCP is dominant transport layer protocol used with most Internet services, perks such as assured delivery, reliability, etc. cost us additional overhead and latency.
* UDP is good for realtime services like computer gaming, voice or video communication, live conferences. UPD permits packets to be dropped instead of processing delayed packets. No error checking in UDP so also saves bandwidth so more efficient in latency and bandwidth

* Header is 8-bytes and fixed and simple, while TCP may vary from 20 - 60 bytes
    - Source port, 2 bytes
    - Destination port, 2 bytes
    - Length, 2 bytes
    - checksum, small datum derived from data in order to error check, but why have this if UDP is unreliable?
        - no sequence ordering and retransmission mechanism in UDP, if checksum does not match then packet is simply discarded! Note that checksum calculation is NOT mandatory in UDP
* UDP port # fields are 16 bits long so range for port numbers from 0 to 65535, port 0 is reserved

Applications of UDP:
* Simple request response when data size if less and less concern about flow and error control
* used for some routing update protocols like RIP, routing info protocol
* Normally used for realtime apps
* these implementations use UDP as transport layer
    - Network time protocol, NTP
    - DNS, domain name system (phonebook of the internet!)
    - NNP network news protocol

### UDP vs TCP
Let's see how both work:
* TCP connection established with a three-way handshake. Process of initiating and acknowleding a connection; once established, data transfer begins and when tramission process finished, connection terminated
    - delivery acknowledgements
    - re transmission
    - delays transmission when network congested
    - easy error detection

* UDP uses simple tranmission without implied hand-shaking dialogue for ordering, reliability, or data integrity; also assumed error checking and connection not important or performed in app in order to avoid overhead
    - supports bandwidth-intensive appls that tolerate packet loss
    - less delay
    - sends the bulk quantity of packets
    - possibility of data loss
    - allows small transactions (DNS lookup)

Differences:
* TCP connection-oriented (makes connection and checks whether message is received or not and sends again if error occurs), UDP is connectionless (no guarantee of message delivery)
* TCP reads data as a stream of bytes and message transmitted to segment boundaries, UDP messagees contain packets sent one by one
* TCP makes their way across internet from one computer to another, UPD not connection-based so one program can send lots of packets to another
* TCP rearranges packets in order, UDP has no fixed order as all packets independent from each other
* TCP header 20 - 60 bytes, UDP 8 bytes
* TCP heavy-weight, requires 3 packets to set up a socket connection before any data can be sent, UDP is lightweight, no tracking connections, ordering messages, etc
* TCP does error-checking and error recovery, UDP performs error-checking but discards erroneous packets
* TCP guaranteed delivery, UDP does not
* TCP extensive error checking mechanisms because it provides flow control and acknowledgement of data, UDP has single error-checking mechanism which is used for checksums

Applications of TCP:
* establish/setup connection with diff types of computers
* operates independent of OS
* supports many routing protocols

Applications of UDP:
* Used largely by time-sensitve apps as well as by servers that answer small queries from a large client-base
* compatible with packet broadcast for sending all over network
* usedin DNS, voice over IP, etc

*****Side Note: Socket vs HTTP****
* HTTP is an app-level protocol for distributed, collaboration, hypermedia info systems. It is a generic, stateless protcol which can be used for many tasks beyond hypertext. Feature is the typing and negotiation of data representation, allowing systems to be built independently of the data being transfer
* Socket is an endpoint of a two-comm link between two programs running on the network. Bound to a port no. so that TCP layer can identify the app that the data is destined to be sent.Sockets provide an interface for programming networks at the transport layer.
    - Network comm using Sockets is very similar to performing file I/O, in fact, the socket handle is treated like a file handle. Socket-based comm is independent of programming language used for implementing it

*****End Side Note****


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

