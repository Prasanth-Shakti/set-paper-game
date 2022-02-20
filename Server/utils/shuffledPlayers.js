import { shuffledPlayers } from "../config.js";
import { assignCardToPlayers, getRoomPlayers } from "./index.js";

//Assign shuffled players
const getShuffledPlayers = function (gameID) {
  assignCardToPlayers(gameID);
  const roomplayers = getRoomPlayers(gameID);
  for (let i = roomplayers.length - 1; i > 0; i--) {
    const random = Math.floor(Math.random() * (i + 1));
    [roomplayers[i], roomplayers[random]] = [
      roomplayers[random],
      roomplayers[i],
    ];
  }
  roomplayers[0].isActive = true;
  roomplayers.forEach((player) => shuffledPlayers.push(player));
  return roomplayers;
};

//Get shuffled current player
function getCurrentPlayer(id) {
  return shuffledPlayers.find((player) => player.id === id);
}

//get shuffled players other than current player
function getOtherPlayers(id) {
  return shuffledPlayers.filter((player) => player.id !== id);
}

export { getShuffledPlayers, getCurrentPlayer, getOtherPlayers };
