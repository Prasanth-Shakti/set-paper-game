const players = [];
const shuffledPlayers = [];
let maxPlayers = 3;
const pointsTable = [];
let totalCards = [];
const {
  avatarStyle,
  topTypeArray,
  accessoriesTypeArray,
  hairColorArray,
  clotheColorArray,
  clotheTypeArray,
  eyeTypeArray,
  eyebrowTypeArray,
  facialHairColorArray,
  facialHairTypeArray,
  graphicTypeArray,
  hatColorArray,
  skinColorArray,
  mouthTypeArray,
} = require("./avatarOptions");

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
  // console.log(players);
  return player;
};

// player leaves game
function playerLeave(id) {
  const index = players.findIndex((player) => player.id === id);

  if (index !== -1) {
    return players.splice(index, 1)[0];
  }
}

// Get room players
function getRoomPlayers(gameID, shuffled = false) {
  if (!shuffled) return players.filter((player) => player.gameID === gameID);
  return shuffledPlayers.filter((player) => player.gameID === gameID);
}
//shuffled players
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

function passCardToNextPlayer(cardDetails) {
  const { socketId, gameID, cardText } = cardDetails;
  const roomPlayers = getRoomPlayers(gameID, true);
  roomPlayers.map((player, index, arr) => {
    if (player.id === socketId) {
      player.isActive = false;
      const cardIndex = player.cards.findIndex((card) => card === cardText);
      player.cards.splice(cardIndex, 1);
      const nextPlayer = arr[index + 1] ? arr[index + 1] : arr[0];
      nextPlayer.isActive = true;
      nextPlayer.cards.push(cardText);
      // console.log(`--------- player : ${nextPlayer.playerName}`, nextPlayer);
      return player;
    }
  });
  return roomPlayers;
}

function checkCardsMatched(id) {
  const currentPlayer = getCurrentPlayer(id);
  const card1 = currentPlayer.cards[0];
  const card2 = currentPlayer.cards[1];
  const counter = 0;
  const isSet1Matched = isCardsASet(card1, currentPlayer.cards, counter);
  const isSet2Matched = isCardsASet(card2, currentPlayer.cards, counter);
  // console.log(isSet1Matched, isSet2Matched);
  return isSet1Matched || isSet2Matched;
}

function isCardsASet(checkCard, cardArray, counter) {
  cardArray.forEach((card) => {
    if (card === checkCard) return counter++;
  });
  return counter === 4 ? true : false;
}

//Get current player
function getCurrentPlayer(id) {
  return shuffledPlayers.find((player) => player.id === id);
}

function getOtherPlayers(id) {
  return shuffledPlayers.filter((player) => player.id !== id);
}

const generateGameCards = function (gameID) {
  const roomplayers = getRoomPlayers(gameID);
  let playerCards = [];

  roomplayers.map((player) => {
    const multiplyCards = Array(4).fill(player.cardName);
    playerCards = [...playerCards, ...multiplyCards];
  });

  return playerCards;
};

const assignCardToPlayers = function (gameID) {
  totalCards = generateGameCards(gameID);

  players.map(
    (player) =>
      (player.cards = [
        generateRandomElementFromArray(),
        generateRandomElementFromArray(),
        generateRandomElementFromArray(),
        generateRandomElementFromArray(),
      ])
  );
};

const generateRandomElementFromArray = function () {
  const random = Math.floor(Math.random() * totalCards.length);
  const randomEl = totalCards[random];
  totalCards.splice(random, 1);

  return randomEl;
};

const generateGameID = function () {
  const id1 = generateRandomNumber();
  const id2 = generateRandomNumber();
  return `${id1}-${id2}`;
};

const generateRandomNumber = function () {
  return Math.floor(1000 + Math.random() * 9000);
};

const generateAvatar = function (url) {
  const topType = generateRandomAvatarPiece(topTypeArray);
  const accessoriesType = generateRandomAvatarPiece(accessoriesTypeArray);
  const hairColor = generateRandomAvatarPiece(hairColorArray);
  const clotheColor = generateRandomAvatarPiece(clotheColorArray);
  const clotheType = generateRandomAvatarPiece(clotheTypeArray);
  const eyeType = generateRandomAvatarPiece(eyeTypeArray);
  const eyebrowType = generateRandomAvatarPiece(eyebrowTypeArray);
  const facialHairColor = generateRandomAvatarPiece(facialHairColorArray);
  let facialHairType = generateRandomAvatarPiece(facialHairTypeArray);
  const graphicType = generateRandomAvatarPiece(graphicTypeArray);
  const mouthType = generateRandomAvatarPiece(mouthTypeArray);
  const hatColor = generateRandomAvatarPiece(hatColorArray);
  const skinColor = generateRandomAvatarPiece(skinColorArray);
  if (topType.includes("LongHair")) {
    facialHairType = facialHairTypeArray[0];
  }
  const avatar = `${url}/?avatarStyle=${avatarStyle}&topType=${topType}&accessoriesType=${accessoriesType}&hatColor=${hatColor}&hairColor=${hairColor}&graphicType=${graphicType}&facialHairType=${facialHairType}&facialHairColor=${facialHairColor}&clotheType=${clotheType}&clotheColor=${clotheColor}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&mouthType=${mouthType}&skinColor=${skinColor}`;
  return avatar;
};

const generateRandomAvatarPiece = function (array) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
};

function addPlayerToPointsTable(user) {
  const { socketId, gameID } = user;
  const currentPlayer = getCurrentPlayer(socketId);
  const { playerName, playerImage, id } = currentPlayer;
  const points = calculatePoints(gameID);
  pointsTable.push({ id, playerName, playerImage, points, gameID });
  // console.log(pointsTable);
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
  console.log(roomPlayers.length);
  const roompointsTable = pointsTable.filter(
    (player) => player.gameID === gameID
  );

  console.log(roompointsTable.length);
  console.log(roompointsTable);
  if (roomPlayers.length === roompointsTable.length) return roompointsTable;
  else return false;
}

function storeMaxPlayers(number) {
  maxPlayers = number;
}

function getMaxPlayers() {
  return maxPlayers;
}

module.exports = {
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
  passCardToNextPlayer,
  checkCardsMatched,
  addPlayerToPointsTable,
  getPlayerPoints,
  storeMaxPlayers,
  getMaxPlayers,
};
