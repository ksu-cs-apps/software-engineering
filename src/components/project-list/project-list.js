import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import * as firebase from 'firebase';
import NewProject from './new-project';
import Modal from '../modal/modal';
import './project-form.css';

/** @class ProjectList
  * A React Component listing student projects for the
  * Software Engineering course
  */
export default class ProjectList extends Component {
  /** @constructor
    * Creates a new ProjectList instance
    */
  constructor(props) {
    super(props);
    this.dataRef = firebase.database().ref('/projects');
    this.state = {
      showNewProjectForm: false,
      projects: [],
      token: sessionStorage.getItem('GitHubToken')
    }
    this.toggleVisible = this.toggleVisible.bind(this);
  }
  /** @method componentWillMount
    * Mounts firebase database listeners to respond
    * to real-time changes in the list of projects
    */
  componentWillMount() {
    this.dataRef.on('child_added', snapshot => {
      var projects = this.state.projects;
      var newProject = snapshot.val();
      newProject.projectID = snapshot.key;
      projects.push(newProject);
      this.setState({projects: projects});
    });
  }
  /** @method componentWillUnmount
    * Clears the firebase database event listeners
    */
  componentWillUnmount() {
    this.dataRef.off();
  }
  /** @method toggleVisible
    * Displays or hides the new project dialog by
    * toggling state
    */
  toggleVisible() {
    this.setState({showNewProjectForm: !this.state.showNewProjectForm});
  }
  /** @method render
    * Renders the project list
    */
  render() {
    const projects = this.state.projects.map((project, index) => (
      <li key={project.projectID}>
        <Link to={`/project/${project.projectID}`}>
          <h2>{project.name}</h2>
        </Link>
      </li>
    ));
    return (
      <div className="project-list">
        <header>
          <h1>Projects</h1>
          {(!this.state.token)?'':(
            <button className="btn btn-ok" onClick={this.toggleVisible}>
              <FontAwesome name="plus"/>
              Create Project
            </button>
          )}
        </header>
        <ul>
          {projects}
        </ul>
        <Modal show={this.state.showNewProjectForm} onClose={this.toggleVisible} label="New Project">
          <NewProject onCreate={this.toggleVisible}/>
        </Modal>
      </div>
    );
  }
}
