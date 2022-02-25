import { getRoomPlayers, getCurrentPlayer } from "./index.js";
import { totalCards, players } from "../config.js";

const generateGameCards = function (gameID) {
  const roomplayers = getRoomPlayers(gameID);
  let playerCards = [];

  roomplayers.map((player) => {
    const multiplyCards = Array(4).fill(player.cardName);
    playerCards = [...playerCards, ...multiplyCards];
  });

  return playerCards;
};

//generate random element from total cards array
const generateRandomCardFromTotalCards = function (array) {
  const random = Math.floor(Math.random() * totalCards.length);
  const randomEl = totalCards[random];
  totalCards.splice(random, 1);

  return randomEl;
};

const assignCardToPlayers = function (gameID) {
  const cards = generateGameCards(gameID);
  cards.forEach((card) => totalCards.push(card));

  players.map(
    (player) =>
      (player.cards = [
        generateRandomCardFromTotalCards(),
        generateRandomCardFromTotalCards(),
        generateRandomCardFromTotalCards(),
        generateRandomCardFromTotalCards(),
      ])
  );
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
  return isSet1Matched || isSet2Matched;
}

function isCardsASet(checkCard, cardArray, counter) {
  cardArray.forEach((card) => {
    if (card === checkCard) return counter++;
  });
  return counter === 4 ? true : false;
}

export { assignCardToPlayers, passCardToNextPlayer, checkCardsMatched };
