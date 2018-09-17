#### Lecture 3
- When composing a string, we MUST EXPLICITLY include room for the \0; if we do not, the last character of our string will be cut off due to lack of allocated memory!
- Big O (upper bound), Big Omega (lower bound); if upper bound and lower bound are the same, we use Theta
- `main` will return `0` by default and should return `1` if any error is encountered