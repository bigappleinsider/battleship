import React, { Component } from 'react';


import { main } from '../styles/main.scss';

export default class App extends Component {
  render() {
    return (
      <div className={main}>
      {this.props.children}
      </div>
    );
  }
}
