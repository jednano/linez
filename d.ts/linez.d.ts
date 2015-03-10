declare function linez(text: string): linez.Document;
declare module linez {
    class Document {
        lines: Line[];
        constructor(lines?: Line[]);
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
    function configure(options?: Options): void;
    function resetConfiguration(): void;
}
export = linez;
