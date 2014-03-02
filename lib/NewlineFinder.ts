import INewlineFinderResult = require('interfaces/INewlineFinderResult');


class NewlineFinder {

	constructor(private re: RegExp) {
		return;
	}

	public find(s: string) {
		var results: INewlineFinderResult[] = [];
		this.re.lastIndex = 0;
		var result;
		while (result = this.re.exec(s)) {
			results.push({
				text: result[0],
				index: result.index
			});
		}
		return results;
	}

}

export = NewlineFinder;
