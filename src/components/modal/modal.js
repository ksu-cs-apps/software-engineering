import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import './modal.css';

export default class Modal extends Component {
  render() {
    if(!this.props.show) return null;
    return (
      <div className="modal-wrapper">
        <div className="modal">
          <div className="modal-header">
            <span>{this.props.label}</span>
            <FontAwesome name="times" onClick={this.props.onClose}/>
          </div>
          <div className="modal-body">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
