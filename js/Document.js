var Document = (function () {
    function Document(lines) {
        this.lines = lines || [];
    }
    Document.prototype.toString = function () {
        var contents = '';
        this.lines.forEach(function (line) {
            contents += line.text + line.ending;
        });
        return contents;
    };
    return Document;
})();
module.exports = Document;
