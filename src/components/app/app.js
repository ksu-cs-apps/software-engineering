import React, {Component} from 'react';
import {HashRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Auth from '../auth/auth';
import ProjectList from '../project-list/project-list';
import Project from '../project/project';
import './app.css';

/** @class App
  * A React application for managing student
  * software engineering projects
  */
export default class App extends Component {

  /** @function render
    * Render the app instance.
    */
  render() {
    return (
      <Router>
        <div className="app">
          <div className="app-header">
            <Link to="/">
              <h2>Software Engineering</h2>
            </Link>
            <Auth />
          </div>
          <div className="app-body">
            <Switch>
              <Route path="/project/:projectID" render={({match}) => (
                <Project projectID={match.params.projectID} />
              )}/>
              <Route path="/" render={()=>(
                <ProjectList />
              )}/>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}
