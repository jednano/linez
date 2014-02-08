import events = require('events');
import util = require('util');


export class EventEmitter implements events.EventEmitter {

	private _emitter = new events.EventEmitter();

	addListener(event: string, listener: Function): EventEmitter {
		//this._emitter.addListener(event, listener);
		return this;
	}

	on(event: string, listener: Function): EventEmitter {
		//this._emitter.on(event, listener);
		return this;
	}

	once(event: string, listener: Function): EventEmitter {
		//this._emitter.once(event, listener);
		return this;
	}

	removeListener(event: string, listener: Function): EventEmitter {
		//this._emitter.removeListener(event, listener);
		return this;
	}

	removeAllListeners(event?: string): EventEmitter {
		//this._emitter.removeAllListeners.apply(this._emitter, arguments);
		return this;
	}

	setMaxListeners(n: number): void {
		//this._emitter.setMaxListeners(n);
	}

	listeners(event: string): Function[] {
		return []; //this._emitter.listeners(event);
	}

	emit(event: string, ...args: any[]): boolean {
		return false; //this._emitter.emit.apply(this._emitter, arguments);
	}
}

util.inherits(EventEmitter, events.EventEmitter);
