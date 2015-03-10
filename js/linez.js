var StringFinder = require('./StringFinder');
var lineEndingFinder;
function linez(text) {
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
    return new linez.Document(lines);
}
// ReSharper disable once InconsistentNaming
var linez;
(function (linez) {
    var Document = (function () {
        function Document(lines) {
            this.lines = lines || [];
        }
        Document.prototype.toString = function () {
            if (!this.lines) {
                return '';
            }
            return this.lines.map(function (line) {
                return line.text + (line.ending || '');
            }).join('');
        };
        return Document;
    })();
    linez.Document = Document;
    function configure(options) {
        options = options || {};
        if (options.newlines) {
            lineEndingFinder = new StringFinder(options.newlines);
        }
    }
    linez.configure = configure;
    function resetConfiguration() {
        lineEndingFinder = new StringFinder(/\r?\n/g);
    }
    linez.resetConfiguration = resetConfiguration;
})(linez || (linez = {}));
linez.resetConfiguration();
module.exports = linez;
