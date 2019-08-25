// @ts-check
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Renamer from './Renamer'
import './Rename.css'

// import {getModule, NodeModule} from "../../NodeAPI";

// @ts-ignore
const fs = window.require('fs');
// @ts-ignore
const util = window.require('util');


// const util = getModule(NodeModule.util);
// const fs = getModule(NodeModule.fs);


const rename = util.promisify(fs.rename);


function mapStateToProps(state: object) {
	return {};
}

function mapDispatchToProps(dispatch: Function) {
	return {};
}

class Rename extends Component {


	state: {
		path: string,
		title: string,
		saison: any
	};
	private renamer: Renamer;

	constructor(props: object) {
		super(props);
		this.state = {
			path: "",
			title: "",
			saison: 1,

		}
		this.renamer = new Renamer([]);

	}


	setPath = (e: any) => {
		e.persist();
		console.log(e.target.files['0'].path);
		this.setState((state, props) => {
			return {
				...state,
				path: e.target.files['0'].path
			}
		});
	};

	setText = (event: any, stateKey: string) => {
		event.persist();
		console.log(event.target.value);
		this.setState(prev => {
			return {
				...prev,
				[stateKey]: event.target.value
			}
		})
	};


	rename = async () => {
		const names = fs.readdirSync(this.state.path);
		const newNames = this.renamer.rename(this.state.title, this.state.saison)
		for (let i = 0; i < names.length; i++) {
			await rename(this.state.path + '/' + names[i], this.state.path + '/' + newNames[i]);
		}

	};

	render() {
		let files: Array<string> = [];
		if (this.state.path.length > 0) {
			files = fs.readdirSync(this.state.path);
			this.renamer = new Renamer(files)
		}

		return (
			<div id={"Renamer"}>
				<h1>Anime renamer</h1>

				<form action="">
					<div>
						<label htmlFor="title">Title</label>
						<input type="text" id="title" value={this.state.title}
							   onChange={e => this.setText(e, "title")}/>
					</div>

					<div>
						<label htmlFor="title">Saison</label>
						<input type="number" id="saison"
							   value={this.state.saison}
							   onChange={e => this.setText(e, "saison")}/>
					</div>
				</form>


				<div id={"files"}>
					//@ts-ignore
					<input type="file" dir="directory"
						   onChange={(e) => this.setPath(e)}/>
					{<p>{files[0]}</p>}
				</div>

				<button className={"btn"} onClick={this.rename}>Rename</button>

			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Rename);
