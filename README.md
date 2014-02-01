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
Returns: `Promise`


### parseSync(text: string)
Returns: [Line][][]


### Line

#### constructor(raw?: string, options?: [LineOptions][])
Parses the [newline][], [text][], [BOM][] and [charset][] out of a raw string.

#### number
Type: `number`<br>
Gets or sets the line's line [number][]. Setting this value to `1` will detect and set both [BOM][] signature and [charset][]. Setting to a value other than `1` will delete both [BOM][] signature and [charset][].

#### bom
Type: [BOM](#BOM)<br>
Gets or sets the line's [BOM][] signature. Setting a new [BOM][] will change the line [number][] to `1` and set the appropriate [charset][] for the new [BOM][].

#### charset
Type: [charsets](#charsets)<br>
Gets or sets the line's [charset][]. Setting a new [charset][] will change the line [number][] to `1` and set the appropriate [BOM][] signature for the new [charset][].

#### text
Type: `string`<br>
Gets or sets the line's [text][].

#### newline
Type: [Newline](#newline)<br>
Gets or sets the line's [newline][] character or character sequence.

#### raw
Type: `string`<br>
Gets the [BOM][] signature plus the line [text][] plus the [newline][]. This property has no setter.

#### toString()
Returns: `string`<br>
Returns just the [text][] portion of the line, with the [BOM][] and [newline][] stripped off. This is the same as getting `line.text`.


### LineOptions
Used to explicitly set properties on a line upon creation. Line options will override anything parsed from the [raw][] line string.

#### number
Optional<br>
Explicitly sets the line's [number][] upon creation.

#### bom
Optional<br>
Explicitly sets the line's [BOM][] signature upon creation.

#### charset
Optional<br>
Explicitly sets the line's [charset][] upon creation.

#### newline
Optional<br>
Explicitly sets the line's [newline][] character or character sequence upon creation.

#### text
Optional<br>
Explicitly sets the line's [text][] upon creation.


### BOM

#### constructor(signature?: string)

#### signature
Type: `string`

#### charset
Type: [charsets][]

#### length
Type: `number`

#### toString()
Returns: `string`

#### detect(s: string)
Static<br>
Returns: [BOM][]


### boms
A hash table for all supported [BOM][] types.

| key       | value                      |
| --------- | -------------------------- |
| utf_8     | `\u00EF\u00BB\u00BF`       |
| utf_16be  | `\u00FE\u00FF`             |
| utf_16le  | `\u00FF\u00FE`             |
| utf_32be  | `\u0000\u0000\u00FE\u00FF` |
| utf_32le  | `\u00FF\u00FE\u0000\u0000` |


### Newline

#### constructor(character?: string)

#### character
Type: `string`

#### name
Type: `string`

#### length
Type: `number`

#### toString()
Type: `string`

#### pattern
Static<br>
Type: `RegExp`<br>
Gets the newline pattern used to parse newlines out of text.

#### detect(lineText: string)
Static<br>
Returns: [Newline][]


### newlines
A hash table for all possible newline types.

| key  | value    | description                |
| ---- | -------- | -------------------------- |
| lf   | `\n`     | Line feed                  |
| crlf | `\r\n`   | Carriage return, line feed |
| cr   | `\r`     | Carriage return            |
| vt   | `\u000B` | Vertical tab               |
| ff   | `\u000C` | Form feed                  |
| nel  | `\u0085` | Next line                  |
| ls   | `\u2028` | Line separator             |
| ps   | `\u2029` | Paragraph separator        |


### charsets
An enum for all supported charsets.

| key       | value |
| --------- | ----- |
| latin1    | 0     |
| utf_8     | 1     |
| utf_8_bom | 2     |
| utf_16be  | 3     |
| utf_16le  | 4     |
| utf_32be  | 5     |
| utf_32le  | 6     |


## License

Released under the MIT license.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/jedmao/linez/trend.png)](https://bitdeli.com/free "Bitdeli Badge")



[Build Status]: https://secure.travis-ci.org/jedmao/linez.png?branch=master
[Dependency Status]: https://gemnasium.com/jedmao/linez.png
[NPM version]: https://badge.fury.io/js/linez.png
[Views]: https://sourcegraph.com/api/repos/github.com/jedmao/linez/counters/views-24h.png
[boms]: #boms
[BOM]: #BOM
[charsets]: #charsets
[Line]: #line
[text]: #text
[charset]: #charset
[number]: #number
[raw]: #raw
[LineOptions]: #lineoptions
[newlines]: #newlines
[Newline]: #newline
