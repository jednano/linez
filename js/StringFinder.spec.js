var sinonChai = require('./test-common');
var expect = sinonChai.expect;
var StringFinder = require('./StringFinder');
// ReSharper disable WrongExpressionStatement
describe('StringFinder', function () {
    describe('constructor', function () {
        it('requires a string[] or Regex in the constructor', function () {
            var fn = function () {
                new StringFinder(/foo/);
                new StringFinder(['foo', 'bar']);
            };
            expect(fn).not.to.throw;
            fn = function () {
                new StringFinder(void (0));
            };
            expect(fn).to.throw('Unexpected type in StringFinder constructor argument: undefined');
            fn = function () {
                new StringFinder(2);
            };
            expect(fn).to.throw('Unexpected type in StringFinder constructor argument: number');
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
