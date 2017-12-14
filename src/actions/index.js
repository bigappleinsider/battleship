import axios from 'axios';

import { browserHistory } from 'react-router';

import Socket from '../sockets';

import {
  INIT_GRID,
  MAKE_TURN,
  UPDATE_HIT_COUNT,
  MARK_AS_SUNK,
  TOGGLE_ACTIVE_TURN,
  UPDATE_OPPONENT_HIT_COUNT,
} from './types';

import { HIT_CHARACTER, MISS_CHARACTER } from '../constants';

export function fetchGrid(data) {
  const grid = [];
  const userGrid = [];
  for (let i = 0; i <= 10; i++) {
    grid[i] = [];
    userGrid[i] = [];
    for (let j = 0; j <= 10; j++) {
      grid[i].push(null);
      userGrid[i].push(null);
    }
  }
  data.ships.forEach((shipItem, shipIdx) => {
    const { ship, positions } = shipItem;
    positions.forEach(cords => {
      //Adjust indeces to account for headers
      grid[cords[0]+1][cords[1]+1] = { shipId: shipIdx, hasShip: true };
    });
  });
  return {
    type: INIT_GRID,
    payload: {
      grid,
      userGrid,
      ships: data.ships
    }
  };
}


function isValidTurn(grid, userGrid, rowIdx, colIdx) {
  if (userGrid[rowIdx][colIdx]) {
    //set error message
    //Oops, you alredy made this turn
    return false;
  }
  return true;
}

const updateHitCount = (shipId, roomId) => {
  return (dispatch, getState) => {
    const state = getState();
    const { hitCount } = state.battleshipReducer;
    Socket.emit('hit', { roomId, hitCount: hitCount+1 });

    dispatch({
      type: UPDATE_HIT_COUNT,
      payload: { shipId }
    });
  }
}

const markIfSunk = (ship, userGrid) => {
    //iterate positions +1, marking each cord as done
    const updatedGrid = userGrid.map(function(arr) {
      return arr.slice();
    });
    ship.positions.forEach((position) => {
      updatedGrid[position[0]+1][position[1]+1] = {
        ...updatedGrid[position[0]+1][position[1]+1],
        done: true
      };
    });
    return {
      type: MARK_AS_SUNK,
      payload: { userGrid: updatedGrid }
    };
}

export function toggleActiveTurn() {
  return (dispatch, getState) => {
      const state = getState();

      console.log('toggleActiveTurn action');
      dispatch({
        type: TOGGLE_ACTIVE_TURN
      })
  }
}

export function updateOpponentHitCount(hitCount) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_OPPONENT_HIT_COUNT,
      payload: hitCount
    });
  };
}


export function makeTurn(rowIdx, colIdx, roomId) {
  return (dispatch, getState) => {
    const state = getState();
    const { grid, userGrid, ships, hitCount } = state.battleshipReducer;
    if (isValidTurn(grid, userGrid, rowIdx, colIdx)) {
      dispatch(toggleActiveTurn());
      let turn = {};
      const shipId = grid[rowIdx][colIdx] ? grid[rowIdx][colIdx].shipId : null;
      console.log(rowIdx, colIdx, grid[rowIdx][colIdx]);
      if (grid[rowIdx][colIdx] && grid[rowIdx][colIdx].hasShip) {
        //console.log(`it's a hit`);

        turn = {
          ...userGrid[rowIdx][colIdx],
          isHit: true,
          character: HIT_CHARACTER,
        };

        if (ships[shipId].hitCount+1 === ships[shipId].positions.length) {
          dispatch(markIfSunk(ships[shipId], userGrid));
          turn = {
            ...turn,
            done: true
          };
        }
        dispatch(updateHitCount(shipId, roomId));
      } else {
        //console.log(`it's a miss`);
        turn = {
          ...userGrid[rowIdx][colIdx],
          isHit: false,
          character: MISS_CHARACTER,
        };
      }
      Socket.emit('makeTurn', { roomId });


      dispatch({
        type: MAKE_TURN,
        payload: {
          turn,
          rowIdx,
          colIdx,
        }
      });
    }
  }

}
