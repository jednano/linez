///<reference path='../bower_components/dt-node/node.d.ts'/>
import INewlineFinder = require('./INewlineFinder');
import INewlineFinderResult = require('./INewlineFinderResult');

class RegExpNewlineFinder implements INewlineFinder {
    private re: RegExp;

    constructor(re: RegExp) {
        this.re = re;
    }

    public find(s: string) {
        var results: INewlineFinderResult[] = [];
        this.re.lastIndex = 0;
        var result;
        while(result = this.re.exec(s)) {
            results.push({
                text: <string>result[0],
                index: <number>result.index
            });
        }
        return results;
    }
}

export = RegExpNewlineFinder;
