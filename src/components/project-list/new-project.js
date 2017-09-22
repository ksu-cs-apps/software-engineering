import React, {Component} from 'react';
import * as firebase from 'firebase';
import './project-form.css';

/** @class NewProject
  * React component for creating new projects
  */
export default class NewProject extends Component {
  /** @constructor
    * Creates a new instance of NewProject
    */
  constructor(props) {
    super(props);
    this.state = {}
    this.handleChange = this.handleChange.bind(this);
    this.handleCreateProject = this.handleCreateProject.bind(this);
  }
  /** @function handleChange
    * Handles updates to input fields by updating the
    * component's state
    * @param {ChangeEvent} - the event that triggered
    * this handler
    */
  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  /** @method handleCreateProject
    * Creates a new project in the Firebase database
    */
  handleCreateProject() {
    // Apply validations
    if(!this.state.name) return this.setState({message: 'You must enter a project name'});
    if(!this.state.githubUrl) return this.setState({message: 'You must enter a GitHub url'});
    if(!this.state.startOn) return this.setState({message: 'You must enter a project start date'});
    var match = /^https:\/\/github.com\/([-\w]+)\/([-\w]+)$/.exec(this.state.githubUrl);
    if(!match) return this.setState({message: 'You must enter a valid GitHub url'})
    // Submit project
    firebase.database().ref().child('/projects').push({
      name: this.state.name,
      startOn: this.state.startOn,
      githubUrl: this.state.githubUrl,
      ownerID: match[1],
      repoID: match[2]
    });
    if(this.props.onCreate) this.props.onCreate();
  }
  /** @method render
    * Draws the new project form.
    */
  render() {
    return (
      <div className="project-form">
        <div className="message">
          {this.state.message}
        </div>
        <div>
          <label>Name:</label>
          <input name="name" type="text" onChange={this.handleChange} />
        </div>
        <div>
          <label>GitHub URL:</label>
          <input name="githubUrl" type="url" onChange={this.handleChange} />
        </div>
        <div>
          <label>Start Date:</label>
          <input name="startOn" type="date" onChange={this.handleChange} />
        </div>
        <div>
          <button className="btn btn-ok" onClick={this.handleCreateProject}>
            Create
          </button>
        </div>
      </div>
    );
  }
}
