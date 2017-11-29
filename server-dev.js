var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
const SocketManager = require('./server/SocketManager')


var app = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    // It suppress error shown in console, so it has to be set to false.
    quiet: false,
    // It suppress everything except error, so it has to be set to false as well
    // to see success build.
    noInfo: false,
    stats: {
      // Config for minimal console.log mess.
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    }
});



/*
var server = app.listen(8080);
var io = require('socket.io').listen(server);
*/

var server = app.listen(3000, 'localhost', function (err) {
    if (err) {
        console.log(err);
    }

  console.log('Listening at localhost:3000');
});

/*
require('./consumer.js)(io);
*/


var io = module.exports.io = require('socket.io').listen(3100);

io.on('connection', SocketManager;
//module.exports.io = io;
