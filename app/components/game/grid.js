import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import * as actions from '../../actions';

import gridStyles from '../../styles/grid.scss';

class Grid extends Component {
  constructor(props) {
    super(props);
    this.handleTurn = this.handleTurn.bind(this);
  }
  handleTurn(rowIdx, colIdx, e) {
      //Adjust indeces to account for headers
      console.log(rowIdx, colIdx);
      this.props.makeTurn(rowIdx, colIdx);
  }
  /*
  const turn = {
    player: 'A',
    isHit: false,
    character: '&#8226;'
  };
  */
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
      console.log(col, col && String.fromCharCode(col.character));
      return (
        <div key={idx} className={gridStyles.cell}
          onClick={(e) => this.handleTurn(rowIdx, idx, e)}>
          {col?String.fromCharCode(col.character):''}
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
