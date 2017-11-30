import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import Socket from '../../sockets';
import PropTypes from 'prop-types';

import * as actions from '../../actions';

import gridStyles from '../../styles/grid.scss';

import { USER_CONNECTED } from '../../constants/';

import RoomForm from './room_form';

import { Snackbar } from 'material-ui';


//var io = require('socket.io-client')

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

    Socket.on('turnChange', (data) => {
      console.log('turnChange');
      this.props.toggleActiveTurn();
      //this.setState({ myTurn: data.myTurn });
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
    //   this.props.fetchGrid(data);
    //   this.props.toggleActiveTurn();

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
          {col ? String.fromCharCode(col.character) : ''}
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
    return (
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
        <div className={cx(gridStyles.grid, isGameOver ? gridStyles.gridGameOver : '')}>
        {this.props.userGrid && this.renderGrid()}
        </div>
      </div>
    );
  }
}

/*
grid: state.battleshipReducer.userGrid,
sunkCount: state.battleshipReducer.sunkCount,
ships: state.battleshipReducer.ships,
name: state.battleshipReducer.name,
channel
*/

function mapStateToProps(state) {
  return {
    ...state.battleshipReducer
  };
}

export default connect(mapStateToProps, actions)(Grid);
