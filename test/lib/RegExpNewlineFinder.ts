import fs = require('fs');
import sinon = require('sinon');
import sinonChai = require('../sinon-chai');
var expect = sinonChai.expect;
import RegExpNewlineFinder = require('../../lib/RegExpNewlineFinder');


// ReSharper disable WrongExpressionStatement
describe ('RegExpNewlineFinder', () => {

    it('allows newlines to be specified by a RegExp', () => {
        var expectedTexts = ['\t', '|', '{.', '*+'];
        var expectedIndexes = [4, 10, 14, 19];
        var finder = new RegExpNewlineFinder(/(\*\+|\{\.|\||\t)/g);
        finder.find('foo\n\tbar\r\n|baz{.qux*+').forEach((newline) => {
            expect(newline.text).to.eq(expectedTexts.shift());
            expect(newline.index).to.eq(expectedIndexes.shift());
        });
    });

});
