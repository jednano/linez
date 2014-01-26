import common = require('../sinon-chai');
var expect = common.expect;
import linez = require('../../lib/linez');


// ReSharper disable WrongExpressionStatement
describe('linez', () => {
	it('parses text', done => {
		linez.parse('foo').done(result => {
			expect(result).to.equal('foo');
			done();
		});
	});
});
