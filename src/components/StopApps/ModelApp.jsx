


export class ModelApp {

	name;
	pids;

	constructor(name, pids) {
		this.name = name;
		this.pids = [pids];
	}

	addPid(pid) {
		this.pids.push(pid);
	}

	killApps = () => {
		const exec = window.require('child_process').exec;
		for (let pid of this.pids) {
			exec("taskkill /PID  " + pid + " /F", (err, stdout, stderr) => {
				if (err)
					throw err;

				console.log(stdout, stderr);
			})
		}
	};


	getPid = () => this.pids;
	getName = () => this.name;


}
