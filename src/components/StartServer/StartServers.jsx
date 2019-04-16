import React, {Component} from 'react';
import {connect} from 'react-redux';

const fs = window.require("fs");

const childProcess = window.require("child_process");


function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}



class StartServers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      path : "."
    }
  }


  setPath = (e) => {
    e.persist();
    console.log(e.target.files['0'].path);
    this.setState((state, props) => {
      return {
        ...state,
        path : e.target.files['0'].path
      }
    });





    childProcess.exec("yarn start", {
      cwd : this.state.props
    })

  };

  render() {
    const files = fs.readdirSync(this.state.path);
    return (
      <div>
        <h1>Start Servers ! </h1>
        <input type="file" webkitdirectory="directory" onChange={(e) => this.setPath(e)}/>
        {files.map(x => <p>{x}</p>)}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StartServers);
