## Regular Expressions
* A means of searching text via text patterns, `re` module
* Regex strs often use blackslashes (like \d) so they are often raw strings r'\d'
* Some methods from `re` module:
    - `compile()` creates regex object
    - regex object's `search()` creates a match object
    - match object's `group()` method gets matched string if match found

Sidenote: means of having moving pointer
```python
for i in range(len(some_list)):
    chunk = some_list[i:i+chunk_size]
```

### Regex Groups and Pipe Character
* `r'\d\d\d-\d\d\d-\d\d\d\d`, an expression to look for phone # patterns, can be revised to `r'(\d\d\d)-(\d\d\d-\d\d\d\d)` to create two distinct groups, starting at 1, not 0
    - `match_object.group(1)` => returns just area codes
    - `match_object.group(group#)`
    - To search for actual parenthesis in a regex expression, we must escape it `\(`
* Pipe operator `|` can match one of many possible groups `r'Bat(man|mobile|copter|bat)'`

### Repetition in Regex Patterns and Greedy/Non-Greedy Matching
* Matching a specific number of repetitions
    - `r'Bat(wo)?man'` - `?` denotes group can appear 0 or 1 times
    - `r'Bat(wo)*man'` - `*` denotes group can appear 0 or more times
    - `r'Bat(wo)+man'` - `+` denotes group can appear 1 or more times
    - `r'(Ha){3}'` - `{num}` denotes group must appear `num` times
    - `r'(Ha){3, 5}'` - `{min, max}` denotes group must appear within a range of `min` and `max` times (`{,3}`, `{3,}` means 0 - 3 occurences and 3 or more occurences respectively)

### Regex Char Class and findall()
* `findall()` looks for all matches of a particular pattern
    - This method returns a list of possible matches but if your pattern has groups, it it will return a list of tuples
    - note that we can have nested groups as well e.g. we can pull out a phone number, an area code, and the phone number *with* the area code
* Like \d, there are multiple character classes that allow us to more easily denote what kind of text we are searching for
* We can create our own char classes using `[]`
    - `vowelRegex = re.compile(r'[aeiouAEIOU]')` # r'(a|e|i|o|u)'
        - `r'[aeiouAEIOU]{2}'` (vowels that appear in groups of two)
    - can also do ranges `re.compile(r'[a-zA-F]')`
    - `^` denotes a negative character class `r'[^aeiouAEIOU]'` finds everything that *isn't* those chars

### Dot-Star and Caret/Dollar Chars
* `^` can be used to search for patterns at the beginning of the str and `$` can be used to search for patterns at the end of the str
* `.` is a wildcard and denotes anything that isn't a new line (a single char)
* `.*` anything for 0 or more, used to search for pretty much anything
* `.*` is greedy, tries to match as much text possible; `.*?` is non-greedy; greedy will encapsulate as much text as possible within the pattern
* `.compile(r'.*', re.DOTALL)` - searches everything including newline chars
* we can also have a `re.IGNORECASE` or `re.I` to do case insensitive matching

### sub() method and verbose mode
* `sub(replacement_str, str_to_get_replaced)` let's us do a find and replace
    * note that we can use `\group#` syntax in the replacement str to use part of the pattern we were searching for
* `re.VERBOSE` option - allows us to use a `'''` multi-line str that ignores whitespace in regex expression, allowing addition of comments and modularization of more complex expressions
* We can pass multiple option arguments to the `compile()` method using `|`