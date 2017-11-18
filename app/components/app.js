import React, { Component } from 'react';

import Header from './header';

import { main } from '../styles/main.scss';

export default class App extends Component {
  render() {
    return (
      <div className={main}>
      <Header />
      {this.props.children}
      </div>
    );
  }
}
