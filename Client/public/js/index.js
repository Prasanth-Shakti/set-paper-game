import "core-js/stable";
import "regenerator-runtime/runtime";

const ENDPOINT = "https://set-paper-game.herokuapp.com/";
const socket = io(ENDPOINT);

import {
  createAvatar,
  recieveAvatar,
  createNames,
  recieveNames,
} from "./Pages/randomGenerator";
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
  copyGameID,
} from "./Pages/settings";
import {
  updatePlayerDetails,
  selectCard,
  endTurn,
  passToNextPlayer,
  waitPlayerResponse,
  playerLeftGame,
  cardCoursel,
  gamePlayersList,
} from "./Pages/game";
import { gamePoints } from "./Pages/results";
import { rulesList } from "./Pages/rules";
import { logWindowResize } from "./Pages/device";

window.addEventListener("resize", logWindowResize);

// ----- home page ----
//Avatar
createAvatar(socket);
recieveAvatar(socket);

//names
createNames(socket);
recieveNames(socket);

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

//copy gameID
copyGameID();

// host start game
startGame(socket);
recieveGame(socket);

//rules for all players
rulesList();
//-------- game page ----
gamePlayersList();

cardCoursel(socket);

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
