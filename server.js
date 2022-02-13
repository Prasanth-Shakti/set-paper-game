const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("joinRoom", (message) => {
    console.log(message);
  });
});

const PORT = 3000 | process.env.PORT;

// app.listen(PORT, () => console.log(`SERVER RUNNING ON ${PORT}`));
server.listen(PORT, () => console.log(`SERVER RUNNING ON ${PORT}`));
