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
    lines[1].newline.character; // linez.newlines.lf
});
```


### JavaScript

```js
var linez = require('linez');

linez.parse('foo\nbar\n').done(function(lines) {
    lines.length; // 2
    lines[0].text; // foo
    lines[1].text; // bar
    lines[1].newline.character; // linez.newlines.lf
});
```


## Linez Interface


### parse(text: string)
- Returns: `Promise`


### parseSync(text: string)
- Returns: [Line][][]


### Line

#### constructor(raw?: string, options?: [LineOptions][])
Parses the [newline][], [text][], [BOM][] and [charset][] out of a raw string.

#### number
- Type: `number`
Gets or sets the line's line [number][]. Setting this value to `1` will detect and set both [BOM][] signature and [charset][]. Setting to a value other than `1` will delete both [BOM][] signature and [charset][].

#### bom
- Type: [BOM](#BOM)
Gets or sets the line's [BOM][] signature. Setting a new [BOM][] will change the line [number][] to `1` and set the appropriate [charset][] for the new [BOM][].

#### charset
- Type: [charsets](#charsets)
Gets or sets the line's [charset][]. Setting a new [charset][] will change the line [number][] to `1` and set the appropriate [BOM][] signature for the new [charset][].

#### text
- Type: `string`
Gets or sets the line's [text][].

#### newline
- Type: [Newline](#newline)
Gets or sets the line's [newline][] character or character sequence.

#### raw
- Type: `string`
Gets the [BOM][] signature plus the line [text][] plus the [newline][]. This property has no setter.

#### toString()
- Returns: `string`
Returns just the [text][] portion of the line, with the [BOM][] and [newline][] stripped off. This is the same as getting `line.text`.


### LineOptions
Used to explicitly set properties on a line upon creation. Line options will override anything parsed from the [raw][] line string.

#### number
- Optional
Explicitly sets the line's [number][] upon creation.

#### bom
- Optional
Explicitly sets the line's [BOM][] signature upon creation.

#### charset
- Optional
Explicitly sets the line's [charset][] upon creation.

#### newline
- Optional
Explicitly sets the line's [newline][] character or character sequence upon creation.

#### text
- Optional
Explicitly sets the line's [text][] upon creation.


### BOM

#### constructor(signature?: string)

#### signature
- Type: `string`

#### charset
- Type: [charsets][]

#### length
- Type: `number`

#### toString()
- Returns: `string`

#### detect(s: string)
- Static
- Returns: [BOM][]


### boms
A hash table for all supported [BOM][] types.

#### bom.utf_8
- Value: `\u00EF\u00BB\u00BF`

#### bom.utf_16le
- Value: `\u00FF\u00FE`

#### bom.utf_16be
- Value: `\u00FE\u00FF`

#### bom.utf_32le
- Value: `\u00FF\u00FE\u0000\u0000`

#### bom.utf_32be
- Value: `\u0000\u0000\u00FE\u00FF`


### Newline

#### constructor(character?: string)

#### character
- Type: `string`

#### name
- Type: `string`

#### length
- Type: `number`

#### toString()
- Type: `string`

#### pattern
- Static
- Type: `RegExp`
Gets the newline pattern used to parse newlines out of text.

#### detect(lineText: string)
- Static
- Returns: [Newline][]


### newlines
A hash table for all possible newline types.

#### newlines.lf
- Value: `\n`
Line feed.

#### newlines.crlf
- Value: `\r\n`
Carriage return, line feed.

#### newlines.cr
- Value: `\r`
Carriage return.

#### newlines.vt
- Value: `\u000B`
Vertical tab.

#### newlines.ff
- Value: `\u000C`
Form feed.

#### newlines.nel
- Value: `\u0085`
Next line.

#### newlines.ls
- Value: `\u2028`
Line separator.

#### newlines.ps
- Value: `\u2029`
Paragraph separator.


### charsets
An enum for all supported charsets.

#### charsets.latin1
- Value: `0`

#### charsets.utf_8
- Value: `1`

#### charsets.utf_8_bom
- Value: `2`

#### charsets.utf_16be
- Value: `3`

#### charsets.utf_16le
- Value: `4`

#### charsets.utf_32be
- Value: `5`

#### charsets.utf_32le
- Value: `6`


## License

Released under the MIT license.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/jedmao/linez/trend.png)](https://bitdeli.com/free "Bitdeli Badge")



[Build Status]: https://secure.travis-ci.org/jedmao/linez.png?branch=master
[Dependency Status]: https://gemnasium.com/jedmao/linez.png
[NPM version]: https://badge.fury.io/js/linez.png
[Views]: https://sourcegraph.com/api/repos/github.com/jedmao/linez/counters/views-24h.png
[boms]: #boms
[BOM]: #bom
[charsets]: #charsets
[Line]: #line
[LineOptions]: #lineoptions
[newlines]: #newlines
[Newline]: #newline
[parse]: #parse
[parseSync]: #parsesync
