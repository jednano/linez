"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var iconv = require('iconv-lite');
var bufferEquals = require('buffer-equals');
var test_common_1 = require("./test-common");
var linez_1 = require("./linez");
describe('linez', function () {
    it('parses empty text', function () {
        var line = linez_1.default('').lines[0];
        test_common_1.expect(line.offset).to.eq(0);
        test_common_1.expect(line.number).to.eq(1);
        test_common_1.expect(line.text).to.be.empty;
        test_common_1.expect(line.ending).to.be.empty;
    });
    it('parses a single line with no line ending', function () {
        var line = linez_1.default('foo').lines[0];
        test_common_1.expect(line.offset).to.eq(0);
        test_common_1.expect(line.number).to.eq(1);
        test_common_1.expect(line.text).to.eq('foo');
        test_common_1.expect(line.ending).to.be.empty;
    });
    it('parses a single line with a line ending', function () {
        var line = linez_1.default('foo\n').lines[0];
        test_common_1.expect(line.offset).to.eq(0);
        test_common_1.expect(line.number).to.eq(1);
        test_common_1.expect(line.text).to.eq('foo');
        test_common_1.expect(line.ending).to.eq('\n');
    });
    it('sets proper line offsets', function () {
        var lines = linez_1.default('f\noo\r\nbar').lines;
        test_common_1.expect(lines[0].offset).to.eq(0);
        test_common_1.expect(lines[1].offset).to.eq(2);
        test_common_1.expect(lines[2].offset).to.eq(6);
    });
    it('sets proper line numbers', function () {
        var lines = linez_1.default('foo\nbar\nbaz').lines;
        test_common_1.expect(lines[0].number).to.eq(1);
        test_common_1.expect(lines[1].number).to.eq(2);
        test_common_1.expect(lines[2].number).to.eq(3);
    });
    it('sets proper line text', function () {
        var lines = linez_1.default('foo\nbar\nbaz').lines;
        test_common_1.expect(lines[0].text).to.eq('foo');
        test_common_1.expect(lines[1].text).to.eq('bar');
        test_common_1.expect(lines[2].text).to.eq('baz');
    });
    it('sets proper line endings', function () {
        var lines = linez_1.default('foo\nbar\r\nbaz').lines;
        test_common_1.expect(lines[0].ending).to.eq('\n');
        test_common_1.expect(lines[1].ending).to.eq('\r\n');
        test_common_1.expect(lines[2].ending).to.be.empty;
    });
    describe('configure method', function () {
        beforeEach(function () {
            linez_1.default.resetConfiguration();
        });
        it('supports a custom newlines string array', function () {
            linez_1.default.configure({
                newlines: ['\t', '\u0085', '\r']
            });
            var lines = linez_1.default('foo\rbar\tbaz\u0085qux\n').lines;
            test_common_1.expect(lines[0].text).to.eq('foo');
            test_common_1.expect(lines[0].ending).to.eq('\r');
            test_common_1.expect(lines[1].text).to.eq('bar');
            test_common_1.expect(lines[1].ending).to.eq('\t');
            test_common_1.expect(lines[2].text).to.eq('baz');
            test_common_1.expect(lines[2].ending).to.eq('\u0085');
            test_common_1.expect(lines[3].text).to.eq('qux\n');
            test_common_1.expect(lines[3].ending).to.be.empty;
        });
        it('errors when no configuration options are sent', function () {
            var fn = function () {
                linez_1.default.configure(void (0));
            };
            test_common_1.expect(fn).to.throw('No configuration options to configure');
        });
    });
    it('supports resetting the configuration', function () {
        linez_1.default.configure({ newlines: ['bar'] });
        var lines = linez_1.default('foobar').lines;
        test_common_1.expect(lines[0].ending).to.eq('bar');
        linez_1.default.resetConfiguration();
        lines = linez_1.default('foo\n').lines;
        test_common_1.expect(lines[0].ending).to.eq('\n');
    });
    describe('Document', function () {
        it('constructs a document with lines', function () {
            var doc = linez_1.default('foo\nbar');
            test_common_1.expect(doc).to.exist;
            test_common_1.expect(doc.lines).to.have.length(2);
        });
        it('converts doc into a buffer with toBuffer()', function () {
            var contents = Buffer.concat([
                new Buffer([0xef, 0xbb, 0xbf]),
                new Buffer('foo')
            ]);
            var doc = linez_1.default(contents);
            test_common_1.expect(bufferEquals(doc.toBuffer(), contents)).to.be.true;
        });
        it('converts a signed doc into a buffer with toBuffer()', function () {
            var contents = new Buffer('foo');
            var doc = linez_1.default(contents);
            test_common_1.expect(bufferEquals(doc.toBuffer(), contents)).to.be.true;
        });
        it('converts an unsigned doc into a string with toString()', function () {
            var contents = 'foo\nbar';
            var doc = linez_1.default(contents);
            test_common_1.expect(doc + '').to.eq(contents);
            test_common_1.expect(new linez_1.default.Document() + '').to.be.empty;
        });
        it('throws when trying to set an unsupported charset', function () {
            var fn = function () {
                new linez_1.default.Document().charset = 'foo';
            };
            test_common_1.expect(fn).to.throw('Unsupported charset: foo');
        });
        describe('byte order marks', function () {
            it('detects and decodes a utf-8-bom document', function () {
                var doc = linez_1.default(Buffer.concat([
                    new Buffer([0xef, 0xbb, 0xbf]),
                    new Buffer('foo')
                ]));
                test_common_1.expect(doc.charset).to.eq('utf-8-bom');
                test_common_1.expect(doc.lines[0].text).to.eq('foo');
            });
            it('detects and decodes utf-16le bom document', function () {
                var doc = linez_1.default(Buffer.concat([
                    new Buffer([0xff, 0xfe]),
                    iconv.encode('foo', 'utf16le')
                ]));
                test_common_1.expect(doc.charset).to.eq('utf-16le');
                test_common_1.expect(doc.lines[0].text).to.eq('foo');
            });
            it('detects and decodes utf-16be bom document', function () {
                var doc = linez_1.default(Buffer.concat([
                    new Buffer([0xfe, 0xff]),
                    iconv.encode('foo', 'utf16be')
                ]));
                test_common_1.expect(doc.charset).to.eq('utf-16be');
                test_common_1.expect(doc.lines[0].text).to.eq('foo');
            });
            it('throws an unsupported charset error for utf-32le bom', function () {
                var fn = function () {
                    linez_1.default(new Buffer([0xff, 0xfe, 0x00, 0x00]));
                };
                test_common_1.expect(fn).to.throw('Unsupported charset: utf-32le');
            });
            it('throws an unsupported charset error for utf-32be bom', function () {
                var fn = function () {
                    linez_1.default(new Buffer([0x00, 0x00, 0xfe, 0xff]));
                };
                test_common_1.expect(fn).to.throw('Unsupported charset: utf-32be');
            });
            it('decodes unsigned docs as utf8 by default', function () {
                var doc = linez_1.default(new Buffer('foo'));
                test_common_1.expect(doc.charset).to.be.empty;
                test_common_1.expect(doc.lines[0].text).to.eq('foo');
            });
        });
    });
});
//# sourceMappingURL=linez.spec.js.map