/// <reference types="node" />
declare function linez(contents: string): linez.Document;
declare function linez(buffer: Buffer): linez.Document;
declare namespace linez {
    class Document {
        readonly bom: Buffer;
        private _charset;
        charset: string;
        lines: Line[];
        constructor(lines?: Line[]);
        toBuffer(): Buffer;
        toString(): string;
    }
    interface Line {
        offset: number;
        number: number;
        text: string;
        ending: string;
    }
    interface Options {
        newlines?: string[];
    }
    function configure(options: Options): void;
    function resetConfiguration(): void;
}
export default linez;