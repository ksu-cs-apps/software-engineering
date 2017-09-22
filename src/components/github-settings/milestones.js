import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';
import * as firebase from 'firebase';

/** @class Milestones
  * A class encapsulating Sprints as GitHub repo milestones
  */
export default class Milestones extends Component {
  /** @constructor
    * Creates a new instance of Milestones
    * @prop {sprints} the sprints from Firebase
    * @prop {projectID} the Firebase database project id
    * @prop {ownerID} the GitHub repo owner
    * @prop {repoID} the GitHub repo
    */
  constructor(props) {
    super(props);
    var next = props.sprints.length;
    this.state = {
      token: sessionStorage.getItem('GitHubToken'),
      name: `Sprint ${next + 1}`,
      start: (next === 0) ? moment(this.props.startOn) : moment(this.props.sprints[next-1].end),
      end:  (next === 0) ? moment(this.props.startOn).add(2, 'weeks') : moment(this.props.sprints[next-1].end).add(2, 'weeks')
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleAddSprint = this.handleAddSprint.bind(this);
  }
  componentWillRecieveProps(nextProps){
    var next = nextProps.sprints.length;
    this.setState({
      name: `Sprint ${next + 1}`,
      start: (next === 0) ? moment(this.props.startOn) : moment(this.props.sprints[next-1].end),
      end:  (next === 0) ? moment(this.props.startOn).add(2, 'weeks') : moment(this.props.sprints[next-1].end).add(2, 'weeks')
    })
  }
  /** @method handleChange
    * An event handler for processing input field changes
    * and applying them to state
    */
  handleChange(event) {
    event.preventDefault();
    if(event.target.type === 'date') {
      this.setState({
        [event.target.name]: moment(event.target.value)
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value
      });
    }
  }
  /** @method handleAddSprint
    * Creates a new Sprint from state,
    * propigating it to both firebase and GitHub
    */
  handleAddSprint() {
    if(!this.state.token) return alert('must sign in');
    var headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Authorization', `Token ${this.state.token}`);
    var url = `https://api.github.com/repos/${this.props.ownerID}/${this.props.repoID}/milestones?access_token=${this.state.token}`;
    fetch(url, {
      method: 'post',
      headers: headers,
      body: JSON.stringify({
        "title": this.state.name,
        "state": "open",
        "description": `Milestone for ${this.state.name}`,
        "due_on": this.state.end.toISOString()
      })
    }).then((response) => {
      return response.json();
    }).then((data) => {
      if(!data.number) return;
      firebase.database().ref(`projects/${this.props.projectID}/sprints/${data.number}`).set({
        title: this.state.name,
        start: this.state.start.toJSON(),
        end: this.state.end.toJSON(),
        milestone: data.number
      });
    });
  }
  /** @method render
    * Renders the milestones
    */
  render() {
    var milestones = this.props.sprints.map((sprint, index) => (
      <li key={index}>
        <span>
          <FontAwesome name="flag"/>
          <a href={`https://github.com/${this.props.ownerID}/${this.props.repoID}/milestone/${sprint.milestone}`} target="_blank">
            {sprint.title}
            <FontAwesome name="external-link"/>
          </a>
        </span>
        <i>{moment(sprint.start).format('MMM Do')} to {moment(sprint.end).format('MMM Do')}</i>
      </li>
    ));
    return(
      <div>
        <h2>Sprint Milestones</h2>
        <ul className="sprint-list">
          {milestones}
          {(!this.state.token) ? '' : (
            <li className="sprint-form">
              <span>
                <FontAwesome name="plus-square"
                  style={{color: 'green'}}
                  onClick={this.handleAddSprint}
                />
                <input name="name" type="text" value={this.state.name} onChange={this.handleChange}/>
              </span>
              <span>
                <input name="start" type="date" value={this.state.start.format('YYYY-MM-DD')} onChange={this.handleChange}/>
                to
                <input name="end" type="date" value={this.state.end.format('YYYY-MM-DD')} onChange={this.handleChange}/>
              </span>
            </li>
          )}
        </ul>
      </div>
    );
  }
}
