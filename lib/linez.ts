/// <reference path="../node_modules/promise-ts/promise.d.ts" />
import P = require('promise-ts');
var Deferred = P.Deferred;


export function parse(text: string): P.Promise {
	var parsing = new Deferred();
	setTimeout(() => {
		parsing.resolve(text);
	});
	return parsing.promise;
}
