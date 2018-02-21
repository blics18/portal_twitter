var config = require('./config');
var cookieParser = require('cookie');
var session = require('client-sessions');
var userModel = require('./models/user');

var io = null;

module.exports = {
  init: function(server){
    io = require('socket.io')(server);
    io.on('connection', function(socket){
      console.log('user connected');
      var cookie = cookieParser.parse(socket.request.headers.cookie);
      var opts = config;
      var user = session.util.decode(opts, cookie.session);

      userModel.findOne({_id: user.content.user._id},
      function(err, user){
        if (err){
          return res.send(err);
        }
        if (user){
             // Connected, let's sign-up for to receive messages for this room
             for (i = 0; i < user.following.length; i++){
              socket.join(user.following[i]);
            }
        }else{
          res.status(404).send("404 - User not found");
        }

      });

      socket.on('disconnect', function(){
       console.log('user disconnected');
     });
    });
  },
  instance: function(){
    return io;
  }
};
