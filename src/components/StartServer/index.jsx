import React, {Component} from 'react';
import {connect} from 'react-redux';
import Storage from "../../storage/Storage";

let fs = require('fs');
fs = window.require("fs");

let childProcess = require("child_process");
childProcess = window.require("child_process");


function mapStateToProps(state) {
	return {};
}

function mapDispatchToProps(dispatch) {
	return {};
}


class CommandStarter extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			path: "."
		}
	}
	
	
	setPath = (e) => {
		e.persist();
		console.log(e.target.files['0'].path);
		this.setState((state, props) => {
			return {
				...state,
				path: e.target.files['0'].path
			}
			
			
		});
		
		
		childProcess.exec("yarn start", {
			cwd: this.state.path
		})
		
	};
	
	async componentDidMount(): void {
		let storage = new Storage();
		await storage.store({
			a: 1,
			b: 'Hello'
		}, undefined, true, false);
		
		
		
		
	}
	
	render() {
		
		
		
		return (
			<div>
				<h1>Start Servers ! </h1>
				<input type="file" webkitdirectory="directory"
				       onChange={(e) => this.setPath(e)}/>
				
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CommandStarter);
