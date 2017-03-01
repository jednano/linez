"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var test_common_1 = require("./test-common");
var StringFinder_1 = require("./StringFinder");
describe('StringFinder', function () {
    describe('constructor', function () {
        it('requires a string[] or Regex in the constructor', function () {
            test_common_1.expect(function () {
                return [
                    new StringFinder_1.default(/foo/),
                    new StringFinder_1.default(['foo', 'bar'])
                ];
            }).not.to.throw;
            test_common_1.expect(function () { new StringFinder_1.default(void (0)); }).to.throw('Unexpected type in StringFinder constructor argument: undefined');
            test_common_1.expect(function () { new StringFinder_1.default(2); }).to.throw('Unexpected type in StringFinder constructor argument: number');
        });
        it('requires regular expression to have the global flag', function () {
            var fn = function () {
                new StringFinder_1.default(/foo/);
            };
            test_common_1.expect(fn).to.throw('StringFinder regular expression must have a global flag');
        });
    });
    describe('findAll method', function () {
        it('finds 2 needles in a haystack', function () {
            var sf = new StringFinder_1.default(/ba[rz]/g);
            test_common_1.expect(sf.findAll('foobarbazqux')).to.deep.equal([
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
//# sourceMappingURL=StringFinder.spec.js.map