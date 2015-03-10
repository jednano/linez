# linez

> Parses lines from text, preserving line numbers, offsets and line endings.

[![Build Status](https://secure.travis-ci.org/jedmao/linez.svg?branch=master)](http://travis-ci.org/jedmao/linez)
[![Code Climate](https://codeclimate.com/github/jedmao/linez/badges/gpa.svg)](https://codeclimate.com/github/jedmao/linez)
[![Test Coverage](https://codeclimate.com/github/jedmao/linez/badges/coverage.svg)](https://codeclimate.com/github/jedmao/linez)
[![Dependency Status](https://gemnasium.com/jedmao/linez.svg)](https://gemnasium.com/jedmao/linez)
[![npm version](https://badge.fury.io/js/linez.svg)](http://badge.fury.io/js/linez)
[![Views](https://sourcegraph.com/api/repos/github.com/jedmao/linez/counters/views-24h.svg)](https://sourcegraph.com/github.com/jedmao/linez)

[![npm](https://nodei.co/npm/linez.png?downloads=true)](https://nodei.co/npm/linez/)


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

By default, linez uses `/\r?\n/g` as the regular expression to detect newline character sequences and split lines. This regular expression is tuned for performance and only covers the most common newline types (i.e., `\n` and `\r\n`). If you have need for more newline character sequences, you can configure linez with the `configure` method.

```js
linez.configure({
  newlines: ['\n', '\r\n', '\r', '\u000B']
});
```

Setting this property will automatically create a piped regular expression for you and use it in any future `linez()` calls. You can make up your own newlines if you want. Linez doesn't care one way or the other.

```js
linez.configure({
  newlines: ['foo', 'bar']
});
```

This would be converted into `/(foo|bar)/g`. Newlines are just strings. They can be anything. There are, however, some known newline character sequences. Should you need them, refer to the following table:

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


### configure(options: IOptions)

Configures linez to use the supplied options. Currently, only the newlines property is available, where you can specify any number of newline character sequences.

```js
linez.configure({
  newlines = ['\n', '\r\n', '\r', '\u000B']
});
```

### resetConfiguration()

Resets the configuration to the default settings, using `/\r?\n/g` as the newlines regular expression.


### Document

```ts
constructor(public lines: Line[]);
```

Calling the `toString()` method converts the documents lines into a string, discarding information about line numbers and offsets.


### Line

```ts
interface Line {
  offset: number;
  number: number;
  text: string;
  ending?: string;
}
```

### Options

```ts
interface Options {
  newlines?: string[];
}
```


### linez(text: string): Document

Parses text into a `Document`.

[The specs](https://github.com/jedmao/linez/blob/master/lib/linez.spec.ts) show some great usage examples.

```ts
var lines = linez('foo\nbar\nbaz').lines;
lines[1].offset; // 4
lines[1].number; // 2
lines[1].text; // bar
lines[1].ending; // \n
```


## License

Released under the MIT license.
