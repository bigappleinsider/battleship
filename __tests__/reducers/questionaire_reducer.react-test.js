import questionaireReducer from '../../app/reducers/questionaire_reducer';

import { FETCH_QUESTIONAIRE } from '../../app/actions/types';

describe('questionaire reducer', () => {
  it('has default state', () => {
    expect(questionaireReducer(undefined, { type: 'unexpected' })).toEqual({
      questionaire: null,
      questionaires: null
    });
  });
  it('set questionaire', () => {
    const questionaire = {
      "_id":"58cd4ab569f1de1ad0e1f88b",
      "name":"Life on Mars",
      "questions":[]
    };

    expect(questionaireReducer(undefined, {
      type: FETCH_QUESTIONAIRE,
      payload: questionaire
    })).toEqual({
      questionaire: questionaire,
      questionaires: null
    });
  });
});
