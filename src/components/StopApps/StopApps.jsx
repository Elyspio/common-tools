import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import './StopApps.css'
import {Category} from "./Category";
import {ModelApp} from "./ModelApp";


const si = window.require("systeminformation");
const os = window.require("os");

const isLinux = os.type() === "Linux";


const exec = window.require('child_process').exec;
console.log("ICI", exec);

class StopApps extends Component {

	static DEFAULT_STATE = {
		apps: [],
		toKill: [],
		lastNbOfApps: 0
	};

	constructor(props) {
		super(props);
		this.state = StopApps.DEFAULT_STATE;
		String.prototype.matchOne = function (values) {
			for (let v of values) {
				if (this.startsWith(v)) {
					return true;
				}
			}
			return false;
		};

	}


	componentDidMount() {

		this.getTask();
		setInterval(this.getTask, 10000);
	}

	getTask = () => {


		console.log("coucou", isLinux);


		if (isLinux) {


			exec("ps -u elyspio", (err, stdout, strerr) => {
				if (err) throw  err;

				const rows = stdout.split("\n");

				const setApps = [];

				for (let row  of rows) {
					row = row.trim().replace(/ + /, " ");
					const splited = row.split(" ");

					if (splited[0] === "")
						continue;


					console.log(splited);

					const pid = splited[1];
					const name = splited[3];

					if (name.toLowerCase().matchOne("node", "electron", "ps"))
						continue;

					let appInd = setApps.findIndex(app => app.getName() === name);

					if (appInd < 0) {
						setApps.push(new ModelApp(name, pid))
					} else {
						setApps[appInd].addPid(pid);
					}

				}

				this.setState(prev => {
					return {
						...prev,
						apps: setApps,
						lastNbOfApps: rows.length
					}
				});
			});


			// si.processes().then(ps => {
			// 	console.log(ps.list);
			//
			// 	let list = ps.list.filter(p => p.user === "elyspio");
			// 	console.log(list);
			//
			// 	if (list.length !== this.state.lastNbOfApps) {
			// 		const setApps = [];
			//
			// 		for (const apps of list) {
			//
			// 			if (apps.name.toLowerCase().matchOne("node", "electron", "ps"))
			// 				continue;
			//
			// 			let appInd = setApps.findIndex(app => app.getName() === apps.name);
			//
			// 			if (appInd < 0) {
			// 				setApps.push(new ModelApp(apps.name, apps.pid))
			// 			} else {
			// 				setApps[appInd].addPid(apps.pid);
			// 			}
			// 			console.log("H", appInd, setApps);
			// 		}
			// 		this.setState(prev => {
			// 			return {
			// 				...prev,
			// 				apps: setApps,
			// 				lastNbOfApps: list.length
			// 			}
			// 		});
			// 	}
			//
			//
			// }).catch(err => {
			// 	if (err) throw err;
			// }).finally(() => {
			// 	console.log("done");
			// });
		} else {
			exec("tasklist", (err, stdout, stderr) => {
				if (err) {
					throw  err;
				}
				stdout = stdout.replace(/ +/g, "|");
				const process = stdout.split("\n").slice(3);


				if (this.state.lastNbOfApps !== process.length) {
					const setApps = [];

					for (const p of process) {

						const spliced = p.split("|");
						const appPid = spliced[1];

						let appName = spliced[0];
						if (!appName.matchOne(["electron", "node", "tasklist"])) {

							if (spliced.length === 6) {

								if (spliced[3] === "1") {

									let appInd = setApps.findIndex(app => app.getName() === appName);

									if (appInd < 0) {
										setApps.push(new ModelApp(appName, appPid))
									} else {
										setApps[appInd].addPid(appPid);
									}
									console.log("H", appInd, setApps);

								}
								console.log(spliced);
							}
						}


					}


					this.setState(prev => {
						return {
							...prev,
							apps: setApps,
							lastNbOfApps: process.length
						}
					});


				} else {
					console.log("Same number of processes");
				}

				console.error(stderr);


			})
		}
		// Windaub


	};

	toggleApp = (modelApp) => {
		let toKill = this.state.toKill;
		const index = toKill.findIndex(app => app.getName() === modelApp.getName());

		console.log("Coucou", index);

		if (index > -1) {
			toKill.splice(index, 1);
		} else {
			toKill.push(modelApp);
		}

		this.setState(prev => {
			return {
				...prev,
				toKill: toKill
			}
		}, () => {
			console.log("Tokill : ", this.state.toKill);
		})
	};

	killTask = () => {

		for (const modelApp of this.state.toKill) {
			modelApp.killApps();
		}

		this.setState(prev => {
			return {
				...prev,
				toKill: []
			}
		})

		this.getTask();


	};

	render() {

		const undefinedApp = [], gameApp = [], progApp = [], driveApp = [];
		this.state.apps.forEach(app => {

			const name = app.getName();
			let cat = Category.from(name);
			const selected = this.state.toKill.includes(app);
			switch (cat) {
				case Category.PROG:
					progApp.push(<App cb={this.toggleApp}
					                  category={cat}
					                  selected={selected}
					                  model={app}/>);
					break;


				case Category.DRIVE:
					driveApp.push(<App cb={this.toggleApp}
					                   category={cat}
					                   selected={selected}
					                   model={app}/>);
					break;

				case Category.GAME:
					gameApp.push(<App cb={this.toggleApp}
					                  category={cat}
					                  selected={selected}
					                  model={app}/>);
					break;

				case Category.UNDEFINED:
					undefinedApp.push(<App cb={this.toggleApp}
					                       category={cat}
					                       selected={selected}
					                       model={app}/>);
					break;
			}

		});

		return (


			<div id={"stopApps"}>
				<div id="header">
					<h1>Stop apps</h1>
					<button id={"kill"} onClick={this.killTask}>kill</button>

				</div>
				<div id={"apps"}>
					<div className="gameApp">
						<h2>Games</h2>
						<div>{gameApp}</div>
					</div>
					<div className="undefinedApp">
						<h2>Undefineds</h2>
						<div>{undefinedApp}</div>

					</div>
					<div className="driveApp">
						<h2>Drives</h2>
						<div>{driveApp}</div>

					</div>
					<div className="progApp">
						<h2>Progs</h2>
						<div>{progApp}</div>

					</div>

				</div>
			</div>
		);
	}

}


class App extends Component {
	static propTypes = {
		category: PropTypes.instanceOf(Category).isRequired,
		cb: PropTypes.func.isRequired,
		selected: PropTypes.bool.isRequired,
		model: PropTypes.instanceOf(ModelApp).isRequired
	};


	render() {

		let classname = "app";
		if (this.props.selected === true) {
			classname += " selected"
		}

		return (
			<div className={classname} onClick={() => this.props.cb(this.props.model)}>
				{this.props.model.getName()}
			</div>
		)
	}

}


const mapStateToProps = (state) => {
	return {}
};

const mapDispatchToProps = (dispatch) => {
	return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(StopApps);
