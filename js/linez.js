var StringFinder = require('./StringFinder');
var lineEndingFinder;
function linez(text) {
    // ReSharper disable once RedundantQualifier
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
            return this.lines.map(function (line) {
                return line.text + (line.ending || '');
            }).join('');
        };
        return Document;
    })();
    linez.Document = Document;
    function configure(options) {
        if (!options) {
            throw new Error('No configuration options to configure');
        }
        /* istanbul ignore else */
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
