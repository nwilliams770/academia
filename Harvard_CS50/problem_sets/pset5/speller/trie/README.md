# Questions

## What is pneumonoultramicroscopicsilicovolcanoconiosis?

An artificial up long word used to mean lung disease caused by inhaling fine ash and sand dust

## According to its man page, what does `getrusage` do?

getrusage() gets metrics on resource usage

## Per that same man page, how many members are in a variable of type `struct rusage`?

16 according to the documentation

## Why do you think we pass `before` and `after` by reference (instead of by value) to `calculate`, even though we're not changing their contents?

Best guess it to be more memory efficient so we're not making duplicate copies of those values.

## Explain as precisely as possible, in a paragraph or more, how `main` goes about reading words from a file. In other words, convince us that you indeed understand how that function's `for` loop works.

First we allocate space for the maximum possible word length (specified by LENGTH in helpers): 45 chars + 1 for the \0

## Why do you think we used `fgetc` to read each word's characters one at a time rather than use `fscanf` with a format string like `"%s"` to read whole words at a time? Put another way, what problems might arise by relying on `fscanf` alone?

If we read entire words at a time, we might allow forbidden words such as those containing numbers or special characters.

## Why do you think we declared the parameters for `check` and `load` as `const` (which means "constant")?

To declare that those pointers must not be changed.
