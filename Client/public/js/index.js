import "core-js/stable";
import "regenerator-runtime/runtime";

const ENDPOINT = "localhost:5000";

const socket = io(ENDPOINT);

import { createAvatar, recieveAvatar } from "./Pages/avatar";
import {
  createRoom,
  gameCreated,
  joinRoom,
  guestJoined,
  joinError,
} from "./Pages/home";
import {
  roomplayers,
  changeMaxPlayers,
  recieveMaxPlayers,
  startGame,
  recieveGame,
} from "./Pages/settings";
import {
  updatePlayerDetails,
  selectCard,
  endTurn,
  passToNextPlayer,
  waitPlayerResponse,
  playerLeftGame,
} from "./Pages/game";
import { gamePoints } from "./Pages/results";

// ----- home page ----
//Avatar
createAvatar(socket);
recieveAvatar(socket);

//create room
createRoom(socket);
gameCreated(socket);

//join room
joinRoom(socket);
joinError(socket);
guestJoined(socket);

//---- settings page ----
//get room players
roomplayers(socket);

// host change max players
changeMaxPlayers(socket);
recieveMaxPlayers(socket);

// host start game
startGame(socket);
recieveGame(socket);

//-------- game page ----
//update each PlayerDetails
updatePlayerDetails(socket);

// player select card
selectCard(socket);

// end the player turn
endTurn(socket);
passToNextPlayer(socket);

// Player left the game
playerLeftGame(socket);

// waiting for other players to set the game
waitPlayerResponse(socket);

//------ results page -----
// get game points
gamePoints(socket);

// rejoin game
// rejoinGame(socket);
