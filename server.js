
var express = require ('express'),      
    app = express()
    server = require('http').createServer(app),
    io = require ('socket.io').listen(server);
    usernames = [];

server.listen(process.env.PORT || 3000);
console.log('server is running ....');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
    console.log('socket  is connected');
    socket.on('new user', function (data, callback){
        if(usernames.indexOf(data) != -1) {
            calback(false);
        } else {
            callback(true);
            socket.username = data;
            usernames.push(socket.username)
            updateUsernames();
        }
    });
        //Updates usernames
        function updateUsernames() {
            io.socket.emit('usernames', usernames);
        }



    //send message
    socket.on('send message', function(data){
        io.sockets.emit('new message', {msg : data});
    });


    //disconnect

    socket.on ('disconnect', function(data) {
        if(!socket.username) {
            return;
        }

        username.splice(usernames.indexOf(socket.username), 1);
        updateUsernames();
        
    });
});