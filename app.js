const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');
const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();
const _ = require('lodash');

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    quiet: false,
    noInfo: false,
    //contentBase: 'src',
    stats: {
      assets: false,
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(__dirname + '/dist'));
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

const server = app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});

const SHIPS = [
    { "ship": "carrier", "hitCount": 0, "positions": [[2,9], [3,9], [4,9], [5,9], [6,9]] },
    { "ship": "battleship", "hitCount": 0, "positions": [[5,2], [5,3], [5,4], [5,5]] },
    { "ship": "cruiser", "hitCount": 0, "positions": [[8,1], [8,2], [8,3]] },
    { "ship": "submarine", "hitCount": 0, "positions": [[3,0], [3,1], [3,2]] },
    { "ship": "destroyer", "hitCount": 0, "positions": [[0,0], [1,0]] },
];

const io = require('socket.io')(server);
//var SOCKET_LIST = {};
//var games = [];
let gameSocket;
io.on('connection', (socket) => {
  gameSocket = socket;
  console.log(`a user connected: ${socket.id}`);
  //SOCKET_LIST[socket.id] = socket;

  socket.on('disconnect', () => {
    //delete SOCKET_LIST[socket.id];
    //console.log(`user disconnected ${socket.id}`);
  });

  socket.on('createRoom', createRoom);
  socket.on('joinRoom', joinRoom);
  socket.on('checkRoom', checkRoom);
  socket.on('hostStartGame', function(data) {
    // Broadcast to the other player that host pressed start game
    data['ships'] = SHIPS;
    io.in(data.roomId).emit('gameStartedByHost', data);
    this.emit('turnChange', {myTurn: true});
  });
  socket.on('makeTurn', function(data) {
    //need to send in roomid
    console.log('makeTurn');
    socket.broadcast.to(data.roomId).emit('turnChange', data);
  });
  socket.on('hit', function(data) {
    socket.broadcast.to(data.roomId).emit('updateOpponentHitCount', data);
  });




});

const createRoom = function(host) {
  let roomId = (Math.random() * 10000) | 0;

  // join to the room
  this.join(roomId.toString());

  // Notify 'newGameCreated' at Client side and send gameId & socketId
  let data = {
    roomId: roomId.toString(),
    mySocketId: this.id
  };
  console.log('newGameCreated', data);
  // Broadcast to yourself
  this.emit('newGameCreated', data);
};

const joinRoom = function(data) {
    let room = gameSocket.nsp.adapter.rooms[data.roomId];

    if (room !== undefined) {
      // Limit number of players at 2
      if (room.length <= 1) {
        this.join(data.roomId);
        // ***** Player already Joined
        // Call playerJoined at Frontend and pass room Id
        io.sockets.in(data.roomId).emit('playerJoined', data);
      }
    }
};

// Check if the room is available on socket
const checkRoom = function(roomId) {
  let room = gameSocket.nsp.adapter.rooms[roomId];

  if (!room) {
    this.emit('validateRoom', {valid: false});
  } else {
    if (room.length > 1) {
      this.emit('validateRoom', {valid: false});
    } else {
      this.emit('validateRoom', {valid: true});
    }
  }
};
