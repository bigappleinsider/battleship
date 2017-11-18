import { INIT_GRID } from '../actions/types';

const INITIAL_STATE = { grid: [] };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case INIT_GRID:
      return { ...state, grid: action.payload };
    default:
      return state;
  }
}
