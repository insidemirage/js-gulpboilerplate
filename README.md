## Simple gulp boilerplate
It's a simple boilerplate for beginner front-end developers.
## What can that do:
- Nunjucks templates (u could toggle it)
- Html minify (build only)
- Sass minify and build
- Js minify
- Babel
- Images minify
- Live reload
## Get started:
Install gulp-cli:   
```bash
npm i gulp-cli -g 
```
Install packages:   
```bash 
npm i 
```

## Watch mode:
```bash
gulp 
```

## Build:
```bash
gulp build 
```

## Adding more SCSS entry points:
In gulpfile.js:
```javascript
...
const del = require('del');

let scssImports = ["src/scss/index.scss", "src/scss/yourfile.css", "src/scss/yourfile2.css"] 

const USE_TEMPLATES = true;
...
```

## Notice:
The piggy logo is prohibited for use in projects that is not Ravelabs projects. It's under copyright.