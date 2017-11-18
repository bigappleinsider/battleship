import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import * as actions from '../actions';

class Feature extends Component {

  componentWillMount() {
    this.props.fetchMessage();
  }
  render() {
    return (<div>This is a feature {this.props.message}</div>);
  }
}

function mapStateToProps(state) {
  return { message: state.auth.message };
}
Feature.propTypes = {
  fetchMessage: PropTypes.func.isRequired,
  message: React.PropTypes.string
};

export default connect(mapStateToProps, actions)(Feature);
