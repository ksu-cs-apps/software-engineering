import React, {Component} from 'react';
import Spinner from '../spinner/spinner';
import '../shared/react-tabs.css';

/** @class Backlog
  * A component representing a project's backlog
  */
export default class Backlog extends Component {
  /** @constructor
    * Creates a new project instance
    * @prop {ownerID} the GitHub repo owner
    * @prop {repoID} the GitHub repo
    */
  constructor(props) {
    super(props);
    this.dataUrl = `https://api.github.com/repos/${props.ownerID}/${props.repoID}/issues?milestone=none`;
    this.state = {loaded: false}
  }
  /** @method componentWillMount
    * Loads the backlog issues from the
    * project's GitHub repo.
    */
  componentWillMount() {
    fetch(this.dataUrl)
      .then((response) => {
        return response.json()
      }).then((data) => {
        console.log('data',data)
        this.setState({issues: data, loaded: true});
      }).catch((err) => {
        console.error(err);
      })
  }
  /** @method render
    * Renders the backlog, or a loading icon.
    */
  render() {
    if(!this.state.loaded) return <Spinner />;
    const issueList = this.state.issues.map((issue, index) => (
      <li key={index}>{issue.title}</li>
    ));
    return (<ul>{issueList}</ul>);
  }
}
