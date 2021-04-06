const { exception } = require('console');
var express = require('express');
var cors = require('cors');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var usernames = [];
var gameArea = {
    width: 700,
    height: 500
}

const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.static(__dirname + '/public'));

server.listen(port, function () {
    console.log('Listening on ' + port);
});

io.on("connection", function (socket) {
    var addedUser = false;

    socket.on("add user", function (username, type) {
        if (username) {
            for (var i = 0; i < usernames.length; i++) {
                if (usernames[i] == username) {
                    username = false;
                    console.log("user not valid", username);
                    socket.emit("error", "PLEASE CHOOSE ANOTHER NAME");
                    return;
                }
            }

            usernames.push(username);
            gameArea.width += 100;
            gameArea.height += 100;
            socket.username = username;
            socket.type = type;
            socket.emit("login", { username: socket.username, type: socket.type });
            socket.broadcast.emit("user joined", { username: socket.username, type: socket.type });
            addedUser = true;
            console.log("add user", socket.username, usernames)
        } else {
            socket.username = null;
        }
    });

    socket.on("update", function (level, x, y, dir) {
        socket.level = level;
        socket.x = x;
        socket.y = y;

        socket.emit("user", {
            userType: "self",
            username: socket.username,
            gameAreaSize: gameArea,
            type: socket.type,
            level: socket.level,
            x: socket.x,
            y: socket.y,
            dir: dir
        });

        socket.broadcast.emit("user", {
            userType: "otherPlayer",
            username: socket.username,
            gameAreaSize: gameArea,
            type: socket.type,
            level: socket.level,
            x: socket.x,
            y: socket.y,
            dir: dir
        });
    });

    socket.on("start game", function () {
        socket.level = 0;
        socket.x = Math.floor(Math.random() * gameArea.width);
        socket.y = Math.floor(Math.random() * gameArea.height);

        socket.emit("user", {
            userType: "self",
            username: socket.username,
            gameAreaSize: gameArea,
            type: socket.type,
            level: socket.level,
            x: socket.x,
            y: socket.y
        });
    });

    socket.on("disconnect", function () {
        if (socket.username) {
            gameArea.width -= 100;
            gameArea.height -= 100;;

            console.log("disconnect", socket.username, gameArea)

            socket.broadcast.emit("user left", { username: socket.username, gameAreaSize: gameArea });
            var index = usernames.findIndex((value) => {
                return value == socket.username;
            });

            if (index >= 0) {
                usernames.splice(index, 1);
            }
            socket.username = null;
        }
    });
});
