import axios from 'axios';

import { browserHistory } from 'react-router';

import { INIT_GRID } from './types';

//the following should be generated on the server for multiplayer/multidevice game
const SYMBOLS = {
  "carrier": "c",
  "battleship": "b".
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
  for (let i = 0; i < 10; i++) {
    grid[i] = [];
    for (let j = 0; j < 10; j++) {
      grid[i].push('e');
    }
  }
  SHIPS.forEach(ship => {
    const { ship, positions } = ship;
    positions.forEach(cords => {
      grid[cords[0]][cords[1]] = ship;
    });
  });
  return {
    type: INIT_GRID,
    payload: grid
  }
};
