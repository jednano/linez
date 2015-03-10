import ILine = require('./ILine');
declare class Document {
    lines: ILine[];
    constructor(lines?: ILine[]);
    toString(): string;
}
export = Document;
