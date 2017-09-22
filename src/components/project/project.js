import React, {Component} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import * as firebase from 'firebase';
import Spinner from '../spinner/spinner';
import Backlog from '../backlog/backlog';
import Sprint from '../sprint/sprint';
import GithubSettings from '../github-settings/github-settings';
import '../shared/react-tabs.css';

/** @class Project
  * A component representing a software engineering project
  */
export default class Project extends Component {
  /** @constructor
    */
  constructor(props) {
    super(props);
    this.dataRef = firebase.database().ref(`projects/${props.projectID}`);
    this.state = {loaded: false}
  }
  /** @method componentWillMount
    * Fetches the project data
    */
  componentWillMount() {
    this.dataRef.on('value', snapshot => {
      this.setState({
        project: snapshot.val(),
        loaded: true
      });
    });
  }
  /** @function render
    * Renders the project, or a placeholder spinner
    * while the project loads asynchronously.
    */
  render() {
    if(!this.state.loaded) return <Spinner />;

    var sprints = this.state.project.sprints || [];
    const sprintList = sprints.map((sprint, index) => {
      return <Tab key={index}>{sprint.title}</Tab>
    });
    const sprintPanels = sprints.map((sprint, index) => {
      return (
        <TabPanel key={index}>
          <Sprint {...sprint}
            ownerID={this.state.project.ownerID}
            repoID={this.state.project.repoID} />
        </TabPanel>
      );
    });

    return(
      <Tabs>
        <TabList>
          <Tab key="-2">GitHub Settings</Tab>
          <Tab key="-1">Product Backlog</Tab>
          {sprintList}
        </TabList>
        <TabPanel>
          <GithubSettings {...this.state.project}
            projectID={this.props.projectID}
            sprints={sprints}
            />
        </TabPanel>
        <TabPanel>
          <Backlog
            ownerID={this.state.project.ownerID}
            repoID={this.state.project.repoID} />
        </TabPanel>
        {sprintPanels}
      </Tabs>
    );
  }
}
