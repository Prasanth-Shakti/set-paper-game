import { players } from "../config.js";
let maxPlayers = 3;

//Join players to game
const playerJoin = function (
  id,
  playerName,
  cardName,
  playerImage,
  gameID,
  host = false,
  isActive = false
) {
  const player = {
    id,
    playerName,
    cardName,
    playerImage,
    gameID,
    host,
    isActive,
  };

  players.push(player);
  return player;
};

// player leaves game
function playerLeave(id) {
  const index = players.findIndex((player) => player.id === id);

  if (index !== -1) {
    return players.splice(index, 1)[0];
  }
}

function storeMaxPlayers(number) {
  maxPlayers = number;
}

function getMaxPlayers() {
  return maxPlayers;
}

export { playerJoin, playerLeave, storeMaxPlayers, getMaxPlayers };
