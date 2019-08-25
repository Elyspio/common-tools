export default class Renamer {

	static type = {
		alphabetical: 'ALPHABETICAL',
		number: 'NUMBER',
		other: 'OTHER'
	};

	files: string[];
	format: string;

	constructor(files: Array<string>) {

		console.log("Input", files);

		this.files = [];
		files.forEach(file => {
			this.files.push(this.untrim(file))
		});
		this.format = files[0].slice(files[0].lastIndexOf("."));

		console.log("Trimed", this.files)
	}

	/**
	 *
	 * @param title {string}
	 * @param saison {string}
	 * @returns {Array<string>}
	 */
	rename = (title: string, saison: string) => {
		let arr: string[] = [];
		let splited = [];
		const epIndex = this.getGlobalIndice();
		this.files.forEach(file => {
			splited = file.split(" ");
			console.log(splited, epIndex, splited[epIndex]);
			arr.push(`${title} S${saison} E${splited[epIndex]}${this.format}`)
		});
		return arr;
	};

	/**
	 *
	 * @param arr {Array<string>}
	 * @returns {number}
	 */
	private getIndice(arr: string[]): number {
		console.log("getIndice", arr);
		for (let i = 0; i < arr.length; i++) {
			if (this.isANumber(arr[i])) {
				return i;
			}
		}
		return -1
	};

	/**
	 *
	 * @param str
	 * @returns {boolean}
	 * @private
	 */
	private isANumber(str: string): boolean {
		return !isNaN(parseFloat(str))
	};

	/**
	 *
	 * @param str
	 * @returns {string}
	 * @private
	 */
	private getType(str: string): string {
		if (RegExp('[0-9]').test((str))) {
			return Renamer.type.number
		}
		if (RegExp('[a-zA-Z]').test((str))) {
			return Renamer.type.alphabetical
		} else {
			return Renamer.type.other
		}
	}

	/**
	 *
	 * @param str {string}
	 * @param ind {number}
	 * @returns {string}
	 * @private
	 */
	private insertSpace(str: string, ind: number): string {
		return str.slice(0, ind) + " " + str.slice(ind);
	}

	/**
	 * Insert spaces between letters and numbers
	 *
	 * @param str {string}
	 * @returns {string}
	 */
	private untrim(str: string): string {
		let lastCharType = this.getType(str[0]);
		let newStr = str;
		let currentType;
		let indexes = [];
		for (let i = 1; i < str.length; i++) {
			currentType = this.getType(str[i]);
			if (
				(lastCharType === Renamer.type.alphabetical && currentType === Renamer.type.number)
				|| (lastCharType === Renamer.type.number && currentType === Renamer.type.alphabetical)
			) {
				indexes.push(i);
			}
			lastCharType = currentType;
		}
		for (let j = 0; j < indexes.length; j++) {
			newStr = this.insertSpace(newStr, indexes[j] + j)
		}
		return newStr
	};

	private getGlobalIndice(): number {


		const goodIndex = new Set();

		let indexes: number[] = [], splited: string[] = [],
			prevSplited: string[] = [];
		for (let i = 0; i < this.files.length; i++) {
			splited = this.files[i].split(" ");
			indexes.length = 0;
			splited.forEach((word, i) => {
				if (this.isANumber(word)) {
					indexes.push(i);
				}
			});

			for (let j = 0; j < indexes.length; j++) {
				console.log(splited[indexes[j]], (splited[indexes[j]]), indexes);
				if (Number.parseInt(splited[indexes[j]]) === Number.parseInt(prevSplited[indexes[j]]) + 1) {
					goodIndex.add(indexes[i]);
				}
			}
			prevSplited = splited;

		}
		return goodIndex.entries().next().value[0] as number;


	};

}
