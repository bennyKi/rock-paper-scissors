window.onload = async function () {
    var canvas = document.getElementById("canvas");

    var ctx = canvas.getContext("2d");
    var addedUser = false;
    var currentMouseX, currentMouseY;

    var socket = io();

    var images = {
        walk: [],
        paper: [],
        scissors: []
    };
    await loadGameImages();

    await login();

    async function loadGameImages() {
        for (var i = 1; i < 5; i++) {
            images.walk.push(await loadImg("/images/walk-" + i.toString() + ".svg"));
            images.paper.push(await loadImg("/images/paper-" + i.toString() + ".svg"));
            images.scissors.push(await loadImg("/images/scissors-" + i.toString() + ".svg"));
        }
    }

    async function loadImg(src) {
        return new Promise(resolve => {
            var img = new Image();
            img.src = src;
            img.addEventListener('load', (event) => {
                resolve(img);
            });
        });
    }

    async function login() {
        console.log("login");

        //anlegen der Variablen
        var walk = {
            image: images.walk[0],
            x: Math.round(800 / 8),
            y: 150,
            width: images.walk[0].width * 2,
            height: images.walk[0].height * 2,
            selected: false
        }
        var paper = {
            image: images.paper[0],
            x: Math.round(800 / 3),
            y: 150,
            width: images.paper[0].width * 2,
            height: images.paper[0].height * 1.4,
            selected: false
        }
        var scissors = {
            image: images.scissors[0],
            x: Math.round(800 / 1.7),
            y: 100,
            width: images.scissors[0].width * 2,
            height: images.scissors[0].height * 2,
            selected: false
        }
        var input = {
            value: "",
            x: 175,
            y: 400,
            width: 800 / 2,
            height: 50,
            selected: false
        };
        var button = {
            x: 263,
            y: 500,
            width: 210,
            height: 50,
            clicked: false
        };

        function draw() {
            console.log("draw");

            //background
            ctx.fillStyle = "aqua";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            //Schere, Stein und Papier mit der doppelten Groesse zeichnen 
            ctx.drawImage(walk.image, walk.x, walk.y, walk.width, walk.height);
            ctx.drawImage(paper.image, paper.x, paper.y, paper.width, paper.height);
            ctx.drawImage(scissors.image, scissors.x, scissors.y, scissors.width, scissors.height);

            //canvas input field
            ctx.fillStyle = "white";
            ctx.fillRect(input.x, input.y, input.width, input.height);
            ctx.font = "45px Arial";
            if (input.selected) {
                ctx.strokeStyle = "black";
                ctx.lineWidth = "5";
                ctx.strokeRect(input.x, input.y, input.width, input.height);
                ctx.fillStyle = "black";
                ctx.fillText(input.value + "|", input.x, 437)
            } else {
                ctx.fillStyle = "black";
                ctx.fillText(input.value, input.x, 437)
            }


            //button
            ctx.fillStyle = "yellow";
            ctx.fillRect(button.x, button.y, button.width, button.height);
            ctx.fillStyle = "white";
            ctx.font = "30px Arial Black";
            ctx.fillText("Join Game", 280, 535)
        }
        draw();

        var walkTouched, paperTouched, scissorsTouched, inputTouched, buttonTouched;

        function checkMousePosition(mouseX, mouseY) {
            walkTouched = checkPosition(
                mouseX,
                mouseY,
                walk.x,
                walk.y,
                walk.width,
                walk.height
            );
            paperTouched = checkPosition(
                mouseX,
                mouseY,
                paper.x,
                paper.y,
                paper.width,
                paper.height
            );
            scissorsTouched = checkPosition(
                mouseX,
                mouseY,
                scissors.x,
                scissors.y,
                scissors.width,
                scissors.height
            );
            inputTouched = checkPosition(
                mouseX,
                mouseY,
                input.x,
                input.y,
                input.width,
                input.height
            );
            buttonTouched = checkPosition(
                mouseX,
                mouseY,
                button.x,
                button.y,
                button.width,
                button.height
            );
        }

        canvas.addEventListener('mousemove', (event) => {
            currentMouseX = event.clientX;
            currentMouseY = event.clientY;
            if (!addedUser) {
                checkMousePosition(event.clientX, event.clientY);

                if (walkTouched) {
                    if (walk.selected) {
                        walk.image = images.walk[2]
                    } else {
                        walk.image = images.walk[3];
                    }
                    if (paper.selected) {
                        paper.image = images.paper[2];
                    } else {
                        paper.image = images.paper[0];
                    }
                    if (scissors.selected) {
                        scissors.image = images.scissors[2];
                    } else {
                        scissors.image = images.scissors[0];
                    }

                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    draw();
                }

                if (paperTouched) {
                    if (walk.selected) {
                        walk.image = images.walk[2]
                    } else {
                        walk.image = images.walk[0];
                    }
                    if (paper.selected) {
                        paper.image = images.paper[2];
                    } else {
                        paper.image = images.paper[3];
                    }
                    if (scissors.selected) {
                        scissors.image = images.scissors[2];
                    } else {
                        scissors.image = images.scissors[0];
                    }

                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    draw();
                }

                if (scissorsTouched) {
                    if (walk.selected) {
                        walk.image = images.walk[2]
                    } else {
                        walk.image = images.walk[0];
                    }
                    if (paper.selected) {
                        paper.image = images.paper[2];
                    } else {
                        paper.image = images.paper[0];
                    }
                    if (scissors.selected) {
                        scissors.image = images.scissors[2];
                    } else {
                        scissors.image = images.scissors[3];
                    }

                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    draw();
                }
            }
        });

        canvas.addEventListener('click', (event) => {
            if (!addedUser) {
                checkMousePosition(event.clientX, event.clientY);

                if (walkTouched) {
                    walk.image = images.walk[2];
                    walk.selected = true;
                    paper.image = images.paper[0];
                    paper.selected = false;
                    scissors.image = images.scissors[0];
                    scissors.selected = false;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    draw();
                }

                if (paperTouched) {
                    walk.image = images.walk[0];
                    walk.selected = false;
                    paper.image = images.paper[2];
                    paper.selected = true;
                    scissors.image = images.scissors[0];
                    scissors.selected = false;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    draw();
                }

                if (scissorsTouched) {
                    walk.image = images.walk[0];
                    walk.selected = false;
                    paper.image = images.paper[0];
                    paper.selected = false;
                    scissors.image = images.scissors[2];
                    scissors.selected = true;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    draw();

                }


                button.clicked = false;
                if (buttonTouched) {
                    button.clicked = true;
                    inputTuched = false;
                }

                input.selected = false;
                if (inputTouched) {
                    input.selected = true;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    draw();
                } else {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    draw();
                }

                if (button.clicked) {
                    var username = input.value.trim();

                    var selected;
                    if (walk.selected) {
                        selected = 'walk';
                    } else if (paper.selected) {
                        selected = 'paper';
                    } else if (scissors.selected) {
                        selected = 'scissors';
                    } else {
                        selected = false;
                    }

                    if (username && selected) {
                        socket.emit("add user", username, selected);
                    } else if (!username) {
                        showMessage("USERNAME IS NOT DEFINED", "red", "50");
                        username = null;
                        selected = null;
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    } else if (!selected) {
                        showMessage("PLEASE CHOOSE A CHARACTER", "red", "50");
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    }

                    socket.on("error", (error) => {
                        showMessage(error, "red", "45");
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    });

                    socket.on("login", (user) => {
                        addedUser = true;
                        startGame(user.username, user.type);
                    });

                    socket.on("user joined", (user) => {
                        //TODO
                    });
                }
            }
        });

        window.addEventListener('keydown', (event) => {
            if (!addedUser) {
                if (input.selected && event.key.length == 1) {
                    input.value += event.key;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    draw();
                } else if (input.selected && event.key == 'Backspace') {
                    var string = new String();
                    for (var i = 0; i < input.value.length - 1; i++) {
                        string += input.value[i];
                    }
                    input.value = string;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    draw();
                }
            }
        });
    }

    var self;
    var players = [];
    var message = null;

    function startGame(username, type) {
        socket.emit("start game");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        socket.on("user", (user) => {
            if (user.userType == "self") {
                self = user;
                self.currentMouseX = currentMouseX;
                self.currentMouseY = currentMouseY;
                self.gameAreaSize = user.gameAreaSize;

                switch (self.type) {
                    case "walk":
                        self.image = images.walk[self.level];
                        break;
                    case "paper":
                        self.image = images.paper[self.level];
                        break;
                    case "scissors":
                        self.image = images.scissors[self.level];
                    default:
                        break;
                }
                draw();
            } else {
                var player = players.find((player) => player.username == user.username);
                if (player) {
                    player.x = user.x;
                    player.y = user.y;
                    player.level = user.level;
                    player.currentMouseX = user.currentMouseX;
                    player.currentMouseY = user.currentMouseY;
                } else {
                    players.push(user);
                }
                draw();
            }
        });

        socket.on("user left", (user) => {
            var index = players.findIndex((player) => player.username == user.username);
            if (index >= 0) {
                players.splice(index, 1);
            }
            self.gameAreaSize = user.gameAreaSize;
        });


        setInterval(() => {
            socket.emit("update", self.level, self.x, self.y, currentMouseX, currentMouseY);

            players.forEach((player) => {
                var collision = checkCollision(self, player);
                if (collision) {
                    console.log("collision", collision, "compare", compare(self.type, player.type));
                    if (compare(self.type, player.type) && compare(self.type, player.type) != "draw") {
                        if (self.level < 4) {
                            self.level++;
                        }
                        console.log(self.level);
                        message = {
                            text: player.username + " killed!",
                            color: "green",
                            size: "150",
                            duration: 60
                        }
                    } else {
                        self.level--;
                        if (self.level <= 0) {
                            self.level = 0;
                            message = {
                                text: "GAME OVER",
                                color: "red",
                                size: "100",
                                duration: 60
                            };

                            setTimeout(() => {
                                location.reload();
                            }, 1000);
                        }
                    }
                }
                console.log("collision", collision);
            });
        }, 50);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //offset
        var marginX = (self.gameAreaSize.width - canvas.width) / 2;
        var marginY = (self.gameAreaSize.height - canvas.height) / 2;
        self.offset = {
            x: null,
            y: null
        }

        if (self.x < canvas.width / 2) {
            self.offset.x = 0;
        } else if (self.x > canvas.width / 2 + 2 * marginX) {
            self.offset.x = marginX * 2;
        } else {
            self.offset.x = self.x - canvas.width / 2;
        }

        if (self.y < canvas.height / 2) {
            self.offset.y = 0;
        } else if (self.y > canvas.height / 2 + 2 * marginY) {
            self.offset.y = marginY * 2;
        } else {
            self.offset.y = self.y - canvas.height / 2;
        }

        //background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawStars(0, 0, canvas.width, canvas.height);

        //line
        ctx.strokeStyle = "blue";
        ctx.lineWidth = "5";
        ctx.beginPath();
        ctx.moveTo(self.x + self.image.width / 2 - self.offset.x, self.y + self.image.height / 2 - self.offset.y);
        ctx.lineTo(currentMouseX, currentMouseY);
        ctx.stroke();
        ctx.moveTo(0, 0);

        //calculate mouse position
        var speed = 2.5;
        if (currentMouseX < self.x - self.offset.x + self.image.width / 2 - 50) {
            self.x -= speed;
        } else if (currentMouseX > self.x - self.offset.x + self.image.width / 2 + 50) {
            self.x += speed;
        }

        if (currentMouseY < self.y - self.offset.y + self.image.height / 2 - 50) {
            self.y -= speed;
        } else if (currentMouseY > self.y - self.offset.y + self.image.width / 2 + 50) {
            self.y += speed;
        }

        //self
        drawPlayer(self);

        //other players
        players.forEach((player) => {
            drawPlayer(player);

            ctx.strokeStyle = "red";
            ctx.lineWidth = "5";
            ctx.beginPath();
            ctx.moveTo(player.x + player.image.width / 2 - self.offset.x, player.y + player.image.height / 2 - self.offset.y);
            ctx.lineTo(player.currentMouseX - self.offset.x, player.currentMouseY - self.offset.y);
            ctx.stroke();
            ctx.moveTo(0, 0);

            drawPlayer(player);
        });

        //message
        if (message && message.duration >= 0) {
            showMessage(message.text, message.color, message.size);
            message.duration--;
        }
    }

    function drawPlayer(player) {
        switch (player.type) {
            case "walk":
                if (player.userType == "self") { check(player, images.walk[player.level]); }
                player.image = images.walk[player.level]
                ctx.drawImage(images.walk[player.level], player.x - self.offset.x, player.y - self.offset.y);
                break;
            case "paper":
                if (player.userType == "self") { check(player, images.paper[player.level]); }
                player.image = images.paper[player.level]
                ctx.drawImage(images.paper[player.level], player.x - self.offset.x, player.y - self.offset.y);
                break;
            case "scissors":
                if (player.userType == "self") { check(player, images.scissors[player.level]); }
                player.image = images.scissors[player.level];
                ctx.drawImage(images.scissors[player.level], player.x - self.offset.x, player.y - self.offset.y);
                break;
            default:
                break;
        }

        ctx.font = "35px Arial Black";
        if (player.userType == "self") {
            ctx.fillStyle = "blue";
        } else {
            ctx.fillStyle = "red";
        }
        ctx.fillText(
            player.username,
            player.x - self.offset.x,
            player.y + player.image.height + 25 - self.offset.y
        );
    }

    function drawStars(x, y, width, height) {
        var xDiff = 50, yDiff = 50;
        ctx.fillStyle = "white";

        for (var row = y + yDiff / 2 - self.offset.y; row < height + yDiff / 2; row += yDiff) {
            for (var col = x + xDiff / 2 - self.offset.x; col < width + xDiff / 2; col += xDiff) {
                ctx.beginPath();
                ctx.arc(col, row, 5, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }

    function compare(a, b) {
        if (a == "walk" && b == "paper") { return false; }
        else if (a == "paper" && b == "scissors") { return false; }
        else if (a == "scissors" && b == "walk") { return false }
        else if (b == "walk" && a == "paper") { return true; }
        else if (b == "paper" && a == "scissors") { return true; }
        else if (b == "scissors" && a == "walk") { return true; }
        else if (a == b) { return "draw"; }
        else { return undefined; }
    }

    function showMessage(message, color, size) {
        ctx.font = size + "px Arial";
        ctx.fillStyle = color;
        ctx.fillText(message, 0, 300);
    }


    function check(user, image) {
        user.x = Math.min(
            self.gameAreaSize.width - image.width,
            user.x
        );

        user.y = Math.min(
            self.gameAreaSize.height - image.height,
            user.y
        );
    }

    function checkCollision(a, b) {
        return (a.x + a.image.width >= b.x && a.y + a.image.height >= b.y) && (a.x <= b.x + b.image.width && a.y <= b.y + b.image.width);
    }

    function checkPosition(x, y, x1, y1, width, height) {
        if (x >= x1 && x <= x1 + width && y >= y1 && y <= y1 + height) {
            return true;
        } else {
            return false;
        }
    }
}