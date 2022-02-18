const socket = io();

const hostPlayerNameEl = document.getElementById("hostPlayerName");
const hostCardNameEl = document.getElementById("hostCardName");
const guestPlayerNameEl = document.getElementById("guestPlayerName");
const guestCardNameEl = document.getElementById("guestCardName");
const gameIDEl = document.getElementById("gameID");
const playerAvatarEl = document.querySelectorAll(".player-avatar");

const btnHost = document.querySelector(".btn-host");
const btnJoin = document.querySelector(".btn-join");
const btnAvatar = document.querySelectorAll(".btn-avatar");
const btnStart = document.getElementById("btn-start");
const btnEnd = document.querySelector(".btn-end");
const btnHand = document.querySelector(".hand-circle");

const playerSectionEl = document.querySelector(".player-section");
const hostSettingsEl = document.querySelector(".host-settings");
const guestSettingsEl = document.querySelector(".guest-settings");
const rulesSettingsEl = document.querySelector(".rules-settings");

const hostImage = document.getElementById("host-img");
const guestImage = document.getElementById("guest-img");
const numPlayers = document.querySelectorAll(".players-joined");
const playersList = document.querySelectorAll(".players");
const gameRoom = document.querySelector(".game-room");
const maxPlayersSelectEl = document.getElementById("select-max-players");
const maxPlayersEl = document.querySelector(".max-players");

const homePageEl = document.querySelector(".home-page-container");
const gamePageEl = document.querySelector(".game-page-container");
const otherPlayersEl = document.getElementById("other-players");
const currentPlayerEl = document.querySelector(".user");
const cardListEl = document.querySelector(".card-list");
const playerMessageEl = document.querySelector(".user-info");
const handImageEl = document.querySelector(".img-hand");
const URL = "https://avataaars.io";

//Avatar creation ------
btnAvatar.forEach((element) => {
  element.addEventListener("click", function () {
    socket.emit("createAvatar", URL);
  });
});

socket.on("avatarCreated", function (url) {
  playerAvatarEl.forEach((element) => {
    element.src = url;
  });
});
//-------

//maxplayers change
maxPlayersSelectEl.addEventListener("change", function () {
  const maxPlayers = maxPlayersSelectEl.value;
  socket.emit("changeMaxPlayers", maxPlayers);
});

socket.on("maxPlayersChanged", function (num) {
  maxPlayersEl.innerHTML = `<h4>Max Players : ${num}</h4>`;
});

//Create Room------
btnHost.addEventListener("click", function () {
  const playerName = hostPlayerNameEl.value;
  const cardName = hostCardNameEl.value;
  const playerImage = hostImage.src;
  socket.emit("createRoom", { playerName, cardName, playerImage });
});

socket.on("gameCreated", function () {
  playerSectionEl.classList.add("display-hide");
  hostSettingsEl.classList.remove("display-hide");
  rulesSettingsEl.classList.remove("display-hide");
});
//------

//Join Room--------
btnJoin.addEventListener("click", function () {
  const playerName = guestPlayerNameEl.value;
  const cardName = guestCardNameEl.value;
  const gameID = gameIDEl.value;
  const playerImage = guestImage.src;
  const maxPlayers =
    +maxPlayersSelectEl.options[maxPlayersSelectEl.selectedIndex].value;
  socket.emit("joinRoom", {
    playerName,
    cardName,
    gameID,
    playerImage,
    maxPlayers,
  });
});

socket.on("guestJoined", function () {
  playerSectionEl.classList.add("display-hide");
  guestSettingsEl.classList.remove("display-hide");
  rulesSettingsEl.classList.remove("display-hide");
});

socket.on("errorMessage", function (message) {
  alert(message);
});
//--------

//Get room users
socket.on("roomplayers", ({ gameID, players }) => {
  localStorage.clear();
  localStorage.setItem("gameID", gameID);
  outputGameID(gameID);
  outputPlayers(players);
});

function outputGameID(gameID) {
  gameRoom.innerHTML = `<h2>Game ID : ${gameID}</h2>`;
}

function outputPlayers(players) {
  console.log(players);
  numPlayers.forEach((element) => {
    element.innerHTML = ` <h4>Players Joined : ${players.length}</h4>`;
  });
  playersList.forEach(
    (element) =>
      (element.innerHTML = players
        .map(
          (player) => `
      <li class="player-id">
    <img
      src=${player.playerImage}
      alt="avatar"
      width="70"
      height="70"
      class="img-avatar"
    />
    <p class="player-name">${player.playerName}</p>
    <p class="player-card">Card : ${player.cardName}</p> 
    <p class="player-isHost">${player.host ? `(Host)` : ``}</p>
  </li>`
        )
        .join(""))
  );
}

//Start Game
btnStart.addEventListener("click", function () {
  const gameID = localStorage.getItem("gameID");
  socket.emit("startGame", gameID);
});

socket.on("gameStarting", function () {
  homePageEl.classList.add("display-hide");
  gamePageEl.classList.remove("display-hide");
  socket.emit("getPlayerDetails", socket.id);
});

//update PlayerDetails
socket.on("updatePlayerDetails", function (allPlayers) {
  const { currentPlayer, otherPlayers } = allPlayers;
  console.log(currentPlayer, otherPlayers);
  outputOtherGamePlayers(otherPlayers);
  outputCurrentPlayer(currentPlayer);
  displayCurrentPlayerCards(currentPlayer);
  const sameCardsSet = currentPlayer.cards.reduce((acc, card, index, arr) => {
    if (card === arr[0] || card === arr[1]) return acc++;
    return;
  }, 0);
  // if(sameCardsSet === 4)
});

function displayCurrentPlayerCards(currentPlayer) {
  cardListEl.innerHTML = currentPlayer.cards.map(
    (element, i) => `
    <div class="card isInActiveCard" data-isactive = "${currentPlayer.isActive}">
      <p class="card-name">${element}</p>
    </div>`
  );
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
  currentPlayer.isActive
    ? btnEnd.classList.remove("display-hide")
    : btnEnd.classList.add("display-hide");
  playerMessageEl.textContent = currentPlayer.isActive
    ? "Select a card that you want to pass it to next player"
    : "Please wait for your turn";
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
      element.isActive === true ? `img-avatar isPlayer-active` : `img-avatar`
    }"
  />
  <p class="player-name">${element.playerName}</p>
</li>`
  );
}

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

btnEnd.addEventListener("click", function () {
  const cardSelected = document.querySelector(".isActiveCard");
  const cardText = cardSelected.innerText;
  const socketId = socket.id;
  const gameID = localStorage.getItem("gameID");
  socket.emit("passCard", { socketId, gameID, cardText });
});

socket.on("cardPassedSuccessfully", function () {
  socket.emit("getPlayerDetails", socket.id);
});

btnHand.addEventListener("click", function () {
  handImageEl.classList.add("hand-circle-active");
});
