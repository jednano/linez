///<reference path='../bower_components/dt-node/node.d.ts'/>
import RegExpNewlineFinder = require('./RegExpNewlineFinder');

class StringArrayNewlineFinder extends RegExpNewlineFinder {
    constructor(newlines: string[]) {
        newlines = newlines.map((sequence: string) => {
            return '\\' + sequence.split('').join('\\');
        });
        super(new RegExp('(' + newlines.join('|') + ')', 'g'));
    }
}

export = StringArrayNewlineFinder;
