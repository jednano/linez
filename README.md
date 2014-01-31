# linez

> Parses lines from text, preserving BOM signature and newline characters.

[![Build Status][]](http://travis-ci.org/jedmao/linez)
[![Dependency Status][]](https://gemnasium.com/jedmao/linez)
[![NPM version][]](http://badge.fury.io/js/linez)
[![Views][]](https://sourcegraph.com/github.com/jedmao/linez)

[![NPM](https://nodei.co/npm/linez.png?downloads=true)](https://nodei.co/npm/linez/)

## Usage


### TypeScript

```ts
/// <reference path="node_modules/linez/linez.d.ts" />
import linez = require('linez');

linez.parse('foo\nbar\n').done((lines: Line[]) => {
    lines.length; // 2
    lines[0].text; // foo
    lines[1].text; // bar
    lines[1].newline.character; // linez.Newline.map.lf
});
```


### JavaScript

```js
var linez = require('linez');

linez.parse('foo\nbar\n').done(function(lines) {
    lines.length; // 2
    lines[0].text; // foo
    lines[1].text; // bar
    lines[1].newline.character; // linez.Newline.map.lf
});
```


## License

Released under the MIT license.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/jedmao/linez/trend.png)](https://bitdeli.com/free "Bitdeli Badge")



[Build Status]: https://secure.travis-ci.org/jedmao/linez.png?branch=master
[Dependency Status]: https://gemnasium.com/jedmao/linez.png
[NPM version]: https://badge.fury.io/js/linez.png
[Views]: https://sourcegraph.com/api/repos/github.com/jedmao/linez/counters/views-24h.png
