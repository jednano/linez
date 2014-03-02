import fs = require('fs');
import sinon = require('sinon');
import sinonChai = require('../sinon-chai');
var expect = sinonChai.expect;
import NewlineFinder = require('../../lib/NewlineFinder');


// ReSharper disable WrongExpressionStatement
describe('NewlineFinder', () => {

	it('allows newlines to be specified by a RegExp', () => {
		var expectedTexts = ['\t', '|', '{.', '*+'];
		var expectedIndexes = [4, 10, 14, 19];
		var finder = new NewlineFinder(/(\*\+|\{\.|\||\t)/g);
		finder.find('foo\n\tbar\r\n|baz{.qux*+').forEach((newline) => {
			expect(newline.text).to.eq(expectedTexts.shift());
			expect(newline.index).to.eq(expectedIndexes.shift());
		});
	});

});
