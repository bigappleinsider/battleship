import axios from 'axios';

import { browserHistory } from 'react-router';

import { INIT_GRID, MAKE_TURN, UPDATE_HIT_COUNT, MARK_AS_SUNK } from './types';

//the following should be generated on the server for multiplayer/multidevice game
const SHIPS = [
    { "ship": "carrier", "hitCount": 0, "positions": [[2,9], [3,9], [4,9], [5,9], [6,9]] },
    { "ship": "battleship", "hitCount": 0, "positions": [[5,2], [5,3], [5,4], [5,5]] },
    { "ship": "cruiser", "hitCount": 0, "positions": [[8,1], [8,2], [8,3]] },
    { "ship": "submarine", "hitCount": 0, "positions": [[3,0], [3,1], [3,2]] },
    { "ship": "destroyer", "hitCount": 0, "positions": [[0,0], [1,0]] },
];
export function fetchGrid() {
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
  SHIPS.forEach((shipItem, shipIdx) => {
    const { ship, positions } = shipItem;
    positions.forEach(cords => {
      //Adjust indeces to account for headers
      grid[cords[0]+1][cords[1]+1] = shipIdx;
    });
  });
  return {
    type: INIT_GRID,
    payload: { grid, userGrid, ships: SHIPS }
  };
}

const HIT_CHARACTER = 10005;
const MISS_CHARACTER = 8226;

function isValidTurn(grid, userGrid, rowIdx, colIdx) {
  if (userGrid[rowIdx][colIdx]) {
    //set error message
    //Oops, you alredy made this turn
    return false;
  }
  return true;
}

const updateHitCount = (shipId) => {
  return {
    type: UPDATE_HIT_COUNT,
    payload: { shipId }
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
      payload: updatedGrid
    };
}

export function makeTurn(rowIdx, colIdx) {
  return (dispatch, getState) => {
    const state = getState();
    const { grid, userGrid, ships } = state.battleshipReducer;

    if (isValidTurn(grid, userGrid, rowIdx, colIdx)) {
      let turn = {
        player: 'A',
      };
      const shipId = grid[rowIdx][colIdx];
      if (shipId) {
        //console.log(`it's a hit`);
        turn = {
          ...turn,
          isHit: true,
          character: HIT_CHARACTER,
        };

        if (ships[shipId].hitCount+1 === ships[shipId].positions.length) {
          dispatch(markIfSunk(ships[shipId], userGrid));
        }
        dispatch(updateHitCount(shipId));
      }
      else {
        //console.log(`it's a miss`);
        turn = {
          ...turn,
          isHit: false,
          character: MISS_CHARACTER,
        };
      }

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
