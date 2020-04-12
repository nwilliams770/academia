## Dictionaries
* Check if a value exists: `value in dict.values()` returns bool
* `get(key, default_value_to_return)` We can use this method to get values that may or may not have a key in a given dict without running into a KeyError, instead it will just return the default value specified
* `setdefault(key, value to set it to only if key doesn't exist)`
* We can print dicts in a much more visually manually using `pprint` method in `pprint` module