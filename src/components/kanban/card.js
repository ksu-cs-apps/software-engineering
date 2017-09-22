import React, {Component} from 'react';

/** A react component representing a card
  * on a kanban board
  * @prop {title} - the card's title
  * @prop {points} - the card's points
  * @prop {body} - the card's body
  */
export default class Card extends Component {
  /** @method render
    * Renders the card
    */
  render() {
    var match = /points\s*:(\d+)/.exec(this.props.body);
    var points = (match) ? parseInt(match[1], 10) : 0;

    return (
      <li className="kanban-card">
        <header>{this.props.title}</header>
        <p>{this.props.body}</p>
        <span className="points">{points}</span>
      </li>
    );
  }
}
