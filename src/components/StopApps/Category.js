export class Category {

	static DRIVE = new Category("drive");
	static UNDEFINED = new Category("undefined");
	static GAME = new Category("game");
	static PROG = new Category("prog");

	static accept = {
		drive: ["synology", "mega", "drive"],
		game: ["steam", "LeagueClient", "starcraft"],
		prog: ["webstorm", "android", "code", "visual studio"]
	};

	name;

	constructor(name) {
		this.name = name;
	}

	static from = (name) => {
		name = name.toLowerCase();


		const checkForOneCategory = (name, accept, category) => {
			console.log(name);

			for (let str of accept) {
				if (name.includes(str.toLowerCase())) {
					return category
				}
			}
			return Category.UNDEFINED
		};

		let cat;

		cat = checkForOneCategory(name, Category.accept.drive, Category.DRIVE);
		if (cat !== Category.UNDEFINED) return cat;

		cat = checkForOneCategory(name, Category.accept.game, Category.GAME);
		if (cat !== Category.UNDEFINED) return cat;

		cat = checkForOneCategory(name, Category.accept.prog, Category.PROG);
		return cat

	}
}
