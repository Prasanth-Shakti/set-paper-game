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
  playerLeave,
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
  // socket.on("changeMaxPlayers", (num) => {
  //   const player = getCurrentPlayer(socket.id);
  //   socket.broadcast.to(player.gameID).emit("maxPlayersChanged", num);
  // });

  socket.on("startGame", (gameID) => {
    const shuffledPlayers = getShuffledPlayers(gameID);
    console.log(shuffledPlayers);
    io.to(gameID).emit("gameStarting");
  });

  socket.on("getPlayerDetails", (id) => {
    // currentplayer
    const currentPlayer = getCurrentPlayer(id);
    // const otherPlayers = players -currentPlayer
    const otherPlayers = getOtherPlayers(id);
    // assign cards to all players and shuffle

    socket.emit("playerdetails", {
      currentPlayer,
      otherPlayers,
    });
  });

  socket.on("passCard", (cardDetails) => {
    const { socketId, gameID, cardText } = cardDetails;
    console.log(socketId, gameID, cardText);
  });

  //Runs when client disconnects
  socket.on("disconnect", () => {
    const player = playerLeave(socket.id);
    if (player) {
      // io.to(player.gameID).emit(
      //   "message",
      //   formatMessage(botName, `${player.username} has left the chat`)
      // );
      // send users joined the room and room info
      io.to(player.gameID).emit("gameRoomPlayers", {
        gameID: player.gameID,
        players: getRoomPlayers(player.gameID),
      });
    }
  });
});

const PORT = 3000 | process.env.PORT;

server.listen(PORT, () => console.log(`SERVER RUNNING ON ${PORT}`));
