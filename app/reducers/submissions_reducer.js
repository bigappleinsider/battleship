import { FETCH_SUBMISSIONS } from '../actions/types';

const INITIAL_STATE = { submissions: null };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_SUBMISSIONS:
      return { ...state, submissions: action.payload };
    default:
      return state;
  }
}
