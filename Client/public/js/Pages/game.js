const otherPlayersEl = document.getElementById("other-players");
const currentPlayerEl = document.querySelector(".user");
const cardListEl = document.querySelector(".card-list");
const playerMessageEl = document.querySelector(".user-info");
const handImageEl = document.querySelector(".img-hand");

const btnEnd = document.querySelector(".btn-end");
const btnHand = document.querySelector(".hand-circle");

//
function updatePlayerDetails(socket) {
  const serverSocket = socket;
  serverSocket.on("updatePlayerDetails", function (allPlayers) {
    const { currentPlayer, otherPlayers, cardsMatched } = allPlayers;
    outputOtherGamePlayers(otherPlayers);
    outputCurrentPlayer(currentPlayer);
    cardsMatched
      ? outputFinishGame(currentPlayer, serverSocket)
      : displayCurrentPlayerCards(currentPlayer);
  });
}

function selectCard() {
  cardListEl.addEventListener("click", function (e) {
    const card = e.target.closest(".card");
    if (!card) return;
    const isCardSelected = document.querySelector(".isActiveCard");
    if (
      card.dataset.isactive === "true" &&
      (isCardSelected === null
        ? true
        : false || card.classList.value === isCardSelected?.classList.value)
    ) {
      card.classList.toggle("isInActiveCard");
      card.classList.toggle("isActiveCard");
    }
  });
}

function endTurn(socket) {
  btnEnd.addEventListener("click", function () {
    const cardSelected = document.querySelector(".isActiveCard");
    const cardText = cardSelected.innerText;
    const socketId = socket.id;
    const gameID = localStorage.getItem("gameID");
    socket.emit("passCard", { socketId, gameID, cardText });
  });
}

function passToNextPlayer(socket) {
  socket.on("cardPassedSuccessfully", function () {
    socket.emit("getPlayerDetails", socket.id);
  });
}

function waitPlayerResponse(socket) {
  const serverSocket = socket;
  socket.on("waitingPlayerResponse", function (finishedPlayer) {
    outputFinishGame(finishedPlayer, serverSocket);
  });
}

function playerLeftGame(socket) {
  socket.on("playerLeft", function (player) {
    cardListEl.innerHTML = `<h2 class="game-finish-message"> ${player.playerName} has left the game!! Please restart the game again. </h2>`;
    playerMessageEl.textContent = "";
    btnEnd.classList.add("display-hide");
    localStorage.clear();
  });
}

//output functions

function outputFinishGame(player, socket) {
  const gameID = localStorage.getItem("gameID");
  const socketId = socket.id;
  if (player.id === socketId)
    cardListEl.innerHTML = `<h2 class="game-finish-message"> Your Cards Matched!! Finish the game by pressing set button </h2>`;
  else
    cardListEl.innerHTML = `<h2 class="game-finish-message"> ${player.playerName} has set the game!! Pressing set button fast to get more points. </h2>`;
  playerMessageEl.textContent = "";

  btnHand.addEventListener("click", function () {
    handImageEl.classList.add("hand-circle-active");
    if (player.id === socketId) socket.emit("finishGame", { socketId, gameID });
    else socket.emit("completed", { socketId, gameID });
    cardListEl.innerHTML = `<h2 class="game-finish-message"> Waiting for the other players to finish. </h2>`;
  });
}

function outputCurrentPlayer(currentPlayer) {
  currentPlayerEl.innerHTML = `
      <img
      src=${currentPlayer.playerImage}
      alt="avatar"
      width="70"
      height="70"
      class ="${
        currentPlayer.isActive === true
          ? `img-avatar isPlayer-active`
          : `img-avatar`
      }"
    />
    <p class="user-name">${currentPlayer.playerName}</p>`;
}

function outputOtherGamePlayers(otherPlayers) {
  otherPlayersEl.innerHTML = otherPlayers.map(
    (element) => ` 
      <li class="player-id">
      <img
        src=${element.playerImage}
        alt="avatar"
        width="70"
        height="70"
        class ="${
          element.isActive === true
            ? `img-avatar isPlayer-active`
            : `img-avatar`
        }"
      />
      <p class="player-name">${element.playerName}</p>
    </li>`
  );
}

function displayCurrentPlayerCards(currentPlayer) {
  cardListEl.innerHTML = currentPlayer.cards.map(
    (element, i) => `
      <div class="card isInActiveCard" data-isactive = "${currentPlayer.isActive}">
        <p class="card-name">${element}</p>
      </div>`
  );
  currentPlayer.isActive
    ? btnEnd.classList.remove("display-hide")
    : btnEnd.classList.add("display-hide");
  playerMessageEl.textContent = currentPlayer.isActive
    ? "Select a card that you want to pass it to next player"
    : "Please wait for your turn";
}

export {
  updatePlayerDetails,
  selectCard,
  endTurn,
  passToNextPlayer,
  waitPlayerResponse,
  playerLeftGame,
};
