class StringFinder {

	private newlinesRegex: RegExp;

	constructor(needles: string[]|RegExp) {
		if (needles instanceof RegExp) {
			if (!needles.global) {
				throw new Error('StringFinder regular expression must have a global flag');
			}
			this.newlinesRegex = <any>needles;
			return;
		}
		if (needles instanceof Array) {
			this.newlinesRegex = this.convertToPipedExpression(<any>needles);
			return;
		}
		throw new Error('Unexpected type in StringFinder constructor argument: ' + typeof needles);
	}

	private convertToPipedExpression(needles: string[]) {
		needles = needles.map(needle => {
			return needle.replace('\\', '\\\\');
		});
		return new RegExp('(' + needles.join('|') + ')', 'g');
	}

	findAll(haystack: string) {
		var matches: {
			index: number;
			text: string;
		}[] = [];
		while (true) {
			var match = this.newlinesRegex.exec(haystack);
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
