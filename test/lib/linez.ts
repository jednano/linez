import linez = require('../../lib/linez');
import sinonChai = require('../sinon-chai');
var expect = sinonChai.expect;


// ReSharper disable WrongExpressionStatement
describe('linez', () => {
	it('parses text', done => {
		linez.parse('foo').done(result => {
			expect(result[0].toString()).to.equal('foo');
			done();
		});
	});
});
