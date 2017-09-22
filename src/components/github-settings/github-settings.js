import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import Spinner from '../spinner/spinner';
import Milestones from './milestones';
import './github-settings.css';

/** @class GitHubSettings
  * A class for ecapsulating a project's GitHub repository
  */
export default class GitHubSettings extends Component {
  /** @constructor
    * Creates a new instance of GitHubSettings
    * @prop {ownerID} - the GitHub repo owner
    * @prop {repoID} - the Github repo
    * @prop {projectID} - the project's Firebase database ID
    * @prop {sprints} - the project's sprints in the Firebase database
    */
  constructor(props) {
    super(props);
    this.dataUrl = `https://api.github.com/repos/${props.ownerID}/${props.repoID}`;
    this.state = {loaded: false};
  }
  /** @method componentWillMount
    * Retrieves the GitHub repo data from GitHub
    */
  componentWillMount() {
    fetch(this.dataUrl).then((response) => {
      return response.json();
    }).then((data) => {
      this.setState({
        repo: data,
        loaded: true
      });
    });
  }
  /** @method render
    * Renders the GitHub settings, or a spinner
    * if the settings are still being fetched.
    */
  render() {
    if(!this.state.loaded) return <Spinner />;

    return (
      <div className="github-settings">
        <div>
          <h2>GitHub Repository</h2>
          <h3>{this.state.repo.full_name}</h3>
          <a href={this.props.githubUrl} target="_blank">
            {this.props.githubUrl}
            <FontAwesome name="external-link"/>
          </a>
          <p>{this.state.repo.description}</p>
          <h3>Releases</h3>
        </div>
        <Milestones sprints={this.props.sprints}
          ownerID={this.props.ownerID}
          repoID={this.props.repoID}
          projectID={this.props.projectID}
          startOn={this.props.startOn}
        />
      </div>
    );
  }
}
