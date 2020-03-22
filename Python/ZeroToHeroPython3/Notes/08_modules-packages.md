## Modules and Packages
### Pip install and PyPi
* We can use pip install to install open-sourced packges on PyPi
* *module*: Python scripts that you call in another Python script
* Packages are collections of modules

### Modules and Packages
* Packages are represented as directories but require an `__init__.py` file to denote that
* `from MyMainPackage import some_main_script`
* `from MyMainPackage.SubPackage import some_sub_script`

### __name__ and "__main__"
* `if __name__ == __main__` you'll eventually see this a lot when loking at other scripts
* Sometimes when you are importing from a module, you'd like to know whether a module function is being used as an important or if you are using the original .py of that module
* `__name__` is a built-in variable that allows to determine whether the given module is the entry point of the cude execution
* We can define all of our functions and classes at the top level and have all our code execution logic is a block under that if statement


