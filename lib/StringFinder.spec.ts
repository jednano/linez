import { expect } from './test-common';
import StringFinder from './StringFinder';

describe('StringFinder',() => {

	describe('constructor', () => {

		it('requires a string[] or Regex in the constructor', () => {
			expect(() => {
				return [
					new StringFinder(/foo/),
					new StringFinder(['foo', 'bar'])
				];
			}).not.to.throw;
			expect(() => { new StringFinder(void (0)); }).to.throw(
				'Unexpected type in StringFinder constructor argument: undefined'
			);
			expect(() => { new StringFinder(<any>2); }).to.throw(
				'Unexpected type in StringFinder constructor argument: number'
			);
		});

		it('requires regular expression to have the global flag', () => {
			var fn = () => {
				new StringFinder(/foo/);
			};
			expect(fn).to.throw('StringFinder regular expression must have a global flag');
		});

	});

	describe('findAll method', () => {

		it('finds 2 needles in a haystack', () => {
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
