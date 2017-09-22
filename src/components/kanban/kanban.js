import React, {Component} from 'react';
import Card from './card';
import './kanban.css';

/** @clas Kanban
  * A component for displaying a Kanban board of
  * a sprint.
  */
export default class Kanban extends Component {
  /** @method render
    * Renders the kanban board.
    */
  render() {
    var open = [];
    var assigned = [];
    var closed = [];
    this.props.issues.forEach((issue) => {
      if(issue.state === 'open') {
        if(issue.assignees.length === 0)
          open.push(issue);
        else
          assigned.push(issue);
      } else {
        closed.push(issue);
      }
    });
    var todo = open.map((issue, index) => (
      <Card key={index} {...issue}/>
    ));
    var doing = assigned.map((issue, index) => (
      <Card key={index} {...issue}/>
    ));
    var done = closed.map((issue, index) => (
      <Card key={index} {...issue}/>
    ));
    return (
      <div className="kanban-board">
        <div className="kanban-column todo">
          <header>ToDo</header>
          <ul>{todo}</ul>
        </div>
        <div className="kanban-column doing">
          <header>Doing</header>
          <ul>{doing}</ul>
        </div>
        <div className="kanban-column done">
          <header>Done</header>
          <ul>{done}</ul>
        </div>
      </div>
    )
  }
}
