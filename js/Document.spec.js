var sinonChai = require('./test-common');
var expect = sinonChai.expect;
var linez = require('./linez');
// ReSharper disable WrongExpressionStatement
describe('Document', function () {
    var contents;
    var doc;
    before(function () {
        contents = 'foo\nbar\n';
        doc = linez.parse(contents);
    });
    it('constructs a document with lines', function () {
        expect(doc).to.exist;
        expect(doc.lines).to.have.length(2);
    });
    it('converts lines into a string with toString()', function () {
        expect(doc.toString()).to.eq(contents);
    });
});
