import {
  generateAvatar,
  generatePlayerName,
  generateCardName,
} from "./randomGenerator.js";
import { generateRandomElementFromArray, getRoomPlayers } from "./common.js";
import { generateGameID } from "./gameID.js";
import {
  assignCardToPlayers,
  passCardToNextPlayer,
  checkCardsMatched,
} from "./playerCards.js";
import {
  playerJoin,
  playerLeave,
  storeMaxPlayers,
  getMaxPlayers,
  checkPlayerAndCardexist,
} from "./players.js";
import { addPlayerToPointsTable, getPlayerPoints } from "./pointsTable.js";
import {
  getShuffledPlayers,
  getCurrentPlayer,
  getActivePlayer,
} from "./shuffledPlayers.js";

export {
  generateAvatar,
  generateRandomElementFromArray,
  getRoomPlayers,
  generateGameID,
  assignCardToPlayers,
  passCardToNextPlayer,
  checkCardsMatched,
  playerJoin,
  playerLeave,
  storeMaxPlayers,
  getMaxPlayers,
  addPlayerToPointsTable,
  getPlayerPoints,
  getShuffledPlayers,
  getCurrentPlayer,
  getActivePlayer,
  checkPlayerAndCardexist,
  generatePlayerName,
  generateCardName,
};
