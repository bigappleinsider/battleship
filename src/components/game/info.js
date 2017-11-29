import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';

class Info extends Component {
  render() {
    return (
      <div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { ships: state.battleshipReducer.ships };
}

export default connect(mapStateToProps, actions)(Grid);
