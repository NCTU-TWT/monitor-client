(function() {

  require.config({
    paths: {
      jquery: 'lib/jquery-1.7.1.min',
      io: 'lib/socket.io.min.amd',
      raphael: 'lib/raphael-min',
      underscore: 'lib/underscore-min.amd',
      backbone: 'lib/backbone-min.amd',
      hogan: 'lib/hogan-1.0.5.min.amd'
    }
  });

  require(['jquery', 'io', 'raphael', 'underscore', 'backbone', 'hogan'], function($, io, Raphael, _, Backbone, hogan) {
    var socket;
    socket = io.connect();
    socket.on('chart', function(data) {
      return console.log(data);
    });
    return socket.on('stream', function(data) {
      return console.log(data);
    });
  });

}).call(this);
