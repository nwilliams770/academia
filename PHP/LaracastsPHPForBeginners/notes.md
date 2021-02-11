## Hello World
* When PHP parses a file, it looks for opening and closing tags, `<?php` and `?>`, which tell PHP to start and stop interpreting the code between them.
* This sort of parsing method allows for PHP to be embedded in different sorts of documents
* Note: If a file *only* contains PHP code, it is preferable to omit the PHP closing tag at the end of the file.
  * This prevents accidental whitespace or new lines being added after the PHP closing tag, which may cause unwanted effects because PHP will start output buffering when there is no intention to from the programmer

So let's see Hello World:
```php
<?php
echo 'Hello World';
```
If this were a file, we can run it from the terminal using `php FILE_PATH`

**Side note:** How to see PHP in the browser? Run a built-in server! `php -S <addr>:<port>` => `php -S localhost:8888` For more PHP commands, use help menu `php -h`

## Variables
* Declaration syntax: `$<varname> = <val>`
* Note that if you'd like to interpolate a variable in a str, you *must* use double-quotes
  * `echo 'Hello $name'` => Hello $name
  * `echo "Hello $name"` | `echo "Hello {$name}"` => Hello Nicholas
  * You can always concat a str too though: `echo 'Hello ' . $name` => Hello Nicholas

**Side note:** `<?=` is shorthand for `<?php echo`; but don't forget the closing tag!

## Arrays
* `$names = [];` -- same as JS declaration
* `foreach ($names as $name) { ... }`
* In PHP there are also associative arrays; arrays that use key/value pairs
```php
$ages = array('John'=>35,'Jane'=>25)
$hair_colors = ['John'=>'brown','Jane'=>'blonde']
```

**Side note:** we can use `vardump()` to print types such as arrays and associative arrays. Also common practice to see `die(vardump())`, essentially print the var then exit.




