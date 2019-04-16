import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import '../assets/css/StopApp.css'

const exec = require('child_process').exec;

class ModelApp {

	name;
	pid;

	constructor(name, pid) {
		this.name = name;
		this.pid = pid;
	}

	getPid = () => this.pid;
	getName = () => this.name;


}

class StopApps extends Component {

	constructor(props) {
		super(props);
		this.state = {
			apps: [],
			toKill: [],
		}
	}


	getTask = () => {
		console.log("coucou");
		exec("tasklist", (err, stdout, stderr) => {
			if (err) {
				throw  err;
			}
			stdout = stdout.replace(/ +/g, "|");
			const process = stdout.split("\n").slice(3);

			const setApps = new Set();

			process.forEach(p => {

				const spliced = p.split("|");
				// if (spliced[4] === "OMEN-LAPTOP\\jonag" && spliced[0] !== "electron") {
				if (spliced[3] === "1") {
					console.log(spliced);
					setApps.add(new ModelApp(spliced[0], spliced[1]));
				}
				console.log(spliced);
			});


			this.setState(prev => {
				return {
					...prev,
					apps: setApps
				}
			});

			console.error(stderr);
		})

	};

	toggleApp = (pid) => {

		let toKill = this.state.toKill;
		const index = toKill.indexOf(pid);
		if (index > -1) {
			toKill.splice(index, 1);
		} else {
			toKill.push(pid);
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
		this.state.toKill.forEach(pid => {
			exec("taskkill /PID  " + pid + " /F", (err, stdout, stderr) => {
				if (err)
					throw err;

				console.log(stdout, stderr);
			})
		})
	};

	render() {

		const undefinedApp = [], gameApp = [], progApp = [], driveApp = [];
		this.state.apps.forEach(app => {

			const name = app.getName();
			let cat = Category.from(name);
			const pid = app.getPid();
			const selected = this.state.toKill.includes(pid);
			switch (cat) {
				case Category.PROG:
					progApp.push(<App cb={this.toggleApp}
					                  name={name}
					                  pid={pid}
					                  category={cat}
					                  selected={selected}/>);
					break;


				case Category.DRIVE:
					driveApp.push(<App cb={this.toggleApp}
					                   name={name}
					                   category={cat}
					                   pid={pid}
					                   selected={selected}/>);
					break;

				case Category.GAME:
					gameApp.push(<App cb={this.toggleApp}
					                  name={name}
					                  category={cat}
					                  pid={pid}
					                  selected={selected}/>);
					break;

				case Category.UNDEFINED:
					undefinedApp.push(<App cb={this.toggleApp}
					                       name={name}
					                       category={cat}
					                       pid={pid}
					                       selected={selected}/>);
					break;
			}

		});

		return (


			<div id={"stopApps"}>
				<h1>Stop apps</h1>
				<button onClick={this.getTask}>TASK</button>
				<button onClick={this.killTask}>kill</button>
				<div id={"apps"}>
					<div id="gameApp">{gameApp}</div>
					<div id="undefinedApp">{undefinedApp}</div>
					<div id="driveApp">{driveApp}</div>
					<div id="progApp">{progApp}</div>

				</div>
			</div>
		);
	}

}


class Category {

	static DRIVE = new Category("drive");
	static UNDEFINED = new Category("undefined");
	static GAME = new Category("game");
	static PROG = new Category("prog");

	static accept = {
		drive: ["synology", "mega", "drive"],
		game: ["steam", "LeagueClient", "starcraft"],
		prog: ["webstorm", "android", "code", "visual studio"]
	};

	name = "";

	constructor(name) {
		this.name = name;
	}

	static from = (name) => {
		name = name.toLowerCase();


		const checkForOneCategory = (name, accept, category) => {
			for (let str of accept) {
				if (name.includes(str.toLowerCase())) {
					return category
				}
			}
			return Category.UNDEFINED
		};

		let cat;

		cat = checkForOneCategory(name, this.accept.drive, Category.DRIVE);
		if(cat !== Category.UNDEFINED) return cat;

		cat = checkForOneCategory(name, this.accept.game, Category.GAME);
		if(cat !== Category.UNDEFINED) return cat;

		cat = checkForOneCategory(name, this.accept.prog, Category.PROG);
		return cat

	}
}

class App extends Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		category: PropTypes.instanceOf(Category),
		cb: PropTypes.func.isRequired,
		selected: PropTypes.bool.isRequired,
		pid: PropTypes.string.isRequired
	};


	render() {

		let classname = "app";
		if (this.props.selected === true) {
			classname += " selected"
		}

		return (
			<div className={classname} onClick={() => this.props.cb(this.props.pid)}>
				{this.props.name}
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
