## Web Scraping
### webbrowser module
* `webbrowser` module allows us to open a URL with the `open(url)` function
* let's say we wanted to open a browser window and get something from the internet and we could do all this from the command line, how could we do so?
    - first, we can get the arguments using `sys.argv`
    - then do whatever processing we need to do with that argument

### Downloading from the Web with Requests module
* `response_object = requests.get()`
* we can use the `raise_for_status()` method to make sure the request went through successfully; it will only raise an exception with an unsuccessful request
    - `for chunk in res.iter_count(bytes)` - parse our data in chunks
* note that when downloading web pages, we have to use the `wb` (write binary) mode as the text will be Unicode

### Parsing HTML with Beautiful Soup
* `bs4` module allows us to actually scrape from the webpage using css selectors
* using selenium, we can actively browse the web to get content through complex actions