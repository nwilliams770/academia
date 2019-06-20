### Bit Hacking With Go [source](https://medium.com/learning-the-go-programming-language/bit-hacking-with-go-e0acee258827)
* Back when memory was expensive as was processing power, hacking on bits directly was the preferred way to process info.
* Still crucial in low-level system programming, image processing, crptography, etc.
Go supports:
```
 &   bitwise AND
 |   bitwise OR
 ^   bitwise XOR
&^   AND NOT
<<   left shift
>>   right shift
```

The & Operator:
* Performs the following AND bitwise operation:
```
Given operands a, b
AND(a, b) = 1; only if a = b = 1
               else = 0
```
What can we do with it?
* Selectively clear bits of an integer value to zero:
```
func main() {
    var x uint8 = 0xAC    // x = 10101100
    x = x & 0xF0  // conversely, x &= 0xF0  // x = 10100000
}
```
* Determine if a number is even or odd:
```
num := rand.Int()
if num&1 == 1 {
    fmt.Printf(“%d is odd\n”, num)
} else {
    fmt.Printf(“%d is even\n”, num)
}
```

The | Operator:
* Performs the following OR bitwise operation:
```
Given operands a, b
OR(a, b) = 1; when a = 1 or b = 1
              else = 0 
```

Uses?
* Selectively set individual bits for a given integer or when performing bit masking techniques to set arbitrary bits for a given integer value
```
func main() {
    var a uint8 = 0
    a |= 196
    a |= 3
    fmt.Printf(“%b”, a)
}
// prints 11000111
          ^^   ^^^ 
```
* We can use OR and AND as a way of specifying configurations values and reading them, respectively. ([source](https://medium.com/learning-the-go-programming-language/bit-hacking-with-go-e0acee258827) has good example)

The ^ Operator:
* XOR or exclusive OR, can be used to toggle bits from one value to another i.e. from 1 to 0 or 0 to 1
```
Given operands a, b
XOR(a, b) = 1; only if a != b
     else = 0
```
* One example is to compare sign magnitudes:
```
func main() {
    a, b := -12, 25
    fmt.Println(“a and b have same sign?“, (a ^ b) >= 0)
}
```
`^` as a bitwise complement:
* Can be used as a unary operator to apply one's complement to a number
``` 
var a byte = 0x0F
00001111     // var a
11110000     // ^a
```
The &^ Operator:
* AND NOT, can be used for clearing bits:
```
Given operands a, b
AND_NOT(a, b) = AND(a, NOT(b))
```
var a byte = 0xAB // a => 10101011
a &^= 0x0F // a => 10100000

The << and >> Operators:
* Shift operators:
```
Given integer operands a and n,
a << n; shifts all bits in a to the left n times
a >> n; shifts all bits in a to the right n times
```
* They provide interesting ways to manipulate bits at designated positions, take for example:
```
func main() {
    var a int8 = 8 // 00001000
    a = a | (1<<2) // 00001000 | (00000001 << 2) => 00001100
    fmt.Printf(“%08b\n”, a)
}
