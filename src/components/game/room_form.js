import React, { Component } from 'react';

import PropTypes from 'prop-types';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import { RaisedButton, TextField, CircularProgress } from 'material-ui';

class RoomForm extends Component {
  constructor(props) {
    super(props);
    this.createGame = this.props.createGame.bind(this);
    this.getRoomInput = this.props.getRoomInput.bind(this);
    this.joinRoom = this.props.joinRoom.bind(this);
    this.startGame = this.props.startGame.bind(this);
  }
  renderCreateGameButton() {
    return (
      <Card>
        <CardTitle title="Battleship Game Setup" />
        <CardActions>
          <RaisedButton label="Create Game" onClick={this.createGame} />
          <CardText>OR</CardText>
          <TextField hintText="Enter Game ID to Join" onChange={this.getRoomInput} value={this.props.roomId} />
        </CardActions>
      </Card>
    );
  }
  renderRoomCreated() {
    return (
      <Card>
        <CardTitle title="Battleship Game Setup" />
        <CardText>You joined game: {this.props.roomCreated}</CardText>
        <CardText>Share game ID to invite your friend</CardText>
      </Card>
    );
  }
  renderJoinButton() {
    return (
      <Card>
        <RaisedButton primary={true} label="Join Game" onClick={this.joinRoom} />
      </Card>
    );
  }
  renderStartGameScreen() {
    const joinCard = () => {
      return (
        <Card>
          <CardActions>
            <RaisedButton onClick={this.startGame} label="Start Game" />
          </CardActions>
        </Card>
      );
    }

    return (
      <Card>
        <CardTitle title={this.props.roomCreated?'Player joined! Press Start to play':'Waiting for host'} />
        {!this.props.roomCreated && <CircularProgress size={60} thickness={5} />}
        {this.props.roomCreated && joinCard()}
      </Card>
    );
  }
  render() {
    if (this.props.playerJoinedModals) {
      return (this.props.playerJoinedModals && this.renderStartGameScreen());
    }
    return (
      <div>
        {!this.props.roomCreated && this.renderCreateGameButton()}
        {this.props.roomCreated && this.renderRoomCreated()}
        {(this.props.roomCreated !== this.props.roomId) && this.props.roomId && this.renderJoinButton()}
      </div>
    );
  }
}

RoomForm.propTypes = {
  roomId: PropTypes.string, //input Text
  roomCreated: PropTypes.string, //roomId, - generated
  createGame: PropTypes.func,
  getRoomInput: PropTypes.func,
  joinRoom: PropTypes.func
};

export default RoomForm;
