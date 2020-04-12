## Files
* Root folder: folder that contains every other folder on the hardrive (duh?)
* `os` module contains functionality to get file pathing to work on all operating systems: `os.path.join(directory_list)`
    - `os.getcwd()`
    - `os.chdr()`
    - `os.path.abspath(file_path)`
    - `os.path.isabs(file_path)`
    - `
* Absolute file path always begins with root folder, relative is based off of current working directory
* more complex data structures can be stored in a binary file using the `shelve` module, shelfFiles are very similar to dicts, using keys and values

### Copying and Moving Files and Folders
* `shutil` module
    - can be used for copying files into new folders, renaming them at the same time
    - can copy everything inside a folder
    - note, moving a file to a folder with a new name is the only means of renaming

### Deleting Files
* can use `os.unlink(path)`
* `os.rmdir()` -- can only delete an empty folder
* `shutil.rmtree()` deletes a folder and all its contents
* usually nice to do a dry run before running this kind of code; comment out the line deleeting files and instead print all files to make sure you will delete the right ones
* `send2trash` module sends items to recycling bin, much safer!

### Walking A Directory Tree
* `for folderName, subFoldersList, filenames os.walk(root_folder)`
    - a means of walking all the files and folders in a given directory
    - note we can nest `for` looks to walk all the subfolders
* `os.join()` for getting file paths