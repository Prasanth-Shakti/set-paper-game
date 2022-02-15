const players = [];
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
  host = false
) {
  const player = { id, playerName, cardName, playerImage, gameID, host };

  players.push(player);
  // console.log(players);
  return player;
};

// Get room players
function getRoomPlayers(gameID) {
  return players.filter((player) => player.gameID === gameID);
}

//Get current player
function getCurrentPlayer(id) {
  return players.find((player) => player.id === id);
}

function getOtherPlayers(id) {
  return players.filter((player) => player.id !== id);
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
  return roomplayers;
};

const generateGameID = function () {
  const id1 = generateRandomNumber();
  const id2 = generateRandomNumber();
  return `${id1}-${id2}`;
};

const generateRandomNumber = function () {
  return Math.floor(1000 + Math.random() * 1000);
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
  const facialHairType = generateRandomAvatarPiece(facialHairTypeArray);
  const graphicType = generateRandomAvatarPiece(graphicTypeArray);
  const mouthType = generateRandomAvatarPiece(mouthTypeArray);
  const hatColor = generateRandomAvatarPiece(hatColorArray);
  const skinColor = generateRandomAvatarPiece(skinColorArray);
  const avatar = `${url}/?avatarStyle=${avatarStyle}&topType=${topType}&accessoriesType=${accessoriesType}&hatColor=${hatColor}&hairColor=${hairColor}&graphicType=${graphicType}&facialHairType=${facialHairType}&facialHairColor=${facialHairColor}&clotheType=${clotheType}&clotheColor=${clotheColor}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&mouthType=${mouthType}&skinColor=${skinColor}`;
  return avatar;
};

const generateRandomAvatarPiece = function (array) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
};

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
};
