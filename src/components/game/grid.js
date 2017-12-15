import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import PropTypes from 'prop-types';

import Socket from '~src/sockets';
import * as actions from '~src/actions';
import gridStyles from '~src/styles/grid.scss';

import { USER_CONNECTED, HIT_CHARACTER, MISS_CHARACTER } from '~src/constants/';

import RoomForm from './RoomForm';
import ScoreBoard from './ScoreBoard';

import { Snackbar } from 'material-ui';

import hitImage from '~src/assets/hit.png';
import missImage from '~src/assets/miss.png';

class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCreated: null,
      roomId: '',
      error: '',
      roomValid: false,
      gameStart: false,
      //myTurn: false,
    };
    this.handleTurn = this.handleTurn.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.createGame = this.createGame.bind(this);
    this.getRoomInput = this.getRoomInput.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.startGame = this.startGame.bind(this);

  }
  componentWillMount() {

    Socket.on('newGameCreated', (data) => {
      console.log('Player 1: mySocketId', data.mySocketId);
      this.setState({
        roomCreated: data.roomId
      });
    });

    Socket.on('validateRoom', (flag) => {
      if (flag.valid) {
        this.setState({roomValid: true});
        console.log('valid', this.state.roomValid);
      } else {
        this.setState({roomValid: false});
        console.log('not valid');
      }
    });

    Socket.on('updateOpponentHitCount', (data) => {
      this.props.updateOpponentHitCount(data.hitCount);
    });

    Socket.on('turnChange', (data) => {
      this.props.toggleActiveTurn();
    });

    Socket.on('gameStartedByHost', (data) => {
      console.log('gameStart:', data.gameStart);
      this.setState({
        playerJoinedModals: false,
        gameStart: data.gameStart
      });
      this.props.fetchGrid(data);
    });

    Socket.on('playerJoined', (data) => {
      this.setState({
        roomId: data.roomId,
        playerJoinedModals: true
      });
    });
  }
  createGame(e) {
    e.preventDefault();
    Socket.emit('createRoom');
  }
  getRoomInput(e) {
    const roomId = e.target.value;
    this.setState({roomId: e.target.value});

    if (this.state.roomValid) {
      this.setState({roomValid: true});
    }

    Socket.emit('checkRoom', roomId);
  }
  handleReset() {
    this.props.fetchGrid();
  }
  displayError(error){
    this.setState({ error });
    setTimeout(() => {
      this.setState({ error: '' });
    }, 3000);
  }
  handleTurn(rowIdx, colIdx, e) {
    if (this.props.myTurn) {
      this.props.makeTurn(rowIdx, colIdx, this.state.roomId);
    }
    else {
      this.displayError(`The other player's turn`);
    }
  }
  joinRoom() {
    const data =  {
      roomId: this.state.roomId
    };
    this.setState({
      roomCreated: null
    });

    // Validate the room

    if (this.state.roomValid) {
      Socket.emit('joinRoom', data);
      this.setState({ roomId: '' });
    }
    else {
      this.setState({ roomId: '' });
    }
  }
  startGame() {
    console.log('Game is starting');
    this.setState({
      gameStart: true,
      playerJoinedModals: false
    });

    const data = {
      roomId: this.state.roomCreated,
      gameStart: true
    };

    // Notify Socket server

    Socket.emit('hostStartGame', data);
  }
  renderRow(row, rowIdx) {
    return row.map((col, idx) => {
      if (rowIdx === 0) {
        if (idx === 0) {
          return (<div key={idx} className={cx(gridStyles.cell, gridStyles.header)}></div>);
        }
        return (<div key={idx} className={cx(gridStyles.cell, gridStyles.header)}>{String.fromCharCode(idx-1+65)}</div>);
      }
      else if (idx === 0) {
        return (<div key={idx} className={cx(gridStyles.cell, gridStyles.header)}>{rowIdx}</div>);
      }
      return (
        <div key={idx} className={cx(gridStyles.cell, col && col.done ? gridStyles.done:'')}
          onClick={(e) => this.handleTurn(rowIdx, idx, e)}>
          { col && col.character === HIT_CHARACTER && <img src={hitImage} alt="hit" />}
          { col && col.character === MISS_CHARACTER && <img src={missImage} alt="miss" />}
        </div>
      );
    });
  }
  renderGrid() {
    return this.props.userGrid.map((cols, idx) => {
      return (
        <div key={idx} className={gridStyles.row}>
          {this.renderRow(cols, idx)}
        </div>
      );
    });
  }
  render() {
    //          <button onClick={this.handleReset}>Reset</button>

    const isGameOver = this.props.ships && this.props.sunkCount === this.props.ships.length;
    const { roomCreated, roomId, playerJoinedModals, gameStart, error } = this.state;
    const colorA = roomCreated?'orange':'green';
    const colorB = !roomCreated?'orange':'green';
    const activeColor = this.props.myTurn?gridStyles[colorA]:gridStyles[colorB];
    return (
      <div className={gridStyles.gameWrapper}>
        {gameStart && <ScoreBoard isHost={roomCreated} ships={this.props.ships} hitCount={this.props.hitCount} opponentHitCount={this.props.opponentHitCount} />}
      <div className={gridStyles.grid}>
        <div className={gridStyles.gridHeader}>
          {!gameStart &&
            <RoomForm
              roomId={roomId}
              roomCreated={roomCreated}
              playerJoinedModals={playerJoinedModals}
              joinRoom={this.joinRoom}
              createGame={this.createGame}
              startGame={this.startGame}
              getRoomInput={this.getRoomInput} />
          }
          {error && <Snackbar open={true} message={error} /> }
        </div>
        { isGameOver && gameStart &&
          <h3 className={gridStyles.gameOver}>
          Game Over
          </h3>
        }
        <div className={cx(gridStyles.grid, activeColor, isGameOver ? gridStyles.gridGameOver : '')}>
        {this.props.userGrid && this.renderGrid()}
        </div>
      </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.battleshipReducer
  };
}

export default connect(mapStateToProps, actions)(Grid);
