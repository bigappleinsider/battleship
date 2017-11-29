//process.env.NODE_ENV

const io = require('../app.js').io
console.log('io', io);

var clients =[];
var channels = [];

module.exports = function(socket){
  var channel = `game_${Math.round(clients.length/2)}`;
  socket.join(channel);
  var name = clients.length%2 === 0 ? 'Player A' : 'Player B';
  clients.push(socket);

  //console.log("connected"+socket.id);
  const SHIPS = [
      { "ship": "carrier", "hitCount": 0, "positions": [[2,9], [3,9], [4,9], [5,9], [6,9]] },
      { "ship": "battleship", "hitCount": 0, "positions": [[5,2], [5,3], [5,4], [5,5]] },
      { "ship": "cruiser", "hitCount": 0, "positions": [[8,1], [8,2], [8,3]] },
      { "ship": "submarine", "hitCount": 0, "positions": [[3,0], [3,1], [3,2]] },
      { "ship": "destroyer", "hitCount": 0, "positions": [[0,0], [1,0]] },
  ];
  socket.emit('USER_JOINED', { ships: SHIPS, channel, name });


  if (clients.length%2 === 0) {
    io.to(channel).emit('GAME_READY');
    //io.in(channel).emit('GAME_READY');
    channels.push('Player A');
  }

  /*
  if (numUsersInChannel === 2) {
    io.in(channel).emit('GAME_READY', 'cool game');
  }
  */
  //socket.broadcast.to('game').emit('message', 'nice game');

};
