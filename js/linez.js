/* istanbul ignore next: TypeScript extend */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var _Document = require('./Document');
var StringFinder = require('./StringFinder');
var lineEndingFinder = new StringFinder(/\r?\n/g);
// ReSharper disable once InconsistentNaming
var linez;
(function (linez) {
    var Document = (function (_super) {
        __extends(Document, _super);
        function Document() {
            _super.apply(this, arguments);
        }
        return Document;
    })(_Document);
    linez.Document = Document;
    function configure(options) {
        options = options || {};
        if (options.newlines) {
            lineEndingFinder = new StringFinder(options.newlines);
        }
    }
    linez.configure = configure;
    function parse(text) {
        var lines = [];
        var lineNumber = 1;
        var lineOffset = 0;
        lineEndingFinder.findAll(text).forEach(function (lineEnding) {
            lines.push({
                number: lineNumber++,
                offset: lineOffset,
                text: text.substring(lineOffset, lineEnding.index),
                ending: lineEnding.text
            });
            lineOffset = lineEnding.index + lineEnding.text.length;
        });
        if (lineOffset < text.length || text === '') {
            lines.push({
                number: lineNumber,
                offset: lineOffset,
                text: text.substr(lineOffset)
            });
        }
        return new Document(lines);
    }
    linez.parse = parse;
})(linez || (linez = {}));
module.exports = linez;
