var express = require("express"),
    app = express(),
    http = require("http").Server(app),
    io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));

//
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

var users = {
        "*": "#000000"  // server user
    },
    COLORS = [
        "#1abc9c",  // turquoise
        "#2ecc71",  // emerald
        "#3498db",  // peter river
        "#9b59b6",  // amethyst
        "#34495e",  // wet asphalt
        "#f1c40f",  // sun flower
        "#e67e22",  // carrot
        "#e74c3c",  // alizarin
        "#ecf0f1",  // clouds
        "#95a5a6",  // concrete
    ];

//
io.sockets.on("connection", function(socket) {

    users[socket.id] = COLORS[Math.floor(Math.random() * COLORS.length)];

    // init
    socket.emit("new message", {
        author: users["*"],
        body: "Welcome to El Café"
    });
    socket.emit("welcome", users[socket.id]);
    io.emit("user count", Object.keys(users).length);

    // disconnect
    socket.on("disconnect", function() {
        delete users[socket.id];
        io.emit("user count", Object.keys(users).length);
    });

    // new message
    socket.on("new message", function(data) {
        socket.broadcast.emit("new message", {
            author: users[socket.id],
            body: data
        });
    });
});

//
http.listen(3000, function() {
    console.log("listening on *:3000");
});
