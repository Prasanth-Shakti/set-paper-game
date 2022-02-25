import { players, shuffledPlayers } from "../config.js";

// Get room players
function getRoomPlayers(gameID, shuffled = false) {
  if (!shuffled) return players.filter((player) => player.gameID === gameID);
  return shuffledPlayers.filter((player) => player.gameID === gameID);
}

const generateRandomElementFromArray = function (array) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
};
export { generateRandomElementFromArray, getRoomPlayers };
