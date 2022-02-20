import { pointsTable } from "../config.js";
import { getCurrentPlayer, getRoomPlayers } from "./index.js";

function addPlayerToPointsTable(user) {
  const { socketId, gameID } = user;
  const currentPlayer = getCurrentPlayer(socketId);
  const { playerName, playerImage, id } = currentPlayer;
  const points = calculatePoints(gameID);
  pointsTable.push({ id, playerName, playerImage, points, gameID });
}

function calculatePoints(gameID) {
  const roomplayers = getRoomPlayers(gameID);
  const TotalPlayers = roomplayers.length;
  //pointsTable.length = player position in points table (eg. position)
  const number = (1000 * (TotalPlayers - pointsTable.length)) / TotalPlayers;
  const points = Math.ceil(number / 100) * 100;
  return points;
}

// Get points
function getPlayerPoints(gameID) {
  const roomPlayers = getRoomPlayers(gameID, true);

  const roompointsTable = pointsTable.filter(
    (player) => player.gameID === gameID
  );

  if (roomPlayers.length === roompointsTable.length) return roompointsTable;
  else return false;
}

export { addPlayerToPointsTable, getPlayerPoints };
