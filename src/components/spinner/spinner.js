import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import './spinner.css';

/** @class Spinner
  * A React component for rendering a spinner
  */
export default class Spinner extends Component {
  /** @function render
    * Renders a spinner
    */
  render() {
    return (
      <div className="spinner-wrapper">
        <FontAwesome name="spinner" size="3x" spin />
      </div>
    );
  }
}
