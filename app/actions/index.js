import axios from 'axios';

import { browserHistory } from 'react-router';

import { INIT_GRID, MAKE_TURN } from './types';

//the following should be generated on the server for multiplayer/multidevice game
const SYMBOLS = {
  "carrier": "c",
  "battleship": "b",
  "cruiser": "c",
  "submarine": "s",
  "destroyer": "d",
};

const SHIPS = [
    { "ship": "carrier", "positions": [[2,9], [3,9], [4,9], [5,9], [6,9]] },
    { "ship": "battleship", "positions": [[5,2], [5,3], [5,4], [5,5]] },
    { "ship": "cruiser", "positions": [[8,1], [8,2], [8,3]] },
    { "ship": "submarine", "positions": [[3,0], [3,1], [3,2]] },
    { "ship": "destroyer", "positions": [[0,0], [1,0]] },
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
  SHIPS.forEach(shipItem => {
    const { ship, positions } = shipItem;
    positions.forEach(cords => {
      grid[cords[0]+1][cords[1]+1] = ship;
    });
  });
  return {
    type: INIT_GRID,
    payload: { grid, userGrid }
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

export function makeTurn(rowIdx, colIdx) {
  return (dispatch, getState) => {
    const state = getState();
    const { grid, userGrid } = state.battleshipReducer;
    if (isValidTurn(grid, userGrid, rowIdx, colIdx)) {
      let turn = {
        player: 'A',
      };
      if (grid[rowIdx][colIdx]) {
        console.log(`it's a hit`);
        turn = {
          ...turn,
          isHit: true,
          character: HIT_CHARACTER,
        };
      }
      else {
        console.log(`it's a miss`);
        turn = {
          ...turn,
          isHit: false,
          character: MISS_CHARACTER,
        };
      }
      //adjusting for headers
      //userGrid[rowIdx+1][colIdx+1] = turn;
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
