import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";

import {
  generateGameID,
  playerJoin,
  generateAvatar,
  generatePlayerName,
  generateCardName,
  getRoomPlayers,
  getCurrentPlayer,
  getActivePlayer,
  getShuffledPlayers,
  playerLeave,
  passCardToNextPlayer,
  checkCardsMatched,
  addPlayerToPointsTable,
  getPlayerPoints,
  storeMaxPlayers,
  getMaxPlayers,
  checkPlayerAndCardexist,
} from "./utils/index.js";
import { shuffledPlayers, players, totalCards, pointsTable } from "./config.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:1234",
  },
});
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ response: "Server is up and running." }).status(200);
});

// app.use(cors());
app.use(router);

io.on("connection", (socket) => {
  console.log("new connection....");
  socket.on(
    "createRoom",
    ({ playerName, cardName, playerImage, maxPlayers = 3 }) => {
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

      socket.emit("gameCreated", gameID);

      storeMaxPlayers(maxPlayers);

      // send users joined the room and room info
      io.to(player.gameID).emit("roomplayers", {
        gameID: player.gameID,
        players: getRoomPlayers(player.gameID),
        maxPlayers,
      });
    }
  );
  socket.on("joinRoom", (playerDetails) => {
    const { playerName, cardName, playerImage, gameID } = playerDetails;
    const playersInRoom = getRoomPlayers(gameID);
    const isplayerDetailsExist = checkPlayerAndCardexist(playerDetails);
    const maxPlayers = getMaxPlayers();
    if (playersInRoom.length >= maxPlayers)
      return socket.emit("joinErrorMessage", "Max players limit reached!!!");
    if (shuffledPlayers.length > 0)
      return socket.emit(
        "joinErrorMessage",
        "There is already a game running!! Please try again after some time."
      );
    if (isplayerDetailsExist)
      return socket.emit(
        "joinErrorMessage",
        "Player name or card name already taken in the game!!!"
      );
    const player = playerJoin(
      socket.id,
      playerName,
      cardName,
      playerImage,
      gameID
    );

    socket.join(player.gameID);

    socket.emit("guestJoined");

    io.to(player.gameID).emit("roomplayers", {
      gameID: player.gameID,
      players: getRoomPlayers(player.gameID),
      maxPlayers,
    });
  });

  socket.on("createAvatar", () => {
    const avatar = generateAvatar();
    socket.emit("avatarCreated", avatar);
  });

  socket.on("getRandomNames", () => {
    const playerName = generatePlayerName();
    const cardName = generateCardName();
    socket.emit("randomNamesCreated", { playerName, cardName });
  });

  socket.on("changeMaxPlayers", (data) => {
    const { gameID, maxPlayers } = data;
    storeMaxPlayers(maxPlayers);
    socket.broadcast.to(gameID).emit("maxPlayersChanged", maxPlayers);
  });

  socket.on("startGame", (gameID) => {
    // assign cards to all players and shuffle
    getShuffledPlayers(gameID);

    io.to(gameID).emit("gameStarting");
  });

  socket.on("getPlayerDetails", (id) => {
    // currentplayer
    const currentPlayer = getCurrentPlayer(id);
    const activePlayer = getActivePlayer();
    const cardsMatched = checkCardsMatched(id);

    socket.emit("updatePlayerDetails", {
      currentPlayer,
      shuffledPlayers,
      activePlayer,
      cardsMatched,
    });
  });

  socket.on("passCard", (cardDetails) => {
    const { gameID } = cardDetails;
    passCardToNextPlayer(cardDetails);
    io.to(gameID).emit("cardPassedSuccessfully");
  });

  socket.on("finishGame", (finishPlayer) => {
    const { socketId, gameID } = finishPlayer;
    const finishedPlayer = getCurrentPlayer(socketId);
    addPlayerToPointsTable(finishPlayer);
    socket.broadcast.to(gameID).emit("waitingPlayerResponse", finishedPlayer);
  });

  socket.on("completed", (player) => {
    const { gameID } = player;
    addPlayerToPointsTable(player);
    const pointsTable = getPlayerPoints(gameID);
    if (pointsTable) io.to(gameID).emit("gamePoints", pointsTable);
  });

  //Runs when client disconnects
  socket.on("disconnect", () => {
    const player = playerLeave(socket.id);
    if (player) {
      const maxPlayers = getMaxPlayers();
      // sends the player list to setting page
      io.to(player.gameID).emit("roomplayers", {
        gameID: player.gameID,
        players: getRoomPlayers(player.gameID),
        maxPlayers,
      });
      if (shuffledPlayers.length > 0) {
        const leftPlayer = getCurrentPlayer(socket.id);
        // sends the player list to game page
        io.to(player.gameID).emit("playerLeft", leftPlayer);
        shuffledPlayers.length = 0;
        players.length = 0;
        pointsTable.length = 0;
        totalCards.length = 0;
      }
    }
  });
});

const PORT = 5000 | process.env.PORT;

httpServer.listen(PORT, () => console.log(`SERVER RUNNING ON ${PORT}`));
