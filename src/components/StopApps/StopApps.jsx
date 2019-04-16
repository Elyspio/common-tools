import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import './StopApps.css'
import {Category} from "./Category";
import {ModelApp} from "./ModelApp";


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
				if (this.includes(v)) {
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

		console.log("coucou");
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
				<h1>Stop apps</h1>
				<button onClick={this.getTask}>TASK</button>
				<button onClick={this.killTask}>kill</button>
				<div id={"apps"}>
					<div id="gameApp">
						<h2>Games</h2>
						{gameApp}
					</div>
					<div id="undefinedApp">
						<h2>Undefineds</h2>
						{undefinedApp}
					</div>
					<div id="driveApp">
						<h2>Drives</h2>
						{driveApp}
					</div>
					<div id="progApp">
						<h2>Prog</h2>
						{progApp}
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
