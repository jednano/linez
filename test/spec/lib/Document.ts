import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import Document = require('../../../lib/Document');
import linez = require('../../../lib/linez');


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
