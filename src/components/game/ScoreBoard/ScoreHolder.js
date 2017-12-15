import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import s from './ScoreHolder.scss';

const ScoreHolder = ({ className, score, name }) => {
  return (
    <div className={cx(s[className], s['scoreWrapper'])}>
      <div className={s['score']}>
      {score}
      </div>
      <div className={s['name']}>
        {name}
      </div>
    </div>
  );
}

ScoreHolder.propTypes = {
  score: PropTypes.nuber,
  name: PropTypes.string,
};

export default ScoreHolder;
