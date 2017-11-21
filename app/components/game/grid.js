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
    this.handleReset = this.handleReset.bind(this);
  }
  componentWillMount() {
    this.props.fetchGrid();
  }
  handleReset() {
    this.props.fetchGrid();
  }
  handleTurn(rowIdx, colIdx, e) {
      this.props.makeTurn(rowIdx, colIdx);
  }
  renderRow(row, rowIdx) {
    return row.map((col, idx) => {
      if (rowIdx === 0) {
        if (idx === 0) {
          return (<div key={idx} className={cx(gridStyles.cell, gridStyles.header)}></div>);
        }
        return (<div key={idx} className={cx(gridStyles.cell, gridStyles.header)}>{idx-1}</div>);
      }
      else if (idx === 0) {
        return (<div key={idx} className={cx(gridStyles.cell, gridStyles.header)}>{rowIdx-1}</div>);
      }
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
    const isGameOver = this.props.ships && this.props.sunkCount === this.props.ships.length;
    return (
      <div className={gridStyles.grid}>
        <div className={gridStyles.gridHeader}>
          <h3>Battleship</h3>
          <button onClick={this.handleReset}>Reset</button>
        </div>
        { isGameOver &&
          <h3 className={gridStyles.gameOver}>
          Game Over
          </h3>
        }
        <div className={cx(gridStyles.grid, isGameOver ? gridStyles.gridGameOver : '')}>
        {this.props.grid && this.renderGrid()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    grid: state.battleshipReducer.userGrid,
    sunkCount: state.battleshipReducer.sunkCount,
    ships: state.battleshipReducer.ships,
  };
}

export default connect(mapStateToProps, actions)(Grid);
