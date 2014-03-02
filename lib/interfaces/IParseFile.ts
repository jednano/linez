///<reference path='../bower_components/dt-node/node.d.ts'/>
import ILineCallback = require('./ILineCallback');
import IParseFileOptions = require('./IParseFileOptions');


interface IParseFile {
	(path: string, callback: ILineCallback);
	(path: string, options: IParseFileOptions, callback: ILineCallback);
}

export = IParseFile;
