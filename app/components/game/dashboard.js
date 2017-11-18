import React, { Component } from 'react';

import { connect } from 'react-redux';

import * as actions from '../../actions';

class Dashboard extends Component {
  componentWillMount() {
    this.props.fetchGrid();
  }
  renderGrid() {

  }
  render() {
    return (
      <div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { grid: state.battleshipReducer.grid };
}

export default connect(mapStateToProps, actions)(Dashboard);
