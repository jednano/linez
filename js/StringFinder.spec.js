"use strict";
var sinonChai = require('./test-common');
var expect = sinonChai.expect;
var StringFinder = require('./StringFinder');
// ReSharper disable WrongExpressionStatement
describe('StringFinder', function () {
    describe('constructor', function () {
        it('requires a string[] or Regex in the constructor', function () {
            expect(function () {
                return [
                    new StringFinder(/foo/),
                    new StringFinder(['foo', 'bar'])
                ];
            }).not.to.throw;
            expect(function () { new StringFinder(void (0)); }).to.throw('Unexpected type in StringFinder constructor argument: undefined');
            expect(function () { new StringFinder(2); }).to.throw('Unexpected type in StringFinder constructor argument: number');
        });
        it('requires regular expression to have the global flag', function () {
            var fn = function () {
                new StringFinder(/foo/);
            };
            expect(fn).to.throw('StringFinder regular expression must have a global flag');
        });
    });
    describe('findAll method', function () {
        it('finds 2 needles in a haystack', function () {
            var sf = new StringFinder(/ba[rz]/g);
            expect(sf.findAll('foobarbazqux')).to.deep.equal([
                {
                    index: 3,
                    text: 'bar'
                },
                {
                    index: 6,
                    text: 'baz'
                }
            ]);
        });
    });
});
