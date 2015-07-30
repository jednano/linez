var iconv = require('iconv-lite');
var bufferEquals = require('buffer-equals');
var StringFinder = require('./StringFinder');
var lineEndingFinder;
iconv.extendNodeEncodings();
var boms = {
    'utf-8-bom': new Buffer([0xef, 0xbb, 0xbf]),
    'utf-16be': new Buffer([0xfe, 0xff]),
    'utf-32le': new Buffer([0xff, 0xfe, 0x00, 0x00]),
    'utf-16le': new Buffer([0xff, 0xfe]),
    'utf-32be': new Buffer([0x00, 0x00, 0xfe, 0xff])
};
function linez(file) {
    // ReSharper restore RedundantQualifier
    if (typeof file === 'string') {
        return new linez.Document(parseLines(file));
    }
    var buffer = file;
    var doc = new linez.Document();
    doc.charset = detectCharset(buffer);
    var bom = boms[doc.charset];
    var encoding = doc.charset.replace(/bom$/, '');
    if (Buffer.isEncoding(encoding)) {
        doc.lines = parseLines(buffer.slice(bom.length).toString(encoding));
    }
    else {
        doc.lines = parseLines(buffer.toString('utf8'));
    }
    return doc;
}
function detectCharset(buffer) {
    var bomKeys = Object.keys(boms);
    for (var i = 0; i < bomKeys.length; i++) {
        var charset = bomKeys[i];
        var bom = boms[charset];
        if (bufferEquals(buffer.slice(0, bom.length), bom)) {
            return charset;
        }
    }
    return '';
}
function parseLines(text) {
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
            text: text.substr(lineOffset),
            ending: ''
        });
    }
    return lines;
}
// ReSharper disable once InconsistentNaming
var linez;
(function (linez) {
    var Document = (function () {
        function Document(lines) {
            this._charset = '';
            this.lines = lines || [];
        }
        Object.defineProperty(Document.prototype, "bom", {
            get: function () {
                return boms[this.charset];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Document.prototype, "charset", {
            get: function () {
                return this._charset;
            },
            set: function (value) {
                if (!value) {
                    this._charset = '';
                    return;
                }
                if (!Buffer.isEncoding(value.replace(/-bom$/, ''))) {
                    throw new Error('Unsupported charset: ' + value);
                }
                this._charset = value;
            },
            enumerable: true,
            configurable: true
        });
        Document.prototype.toBuffer = function () {
            var charset = this.charset.replace(/-bom$/, '');
            var contents = new Buffer(this.toString(), charset);
            if (this.bom) {
                return Buffer.concat([this.bom, contents]);
            }
            return contents;
        };
        Document.prototype.toString = function () {
            return this.lines.map(function (line) {
                return line.text + line.ending;
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
