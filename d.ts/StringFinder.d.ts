import IFoundString = require('./IFoundString');
declare class StringFinder {
    private newlinesRegex;
    constructor(needles: any);
    private convertToPipedExpression(needles);
    findAll(haystack: string): IFoundString[];
}
export = StringFinder;
