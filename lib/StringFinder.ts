import IFoundString = require('./IFoundString');

class StringFinder {

	private newlinesRegex: RegExp;

	constructor(needles: any) {
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

	private convertToPipedExpression(needles: string[]) {
		needles = needles.map(needle => {
			return '\\' + needle.split('').join('\\');
		});
		return new RegExp('(' + needles.join('|') + ')', 'g');
	}

	findAll(haystack: string) {
		var matches: IFoundString[] = [];
		var match: RegExpExecArray;
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
	}
}

export = StringFinder;
