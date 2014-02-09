import sinon = require('sinon');
import sinonChai = require('../sinon-chai');
var expect = sinonChai.expect;
import events = require('../../lib/events');


// ReSharper disable WrongExpressionStatement
describe('EventEmitter', () => {

	var emitter: events.EventEmitter;
	var f1: SinonSpy;
	var f2: SinonSpy;
	beforeEach(() => {
		emitter = new events.EventEmitter();
		f1 = sinon.spy();
		f2 = sinon.spy();
	});

	it('is a subclass of node-native events.EventEmitter', () => {
		expect(emitter).to.be.instanceOf(require('events').EventEmitter);
	});

	it('emits newListener event when new listeners are added', () => {
		emitter.on('newListener', f1);
		expect(f1).to.not.have.been.called;
		emitter.on('foo', f2);
		expect(f1).to.have.been.calledOnce;
	});

	it('emits removeListener event when a listener is removed', () => {
		emitter.on('removeListener', f1);
		emitter.on('foo', f2);
		expect(f1).to.not.have.been.called;
		emitter.removeListener('foo', f2);
		expect(f1).to.have.been.calledOnce;
	});

	it('supports addListener', () => {
		emitter.addListener('foo', f1);
		emitter.emit('foo');
		emitter.emit('foo');
		expect(f1).to.have.been.calledTwice;
	});

	it('supports on', () => {
		emitter.on('foo', f1);
		emitter.emit('foo');
		emitter.emit('foo');
		expect(f1).to.have.been.calledTwice;
	});

	it('supports once', () => {
		emitter.once('foo', f1);
		emitter.emit('foo');
		emitter.emit('foo');
		expect(f1).to.have.been.calledOnce;
	});

	it('supports removeListener', () => {
		emitter.on('foo', f1);
		emitter.removeListener('foo', f1);
		emitter.emit('foo');
		expect(f1).to.not.have.been.called;
	});

	it('supports removeAllListeners', () => {
		emitter.on('foo', f1);
		emitter.on('bar', f1);
		emitter.removeAllListeners();
		emitter.emit('foo');
		emitter.emit('bar');
		expect(f1).to.not.have.been.called;
	});

	it('returns listeners for an event', () => {
		emitter.on('foo', f1);
		expect(emitter.listeners('foo')).to.have.lengthOf(1);
	});

	it('emits events', () => {
		emitter.on('foo', f1);
		emitter.emit('foo');
		expect(f1).to.have.been.calledOnce;
	});

	it('emit returns true if event had listeners, false otherwise', () => {
		emitter.on('foo', f1);
		expect(emitter.emit('foo')).to.be.true;
		expect(emitter.emit('bar')).to.be.false;
	});
});
