# Stanford CS106B Lecture: Backtracking (diceRolls, diceSum)
Write a recursive function `diceRoll` that accepts an integer representing a number of 6-sided dice to roll, and output all possible combinations of values that could appear on the dice.

- We want to generate all possible sequences of values, this is called depth-first search
- You may think that for loops are the way to approach this problem but how many loops are needed and how can be completely explore such a large search space? Enter **backtracking**
- **Backtracking**: Finding solution(s) by trying partial solutions and then abandoning them if they are not suitable.
    - a "brute force" algorithmic technique (tries all paths)
    - often implemented recursively

    Applications:
    - producing all permutations of a set of values
    - parsing languages
    - games: anagrams, crosswords, word jumbles, 8 queens
    - combinatorics and logic-programming
    - escaping a maze!

- A general pseudo-code algorithm for backtracking problems:
    - Explore(decisions):
        - if there are no more decisions to make: stop.
        - else, let's handle one decision ourselves, and the rest by recursion for each available choice C for this decision:
            - Choose C
            - Explore the remaining choices that could follow C
            - un-choose C

- What is an appropriate base case for our dice example exploration? When there's no dice left to roll, menas we've made all the choices, and print it out
