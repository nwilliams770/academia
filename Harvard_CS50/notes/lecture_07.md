## Lecture 7 Dynamic Programming
- Name designed to sound cool to RAND management and US Dept of Defense.. a more descriptive name is a look-up table
- A way of looking at certain kind of problems (a category of algorithms):
    - I end up asking the same question over and over, so rather than doing that work all over, we save the answer and just look it up for when we're asked again
    - An example:
        - for (int i; i < strlen(str); i++)
            - we're asking to calc strlen each iteration, easier to just store length in a var for later look up!
- Note that, in each example case, we HAVE to fill out the entire table, this may be n^2 cells but that's way less than doing EVERY possible combination
- Example of this is Image Composition, Seam Carving, DNA strand matching