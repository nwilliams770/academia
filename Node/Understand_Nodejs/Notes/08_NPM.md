### Packages and Package Managers
- **Package Mgmt System**: automates installing and updating package and manages dependencies.
- Semantic Versioning: (1.7.2) major.minor.patch

### Review: init, nodemon, package.json
- npm init common command even for non-Node projects because of the ease in setting up
- "^2.10.6" the ^ means any patch or minor update will be done automatically; ~ means only patches
- You can access packages via the require func and like core Node features, we don't need to specify a diretory (ex: var moment = require("moment") )
- we can specify dev dependencies as well from the CLI using npm such as testing packages (by saying --save-dev)
- we can also use the CLI to download packages globally (ex: npm install -g nodemon)
- Why use nodemon? Nodemon will allow us to run our app and watches if any files change then restart server accordingly, super helpful! Smart to install globally