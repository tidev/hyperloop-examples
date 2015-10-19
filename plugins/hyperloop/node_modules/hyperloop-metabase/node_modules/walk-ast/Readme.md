
# walk-ast

  Properly walk the Javascript AST. Works with Esprima and Acorn. Includes references to the parent nodes for traversal. Uses a depth-first search.

  Largely based off of Marijnh's acorn walk utility: https://github.com/marijnh/acorn/blob/master/util/walk.js

## Install

    npm install walk-ast

## Example

```js
var ast = acorn.parse(js);
walk(ast, function(node) {
  console.log(node.parentNode);
  // ...
});
```

## API

### walk(ast, fn)

Walk all the nodes of the AST. Adds a reference to the parent under `node.parentNode`. Function `fn` called for each node.

## License

(The MIT License)

Copyright (c) 2013 Matthew Mueller &lt;mattmuelle@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
