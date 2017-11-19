import React, { Component } from 'react';

import PropTypes from 'prop-types';

import gridStyles from '../../styles/grid.scss';

class Grid extends Component {
  renderRow(row, idx) {
    const cols = row.map(col => {
      return (<div className={gridStyles.cell}>{col.substring(0, 1)}</div>);
    });
    cols.unshift(<div className={`${gridStyles.cell} ${gridStyles.header}`}>{idx}</div>);
    return cols;
  }
  renderHeaderX(cols) {
    const header = cols.map((col, idx) => {
      return(<div key={idx} className={gridStyles.cell}>{idx}</div>);
    });
    header.unshift(<div className={gridStyles.cell}></div>);
    return header;
  }
  renderGrid() {
    const rows = this.props.grid.map((cols, idx) => {
      return (
        <div key={idx} className={gridStyles.row}>
          {this.renderRow(cols, idx)}
        </div>
      );
    });
    rows.unshift(
      <div className={`${gridStyles.row} ${gridStyles.header}`}>
        {this.renderHeaderX(this.props.grid[0])}
      </div>
    );
    return rows;
  }
  render() {
    return (
      <div>
      {this.props.grid.length && this.renderGrid()}
      </div>
    );
  }
}

Grid.propTypes = {
  grid: PropTypes.array,
};

export default Grid;
