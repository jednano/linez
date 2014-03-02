///<reference path='../../bower_components/dt-node/node.d.ts'/>
import INewlineFinderResult = require('./INewlineFinderResult');

interface INewlineFinder {
    find(s: string): INewlineFinderResult[];
}

export = INewlineFinder;
