import { FETCH_QUESTIONAIRES, FETCH_QUESTIONAIRE } from '../actions/types';

const INITIAL_STATE = { questionaire: null, questionaires: null };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_QUESTIONAIRES:
      return { ...state, questionaires: action.payload };
    case FETCH_QUESTIONAIRE:
        return { ...state, questionaire: action.payload };
    default:
      return state;
  }
}
