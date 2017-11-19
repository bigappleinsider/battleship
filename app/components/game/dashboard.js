import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Grid from './grid';

class Dashboard extends Component {
  componentWillMount() {
    this.props.fetchGrid();
  }
  render() {
    return (
      <div>
        <h3>Battleship</h3>
        <Grid grid={this.props.grid} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { grid: state.battleshipReducer.grid };
}

export default connect(mapStateToProps, actions)(Dashboard);
