Before we can go into composition, let's first look at type embedding, another article by Bill Kennedy [source](https://www.ardanlabs.com/blog/2014/05/methods-interfaces-and-embedded-types.html)

## Methods Interfacts and Embedded Type in Go
The crux: what would happen if a struct and an embedded field implemented the same interface:
* Would the compiler throw an error because we now had two implementations of the interface?
* If the compiler accepted the type declaration, how does the compiler determine which implementation to use for interface calls?

Let's start with Methods:
* We have functions and methods in Go but methods are functions declared with a **receiver** (naming convention states a receiver often is a one or two letter abbreviation of its type)
* A receiver is a value or pointer of a named or struct type
* All methods for a given type belong to the type's method set
* When should one use a value or pointer receiver on methods? some guidelines are [here](https://github.com/golang/go/wiki/CodeReviewComments#receiver-type) but **when in doubt, use a pointer receiver**

Interfaces:
* A way of specifying that values and pointer of a particular type can behave in a specific way. An interface is a type that specifies a method set and all the methods for an interface type are considered to be the interface
* side note: convention in Go to name interfaces with an -er suffix when interface only has one method
* Go is unique in how we implement the interfaces we want our types to support:
    * Not required to explicitly state that our types implement an interface but if every method of an interface's method set is implemented by our type, then our type is said to implement the interface

Let's look at an example of all this:
```golang
type Notifier interface {
    Notify() error
}

func SendNotification(notify Notifier) error {
    return notify.Notify()
}

func (u *User) Notify() error {
    log.Printf("User: Sending User Email To %s<%s>\n",
        u.Name,
        u.Email)

    return nil
}

func main() {
    user := User{
        Name:  "janet jones",
        Email: "janet@email.com",
    }

    SendNotification(user)
}
// Output: cannot use user (type User) as type Notifier in function argument:
      // User does not implement Notifier (Notify method has pointer receiver)

// Notify method is using a pointer for the receiver and we are using a value to make the interface method call, to fix this we need to declare user as:
    user := &User{
        Name:  "janet jones",
        Email: "janet@email.com",
    }
```

Embedded Types:
* Struct types have the abiltiy to contain anonymous or embedded fields, this is also called embedding a type. When we embed a type into a struct, the name of the type acts as the field name for what is then an embedded field

## Composition with Go [source](https://www.ardanlabs.com/blog/2015/09/composition-with-go.html)
* 