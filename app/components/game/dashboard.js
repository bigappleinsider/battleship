import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Grid from './grid';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.handleTurn = this.handleTurn.bind(this);
  }
  componentWillMount() {
    this.props.fetchGrid();
  }
  handleTurn(rowIdx, colIdx) {
    this.props.makeTurn(rowIdx, colIdx);
  }
  render() {
    return (
      <div>
        <h3>Battleship</h3>
        <Grid />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { userGrid: state.battleshipReducer.userGrid };
}

export default connect(mapStateToProps, actions)(Dashboard);
