[source](https://www.openvim.com/)
<!-- Two modes -->
* Two basic modes in Vim:
    - `insert` mode in which you write text as if in a normal text editor
    - `normal` mode which provides you efficient ways to navigate and manipulate text
    - Can check mode in the top bar at the top of the editor
    - use "Esc" for normal mode and "i" for insert mode
<!-- Basic movement -->
* Use keys h, j, k, l instead of arrow keys to move cursor
    - h - left
    - j - down
    - k - up
    - l - right
<!-- Word movement -->
* To navigate text in terms of words you can use keys w, b, and e (W, B, E in real Vim.)
    - w - start of next word
    - e - end of word
    - b - beginning of word
<!-- Number powered movements -->
* You can combine movement keys with a number in order to move more quickly
    - "3w" is equivalent of pressing w three times
<!-- Insert text repeatedly -->
* You can insert text multiple times using numbers as well
<!-- Find chars -->
* To find and move to next or previous occurence of a character, use f and F e.g. fo finds next o.
* Can combine f with a number to find #th occurence e.g. 3fq finds 3rd occurence of 'q'
<!-- Go to matching parens/brackets -->
* In text structured with ( or { or [, use % to jump to matching parenthesis or bracket.
<!-- Start/end of line -->
* To reach start  of line, press 0, get to end of line with $
<!-- Find word under cursor -->
* Find next occurence of word under cursor with * and previous with #
<!-- Goto line -->
* gg takes you to beginning of file, G to the end
* To jump to specific line, give line_numberG
<!-- Search text -->
* Can search for text using /(search_term); can repeat search for previous and next occurence using n and N, respectively
<!-- Insert new line -->
* To insert into a new line, press o or O
* After new line is created, editor set to insert mode
<!-- Removing char -->
* x and X delete char under cursor and to the left of cursor, respectively
<!-- Replace char -->
* When you need to replace only one char under your cursor, without changing to insert mode, use r
<!-- deleting -->
* d is the delete command; you can combine it with movement e.g. dw deletes the first word on the right side of the cursor
    - on real Vim, it also copies content so that you can paste it with p to another location
<!-- repetition with . -->
* to repeat previous command, just press .
<!-- visual mode -->
* Vim also has visual mode, where you select text using movement keys before you decide what to do with it
* Goto visual mode with v
<!-- Real vim -->
* Most important commands are :w (save), :q (quit) and :q! (quit without saving)
* u for undo, ctrl+R for redo
* list of commands with :help