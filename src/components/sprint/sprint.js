import React, {Component} from 'react';
import Kanban from '../kanban/kanban';
import Burndown from '../burndown/burndown';
import Spinner from '../spinner/spinner';

/** @class Sprint
  * A component representing a single sprint
  * in a project
  */
export default class Sprint extends Component {
  /** @constructor Sprint
    * Creates a new instance of sprint
    * @prop {ownerID} the GitHub repo owner
    * @prop {repoID} the GitHub repo
    * @prop {milestone} the GitHub repo milestone for the sprint
    */
  constructor(props) {
    super(props);
    this.dataUrl = `https://api.github.com/repos/${props.ownerID}/${props.repoID}/issues?milestone=${props.milestone}&state=all`;
    this.state = {loaded: false}
  }
  /** @method componentWillMount
    * Fetches the sprint data from GitHub
    */
  componentWillMount() {
    fetch(this.dataUrl)
      .then((response) => {
        return response.json();
      }).then((data) => {
        this.setState({issues: data, loaded: true});
      });
  }
  /** @method render
    * Renders the sprint data
    */
  render() {
    if(!this.state.loaded) return <Spinner />;

    const issues = this.state.issues.map((issue, index) => {
      return (<li key={index}>{issue.title}</li>);
    });
    return (
      <section id={`sprint-${this.props.milestone}`}>
        <h1>{this.props.title}</h1>
        <p>{new Date(this.props.start).toLocaleDateString()} - {new Date(this.props.end).toLocaleDateString()}</p>
        <Kanban issues={this.state.issues} />
        <Burndown issues={this.state.issues}
          start={this.props.start}
          end={this.props.end} />
        <ul>
          {issues}
        </ul>
      </section>
    );
  }
}
