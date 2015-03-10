var StringFinder = (function () {
    function StringFinder(needles) {
        if (needles instanceof RegExp) {
            this.newlinesRegex = needles;
            return;
        }
        if (needles instanceof Array) {
            this.newlinesRegex = this.convertToPipedExpression(needles);
            return;
        }
        throw new Error('StringFinder constructor takes a string[] or RegExp');
    }
    StringFinder.prototype.convertToPipedExpression = function (needles) {
        needles = needles.map(function (needle) {
            return '\\' + needle.split('').join('\\');
        });
        return new RegExp('(' + needles.join('|') + ')', 'g');
    };
    StringFinder.prototype.findAll = function (haystack) {
        var matches = [];
        var match;
        while (true) {
            match = this.newlinesRegex.exec(haystack);
            if (!match) {
                break;
            }
            matches.push({
                index: match.index,
                text: match[0]
            });
        }
        return matches;
    };
    return StringFinder;
})();
module.exports = StringFinder;
