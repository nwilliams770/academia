First let's review bits, bytes, and byte representation:
* a **bit** is *atmomic* (a unitary action or object that is essentially indivisible, unchangeable, whole, and irreducible)
    - it is smallest unit of storage, storing either a 0 or 1, two discrete states
    - anything with two separate states can store 1 bit
    - n bits yields 2**n patterns
* A bit is too small to store any so we group them into 8 bits make a **byte**, which can store one character
    - A byte has 256 different patterns (which could be, for instance, representations of a number in range 0 to 255)

* **ASCII Code** is an encoding representing each typed character by a number, each number is store in one byte (so the number must be between 0 and 255)
* **Unicodee** is an encoding for mandarin, greek, arabic, etc. typically 2-bytes per "character"

* One byte works well for individual characters but integers are typically stored with either 4 or 8 bytes
* Adding in binary is just like normal addition with carrying, but when you run out of bits you can't carry anymore
* The leftmost bit indicates sign, so we can easily do from our max positive value to our max negative value simply by adding 1, this phenemon is called **Integer Overflow**

Okay back to our Unicode lecture
[source](https://nedbatchelder.com/text/unipain.html)
* In ASCII, each character is 1 byte, an only 7 of those bits contain information pertaining to the character and the 8th bit is a *parity bit* to detect transmission errors, this parity bit is a **checksum**
    - Fun fact: ASII is 7 bits because it was developed before the concept of a byte even existed!

* ISO Latin 1, or 8859-1, is ASII extended with 96 more symbols.
* Windows addeed 27 more symbols to produce CP1252

* Here is our problem: A single byte can't represent text world-wide! There are only 256 possible symbols and that is much less than all the ways text is represented in this worlds

* Enter Unicode...which was designed to deal decisively with the issues of older character codes. It assigns integers, known as code points, to characters and has room for 1.1 million code points, 110,000 are already assigned so we've got room for growth or newly encounted alien languages!
* Keep in mind that, unlike ASCII, Unicode code points can vary in size
* We need a way to represeent Unicode code points are bytes in order to store and transmit them
* Unicode standard defines a number of ways to represent code points as bytes, which are called **encodings**
    - UTF-8 is the most popular, it uses a variable number of bytes for each code point. The higher the code point, the more bytes it needs in UTF-8

* Now to Python, check this
* In Python 2, a plain old string literal is of type `str`, but if you use a `u` prefix (e.g.`u'\u2119`), you get a unicode object!

* In Python 3, the `str` object storese unicode and the `bytes` type stores bytes (e.g. a byte string, [interesting article if you want to review](https://stackoverflow.com/questions/6224052/what-is-the-difference-between-a-string-and-a-byte-string))
* There is no coercion in Python 3! It won't implicitly change bytes to unicode or vice-versa
* Because of this new strictness, Python 3 has a new way of how you read files.
    - when you open a file in text mode, the data read from the file is implicitly decoded into Unicode and you get str objects
* How can we deal with all this converting, we have..Protip #1 Unicode sandwich
    - The data coming in and going out of your program must be bytes, therefore a good strategy is to decode the incoming bytes as soon as possible and when outputting data, encode it to bytes as late as possible
    - Sometimes you library does these conversions for you; it may present you with Unicode input or will accept Unicode for output
* Another pro tip, always know what kind of data you are dealing with, sucka!
    - if you have a byte string, you should know what encoding it is if you ever intend to deal with it as text
* You can't determine the encoding of a byte string by examing it, you know to know it through other means; for example, many protocols include ways to specify encoding
* Because of this, the encoding for bytes has to be communicated separately from the bytes themselves, something the specified encoding is wrong. For example, if we pull an HTML page and the HTTP header claims the page is 8859-1 but it's actally UTF-8

Review: the first unavoidable Facts of Life:
* All input and output of your program is bytes
* The world needs more than 256 symbols to communicate text
* Your program has to deael with bytes and Unicode
* A stream of bytes can't tell you its encoding
* Encoding specifications can be wrong

Pro-tips:
* Unicode sandwich
* Know what you're working with
* Test it!
