declare function linez(text: string): linez.Document;
declare module linez {
    class Document {
        private static boms;
        private static charsets;
        private bom;
        private _charset;
        charset: string;
        lines: Line[];
        constructor(lines?: Line[]);
        private detectCharset();
        toString(): string;
    }
    interface Line {
        offset: number;
        number: number;
        text: string;
        ending?: string;
    }
    interface Options {
        newlines?: string[];
    }
    function configure(options: Options): void;
    function resetConfiguration(): void;
}
export = linez;
