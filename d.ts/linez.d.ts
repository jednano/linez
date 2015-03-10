import _ILine = require('./ILine');
import _IOptions = require('./IOptions');
import _Document = require('./Document');
declare module linez {
    class Document extends _Document {
    }
    interface ILine extends _ILine {
    }
    interface IOptions extends _IOptions {
    }
    function configure(options?: IOptions): void;
    function parse(text: string): Document;
}
export = linez;
