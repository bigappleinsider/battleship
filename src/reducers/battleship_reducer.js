import {
  INIT_GRID,
  MAKE_TURN,
  UPDATE_HIT_COUNT,
  MARK_AS_SUNK,
  TOGGLE_ACTIVE_TURN,
  UPDATE_OPPONENT_HIT_COUNT,
} from '../actions/types';

const INITIAL_STATE = {
  grid: [],
  userGrid: [],
  ships: [],
  sunkCount: 0,
  channel: null,
  myTurn: false,
  hitCount: 0,
  opponentHitCount: 0
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case INIT_GRID:
      return {
        ...state,
        ...action.payload,
        sunkCount: 0
      };
    case UPDATE_OPPONENT_HIT_COUNT:
      return {
        ...state,
        opponentHitCount: action.payload
      };
    case TOGGLE_ACTIVE_TURN:
      return {
          ...state,
          myTurn: !state.myTurn
      };
    case UPDATE_HIT_COUNT:
      const { shipId } = action.payload;
      return {
        ...state,
        ships: [
          ...state.ships.slice(0, shipId),
          { ...state.ships[shipId], hitCount: state.ships[shipId].hitCount + 1 },
          ...state.ships.slice(shipId+1),
        ],
        hitCount: state.hitCount+1
      };

    case MARK_AS_SUNK:
      return {
        ...state,
        userGrid: action.payload.userGrid,
        sunkCount: state.sunkCount + 1
      };

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
