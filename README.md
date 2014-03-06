# linez

> Parses lines from text, preserving line number, offset and line endings.

[![Build Status][]](http://travis-ci.org/jedmao/linez)
[![Dependency Status][]](https://gemnasium.com/jedmao/linez)
[![NPM version][]](http://badge.fury.io/js/linez)
[![Views][]](https://sourcegraph.com/github.com/jedmao/linez)

[![NPM](https://nodei.co/npm/linez.png?downloads=true)](https://nodei.co/npm/linez/)


# Getting Started

## Installation

```bash
$ npm install linez
```

## TypeScript Usage

```ts
/// <reference path="node_modules/linez/linez.d.ts" />
import linez = require('linez');
```

## JavaScript Usage

```js
var linez = require('linez');
```


# Introduction

By default, linez uses `/\r?\n/g` as the regular expression to detect newline
character sequences and split lines.

This regular expression is tuned for performance and only covers the most common
newline types (i.e., `\n` and `\r\n`).

If you have need for more newline character sequences, you can configure linez
with a convenient `newlines` property.

```js
linez.newlines = ['\n', '\r\n', '\r', '\u000B'];
```

Setting this property will automatically create a piped regular expression for you
and use it in any future `linez.parse()` calls.

You can make up your own newlines if you want. Linez doesn't care one way or the other.

```js
linez.newlines = ['foo', 'bar'];
```

Newlines are just strings. They can be anything.
There are, however, some known newline character sequences.
Should you need them, refer to the following table:

| String   | Unicode        | Name                        |
| -------- |:-------------- |:--------------------------- |
| `\n`     | U+000A         | Line feed                   |
| `\r\n`   | U+000D, U+000A | Carriage Return + Line Feed |
| `\r`     | U+000D         | Carriage Return             |
| `\u000B` | U+000B         | Vertical Tab                |
| `\u000C` | U+000C         | Form Feed                   |
| `\u0085` | U+0085         | Next Line                   |
| `\u2028` | U+2028         | Line Separator              |
| `\u2029` | U+2029         | Paragraph Separator         |


# API

### newlines

Set this property to configure linez to use any number of newline character
sequences.

```js
linez.newlines = ['\n', '\r\n', '\r', '\u000B'];
```

### parse(text: string): void

Parses text into lines, each of which is defined by the
[ILine](https://github.com/jedmao/linez/blob/master/lib/ILine.ts) interface.

```ts
interface ILine {
  offset: number;
  number: number;
  text: string;
  ending?: string;
}
```

[The specs](https://github.com/jedmao/linez/blob/master/test/spec/lib/Linez.ts)
show great usage examples.

```ts
var lines = linez.parse('foo\nbar\nbaz');
lines[1].offset; // 4
lines[1].number; // 2
lines[1].text; // bar
lines[1].ending; // \n
```


## License

Released under the MIT license.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/jedmao/linez/trend.png)](https://bitdeli.com/free "Bitdeli Badge")



[Build Status]: https://secure.travis-ci.org/jedmao/linez.png?branch=master
[Dependency Status]: https://gemnasium.com/jedmao/linez.png
[NPM version]: https://badge.fury.io/js/linez.png
[Views]: https://sourcegraph.com/api/repos/github.com/jedmao/linez/counters/views-24h.png
