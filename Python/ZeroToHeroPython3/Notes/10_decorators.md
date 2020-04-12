## Decorators
* Decorators allows you to tack on extra functionality to an already existing function or remove it on the fly, using the `@` operator
```python
def decorator(original_func):
    def wrap_func():
        print("Code before the original func")
        original_func()
        print("Code after the original func")

def func_needs_decorator:
    print("decorate me")

decorated_func = new_decorator(func_needs_decorator)
# We have special syntax for this line above
@new_decorator
def func_needs_decorator:
    print("decorate me")
```