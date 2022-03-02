const currentPlayerEl = document.querySelector(".user");
const cardListEl = document.querySelector(".card-list");
const playerMessageEl = document.querySelector(".user-info");
const handImageEl = document.querySelector(".img-hand");
const btnLeft = document.querySelector(".left-btn");
const btnRight = document.querySelector(".right-btn");
const btnEnd = document.querySelector(".btn-end");
const btnHand = document.querySelector(".hand-circle");
const btnPlayerList = document.querySelector(".btn-player-list");
const sideBarEl = document.getElementById("mySidenav");
const playingOrderEl = document.querySelector(".order-list");
const activePlayerEl = document.querySelector(".active-player");
const cardCountEl = document.querySelector(".card-count");
const arrowBtnContainer = document.querySelector(".arrows");

function updatePlayerDetails(socket) {
  const serverSocket = socket;
  serverSocket.on("updatePlayerDetails", function (allPlayers) {
    const { currentPlayer, shuffledPlayers, activePlayer, cardsMatched } =
      allPlayers;
    outputShuffledPlayers(shuffledPlayers);
    outputCurrentPlayer(currentPlayer);
    outputActivePlayer(currentPlayer, activePlayer);
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

function cardCoursel() {
  let currSlide = 0;
  let maxCards = 4;
  observer = new MutationObserver(function (mutationsList, observer) {
    console.log(mutationsList);
    maxCards = mutationsList[0].addedNodes.length;
    if (currSlide === maxCards) {
      currSlide--;
      cardListEl.style.transform = `translateX(${-200 * currSlide}px)`;
    }
    cardCountEl.innerHTML = `${currSlide + 1}/${maxCards}`;
  });
  observer.observe(cardListEl, {
    childList: true,
  });

  btnRight.addEventListener("click", function () {
    if (currSlide < maxCards - 1) {
      currSlide++;
    }
    cardCountEl.innerHTML = `${currSlide + 1}/${maxCards}`;
    currSlide === maxCards - 1
      ? (btnRight.style.backgroundColor = "#cacaca")
      : "";
    btnLeft.style.backgroundColor = "#3bc18d";
    cardListEl.style.transform = `translateX(${-200 * currSlide}px)`;
    console.log(cardListEl.style.transform);
  });
  btnLeft.addEventListener("click", function () {
    if (currSlide > 0) {
      currSlide--;
    }
    cardCountEl.innerHTML = `${currSlide + 1}/${maxCards}`;
    currSlide === 0 ? (btnLeft.style.backgroundColor = "#cacaca") : "";
    btnRight.style.backgroundColor = "#3bc18d";
    cardListEl.style.transform = `translateX(${-200 * currSlide}px)`;
    console.log(cardListEl.style.transform);
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
    cardListEl.innerHTML = `<h2 class="game-finish-message"> ${player.playerName} has left the game!! Game is restarting..... </h2>`;
    playerMessageEl.textContent = "";
    btnEnd.classList.add("display-hide");
    localStorage.clear();
    setTimeout(function () {
      location.reload();
    }, 3000);
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
  cardListEl.style.transform = `translateX(0px)`;
  arrowBtnContainer.style.display = "none";

  btnHand.addEventListener("click", function () {
    console.log("hand clicked");
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
          ? `game-avatar isPlayer-active`
          : `game-avatar`
      }"
    />
    <p class="user-name">${currentPlayer.playerName}</p>`;
}

function outputActivePlayer(currentPlayer, activePlayer) {
  if (currentPlayer.id === activePlayer.id)
    activePlayerEl.innerHTML = `<h2 class="game-finish-message"> Your are playing...`;
  else
    activePlayerEl.innerHTML = `
      <img
      src=${activePlayer.playerImage}
      alt="avatar"
      width="70"
      height="70"
      class ="${
        activePlayer.isActive === true
          ? `game-avatar isPlayer-active`
          : `game-avatar`
      }"
    />
    <p class="user-name">${activePlayer.playerName} is playing ...</p>`;
}

function outputShuffledPlayers(shuffledPlayers) {
  playingOrderEl.innerHTML = shuffledPlayers
    .map(
      (element) => `
    <p class="player-order">${element.playerName}</p>
     `
    )
    .join("");
}

function displayCurrentPlayerCards(currentPlayer) {
  cardListEl.innerHTML = currentPlayer.cards
    .map((element) => {
      return `<div class="card isInActiveCard" data-isactive = "${currentPlayer.isActive}">
      <p class="card-name">${element}</p>
    </div>`;
    })
    .join("");
  currentPlayer.isActive
    ? btnEnd.classList.remove("display-hide")
    : btnEnd.classList.add("display-hide");
  playerMessageEl.textContent = currentPlayer.isActive
    ? "Select a card that you want to pass it to next player"
    : "Please wait for your turn";
}

function gamePlayersList() {
  btnPlayerList.addEventListener("click", function () {
    if (sideBarEl.style.width === "250px") sideBarEl.style.width = "0px";
    else sideBarEl.style.width = "250px";
  });
}

export {
  updatePlayerDetails,
  selectCard,
  endTurn,
  passToNextPlayer,
  waitPlayerResponse,
  playerLeftGame,
  cardCoursel,
  gamePlayersList,
};
