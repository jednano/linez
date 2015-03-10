import sinonChai = require('./test-common');
var expect = sinonChai.expect;
import Document = require('./Document');
import linez = require('./linez');


// ReSharper disable WrongExpressionStatement
describe('Document', () => {

	var contents: string;
	var doc: Document;
	before(() => {
		contents = 'foo\nbar\n';
		doc = linez.parse(contents);
	});

	it('constructs a document with lines', () => {
		expect(doc).to.exist;
		expect(doc.lines).to.have.length(2);
	});

	it('converts lines into a string with toString()', () => {
		expect(doc.toString()).to.eq(contents);
	});

});
