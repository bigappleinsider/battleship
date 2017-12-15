import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import ScoreHolder from './ScoreHolder';
import s from './ScoreBoard.scss';
import * as icons from '~src/assets/ships';
import * as infoIcons from '~src/assets/infoIcons';

const ScoreBoard = ({ ships, hitCount, opponentHitCount, isHost }) => {
  return (
    <div className={s['player']}>

      <ScoreHolder
        className={'orange'}
        score={isHost?hitCount:opponentHitCount}
        name={'player 1'}
        />

      <ScoreHolder
        className={'green'}
        score={isHost?opponentHitCount:hitCount}
        name={'player 2'}
        />

      <div className={s['battleInfo']}>

      {ships.map((ship) => {
        return (
          <div>
            <img src={icons[ship.ship]} alt={ship.ship} />
            {ship.positions.map((position, idx) => {
              if (idx<ship.hitCount) {
                return (
                  <img src={infoIcons['zoneHit']} className={s['zone']} />
                );
              }
              return (
                <img src={infoIcons['zone']} className={s['zone']} />
              );
            })}
          </div>
        );
      })}

      </div>
    </div>
  );
}

ScoreBoard.propTypes = {
  ships: PropTypes.array,
  hitCount: PropTypes.number,
  opponentHitCount: PropTypes.number,
  isHost: PropTypes.string,
};

export default ScoreBoard;
