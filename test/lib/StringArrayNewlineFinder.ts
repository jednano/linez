import fs = require('fs');
import sinon = require('sinon');
import sinonChai = require('../sinon-chai');
var expect = sinonChai.expect;
import StringArrayNewlineFinder = require('../../lib/StringArrayNewlineFinder');


// ReSharper disable WrongExpressionStatement
describe('StringArrayNewlineFinder', () => {

    it('allows newlines to be specified by a string[]', () => {
        var expectedTexts = ['\t', '|', '{.', '*+'];
        var expectedIndexes = [4, 10, 14, 19];
        var finder = new StringArrayNewlineFinder(['*+', '{.', '|', '\t']);
        finder.find('foo\n\tbar\r\n|baz{.qux*+').forEach((newline) => {
            expect(newline.text).to.eq(expectedTexts.shift());
            expect(newline.index).to.eq(expectedIndexes.shift());
        });
    });

});
