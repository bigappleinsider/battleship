import React from 'react';

import cx from 'classnames';

import s from '~src/styles/ScoreBoard.scss';

import * as icons from '~src/assets/ships';

import * as infoIcons from '~src/assets/infoIcons';

const ScoreBoard = ({ ships, hitCount, opponentHitCount, isHost }) => {
  return (
    <div className={s['player']}>
      <div className={cx(s['orange'], s['scoreWrapper'])}>
        <div className={s['score']}>
          {isHost?hitCount:opponentHitCount}
        </div>
        <div className={s['name']}>
          player 1
        </div>
      </div>

      <div className={cx(s['green'], s['scoreWrapper'])}>
        <div className={s['score']}>
        {isHost?opponentHitCount:hitCount}
        </div>
        <div className={s['name']}>
        player 2
        </div>
      </div>
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

export default ScoreBoard;
