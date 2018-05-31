var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    path = require('path'),
    usernames = [],
    colors = ["green", "red", "blue", "brown"];

app.get('*', function(req, res){
  res.sendFile(path.join(__dirname + '/index.html'));
})

server.listen(process.env.PORT || 3000, function(){
  console.log('server is running..');
});

io.on('connection', function(socket){
  console.log('socket connected..');

  socket.on('new user', function(data, callback){
    if(usernames.indexOf(data) !== -1){
      callback(false);
    } else {
      callback(true);
      socket.username = data;
      usernames.push(socket.username);
      updateUsernames();
    }
  });

  //update usernames
  function updateUsernames(){
    io.emit('usernames', usernames);
  }

  //send a msg
  socket.on('send msg', function(data){
    io.sockets.emit('new msg', {msg: data, user: socket.username, color: colors[Math.floor(Math.random() * colors.length)]});
  });

  //disconnecting
  socket.on('disconnect', function(data){
    if(!socket.username){
      return;
    }
    usernames.splice(usernames.indexOf(socket.username, 1));
    updateUsernames();
  });
});
