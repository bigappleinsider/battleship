import { INIT_GRID, MAKE_TURN } from '../actions/types';

const INITIAL_STATE = { grid: [], userGrid: [] };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case INIT_GRID:
      return { ...state, ...action.payload };
    case MAKE_TURN:
      const { rowIdx, colIdx, turn } = action.payload;
      const updatedRow = [
        ...state.userGrid[rowIdx].slice(0, colIdx),
        turn,
        ...state.userGrid[rowIdx].slice(colIdx+1),
      ];
      return {
        ...state,
        userGrid: [
          ...state.userGrid.slice(0, rowIdx),
          updatedRow,
          ...state.userGrid.slice(rowIdx+1),
        ]
      };
    default:
      return state;
  }
}
