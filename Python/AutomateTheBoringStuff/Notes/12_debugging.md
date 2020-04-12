### Debugging
### raise and assert
* Python raises exceptions when it encounter invalid code
* `raise Exception(message)` to raise our own exceptions
* An assertion is a sanity check to make sure your code isn't doing something obviously wrong.
    - `assert condition, error_message`
    - I assert this condition should always hold true and if not, there's a bug in our program; these statements are for programmer errors not user errors, those should raise exceptions

### logging
* `logging` module we help with logging while debugging
    - `logging.basicConfig(*optional* filename='filetologto.txt' level1=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s)` | code for basic logging setup
    - from there  we can add `logging.debug(marker_message)` statements
* why is using this module easier than just using `print`? Because we can stop all logging messages just by using using `logging.disable(logging.CRITICAL)`
    - why CRITICAL? There are five log levels, from debug to critical
    - by disabling at the CRITICAL level, we are disabling logging messages on every tier