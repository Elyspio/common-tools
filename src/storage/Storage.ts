let node_path = require('path');
// @ts-ignore
node_path = window.require('path');

let fs = require('fs');
// @ts-ignore
fs = window.require('fs');

let util = require('util');
// @ts-ignore
util = window.require('util');

let os = require('os');
// @ts-ignore
os = window.require('os');

let promises = require('fs').promises;
// @ts-ignore
promises = window.require('fs').promises;
// @ts-ignore
let process = window.require('process');
export default class Storage {

	path: string;

	APPDATA_PATH = (
		process.env.APPDATA
		|| (process.platform == 'darwin' ?
		process.env.HOME + 'Library/Preferences' :
		process.env.HOME + "/.local/share"))
		+ '/CommonTools';

	DEFAULT_CONFIG_FILE = "config.json";

	constructor(path: string = "") {
		this.path = path;
		if (!fs.existsSync(this.APPDATA_PATH)) {
			fs.mkdirSync(this.APPDATA_PATH)
		}
	}

	public async store(data: object, path: string = this.DEFAULT_CONFIG_FILE, update: boolean = true, erase: boolean = false) {
		path = path || this.DEFAULT_CONFIG_FILE;
		return new Promise<any>(async (resolve, reject) => {
			let filePath: string = node_path.join(this.APPDATA_PATH, <string>path);
			if (erase) {
				if (update) {
					reject("Uncompatible parameters can't have update and erase flag at the same time")
				}
				await promises.unlink(filePath)
			}
			let obj: object = {};
			if (update) {
				await promises.access(filePath).catch((e: any) => {
					console.log("e", e);
				})
				obj = this.read(path);


			}
			console.log(obj, data);
			obj = {
				...obj,
				...data
			};
			await resolve(await promises.writeFile(filePath, JSON.stringify(obj)));
		})
	}

	public async read(path: string = this.DEFAULT_CONFIG_FILE): Promise<object> {
		return new Promise<object>(async (resolve, reject) => {
			let filePath = node_path.join(this.APPDATA_PATH, path);

			if (!await promises.access(filePath)) {
				reject("File " + filePath + " doesn't exist")
			}


			let text = await promises.readFile(node_path.join(this.APPDATA_PATH, path));
			console.log('text', text.toString());
			resolve(JSON.parse(text));
		})
	}
}


export {}
