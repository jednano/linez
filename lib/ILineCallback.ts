///<reference path='../bower_components/dt-node/node.d.ts'/>
import ILine = require('./ILine');

interface ILineCallback {
	(err: Error, line: ILine);
}

export = ILineCallback;
