import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import PropTypes from 'prop-types';

import * as actions from '../../actions';

import gridStyles from '../../styles/grid.scss';

class Grid extends Component {
  constructor(props) {
    super(props);
    this.handleTurn = this.handleTurn.bind(this);
  }
  componentWillMount() {
    this.props.fetchGrid();
  }
  handleTurn(rowIdx, colIdx, e) {
      console.log(rowIdx, colIdx);
      this.props.makeTurn(rowIdx, colIdx);
  }
  renderRow(row, rowIdx) {
    return row.map((col, idx) => {
      if (rowIdx === 0) {
        if (idx === 0) {
          return (<div key={idx} className={`${gridStyles.cell} ${gridStyles.header}`}></div>);
        }
        return (<div key={idx} className={`${gridStyles.cell} ${gridStyles.header}`}>{idx-1}</div>);
      }
      else if (idx === 0) {
        return (<div key={idx} className={`${gridStyles.cell} ${gridStyles.header}`}>{rowIdx-1}</div>);
      }
      console.log(gridStyles.done, col && col.done ? gridStyles.done:'');
      return (
        <div key={idx} className={cx(gridStyles.cell, col && col.done ? gridStyles.done:'')}
          onClick={(e) => this.handleTurn(rowIdx, idx, e)}>
          {col ? String.fromCharCode(col.character) : ''}
        </div>
      );
    });
  }
  renderGrid() {
    return this.props.grid.map((cols, idx) => {
      return (
        <div key={idx} className={gridStyles.row}>
          {this.renderRow(cols, idx)}
        </div>
      );
    });
  }
  render() {
    return (
      <div>
      {this.props.grid && this.renderGrid()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { grid: state.battleshipReducer.userGrid };
}

export default connect(mapStateToProps, actions)(Grid);
