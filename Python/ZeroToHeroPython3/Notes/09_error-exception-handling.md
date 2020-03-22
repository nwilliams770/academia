## Error and Exception Handling
* Errors in our code will terminate the script so error handling allows us to deal with people using our code in unexpected ways and keep moving on even if there is an error
* Three main keywords:
    - try: this block of code to be attempted (may lead to an error)
    - except: Block of code will execute in case there is an error in try block
    - finally: final block of code to be executed, regardless of an error
* One pattern is to have a try-except-else block: try to run this code, run this if there is an error, if no error do this
* Note that except can be used in conjunction with an error to only address certain kinds of errors; `except TypeError` is an example. Otherwise it will address all errors.
* One can also have `except TypeError:` and `except:` following it to deal with a specific exception as well as all other exceptions
* We can also use this to get specific input from our user:
```python
def ask_for_int():
    while True:
        try:
            result = int(input("Please provide a number:"))
        except:
            print ("Whoops! That is not a number")
            continue
        else:
            print("Thanks!")
            break
        finally:
            print("I can run with else and will always run at the end")
```

### Pylint
* There are several testing tools, two of which are pylint (looks at code and reports back possible issues) and unittest (test your own programs and check that we are getting desired results)
* We can go in `pylint script.py` and it will generate a report about your code as well as a score out of 10.0
* Writing unit tests:
```python
import unittest
import somemodule
class TestSomeScript(unittest.TestCase):

    def test_one(self):
        text = 'python'
        result = somemodule.script_to_test(text)
        self.assertEqual(result, 'Python')

if __name__=='__main__':
    unittest.main()
```