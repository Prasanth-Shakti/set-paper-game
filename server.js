const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const {
  generateGameID,
  playerJoin,
  generateAvatar,
  getRoomPlayers,
  getCurrentPlayer,
  generateGameCards,
  getOtherPlayers,
  assignCardToPlayers,
  getShuffledPlayers,
} = require("./public/js/helpers");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("createRoom", ({ playerName, cardName, playerImage }) => {
    const gameID = generateGameID();
    const player = playerJoin(
      socket.id,
      playerName,
      cardName,
      playerImage,
      gameID,
      true
    );

    socket.join(player.gameID);

    socket.emit("gameCreated");
    // console.log(`Host: ${gameID}, ${playerName}, ${cardName}`);

    // send users joined the room and room info
    io.to(player.gameID).emit("roomplayers", {
      gameID: player.gameID,
      players: getRoomPlayers(player.gameID),
    });
  });
  socket.on(
    "joinRoom",
    ({ playerName, cardName, playerImage, gameID, maxPlayers }) => {
      const playersInRoom = getRoomPlayers(gameID);
      if (playersInRoom.length >= maxPlayers)
        return socket.emit("errorMessage", "Max players limit reached!!!");
      const player = playerJoin(
        socket.id,
        playerName,
        cardName,
        playerImage,
        gameID
      );

      socket.join(player.gameID);

      socket.emit("guestJoined");
      // console.log(`Guest :${gameID}, ${playerName}, ${cardName}`);

      io.to(player.gameID).emit("roomplayers", {
        gameID: player.gameID,
        players: getRoomPlayers(player.gameID),
      });
    }
  );

  socket.on("createAvatar", (url) => {
    const avatar = generateAvatar(url);
    socket.emit("avatarCreated", avatar);
  });
  socket.on("changeMaxPlayers", (num) => {
    const player = getCurrentPlayer(socket.id);
    socket.broadcast.to(player.gameID).emit("maxPlayersChanged", num);
  });

  socket.on("startGame", (nextPage) => {
    // window.location.href = nextPage;
    // currentplayer
    const currentPlayer = getCurrentPlayer(socket.id);

    // const otherPlayers = players -currentPlayer
    const otherPlayers = getOtherPlayers(socket.id);

    // assign cards to all players and shuffle
    const shuffledPlayers = getShuffledPlayers(currentPlayer.gameID);

    io.to(currentPlayer.gameID).emit("gameStarted", {
      shuffledPlayers,
      currentPlayer,
      otherPlayers,
    });
  });
});

const PORT = 3000 | process.env.PORT;

server.listen(PORT, () => console.log(`SERVER RUNNING ON ${PORT}`));
