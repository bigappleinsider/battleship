import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from '../material_ui_raw_theme_file'

import { main } from '../styles/main.scss';


export default class App extends Component {
  render() {
    return (
       <MuiThemeProvider muiTheme={theme}>
        <div className={main}>
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}
