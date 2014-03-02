import ILine = require('./ILine');

interface ILineCallback {
	(err: Error, line: ILine);
}

export = ILineCallback;
