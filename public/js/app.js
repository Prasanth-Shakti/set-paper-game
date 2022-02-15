const socket = io();

// const btnReJoin = document.querySelector(".btn-rejoin");
// btnReJoin.addEventListener("click", function (e) {
//   window.location.href = "./index.html";
// });

const playerInput = document.getElementById("name");
const cardInput = document.getElementById("cardName");
const guestPlayerInput = document.getElementById("guest-name");
const guestCardInput = document.getElementById("guest-cardName");
const guestGameIDInput = document.getElementById("guest-gameID");
const btnHost = document.querySelector(".btn-host");
const btnJoin = document.querySelector(".btn-join");
const playGame = document.querySelectorAll(".play-game");
const settingsDisplay = document.querySelectorAll(".settings-section-display");
const guestSettings = document.querySelector(".guest-settings");
const btnAvatar = document.querySelectorAll(".btn-avatar");
const imageAvatar = document.querySelectorAll(".player-avatar");
const hostImage = document.getElementById("host-img");
const guestImage = document.getElementById("guest-img");
const numPlayers = document.querySelectorAll(".players-joined");
const playersList = document.querySelectorAll(".players");
const gameRoom = document.querySelector(".game-room");
const maxPlayersSelectEl = document.getElementById("select-max-players");
const maxPlayersEl = document.querySelector(".max-players");
const btnStart = document.getElementById("btn-start");
const otherPlayersEl = document.getElementById("other-players");
const currentPlayerEl = document.querySelector(".user");
const cardListEl = document.querySelector(".card-list");
const URL = "https://avataaars.io";

if (!window.location.href.includes("game")) {
  //Create Room------
  btnHost.addEventListener("click", function () {
    const playerName = playerInput.value;
    const cardName = cardInput.value;
    const playerImage = hostImage.src;
    socket.emit("createRoom", { playerName, cardName, playerImage });
  });

  socket.on("gameCreated", function () {
    playGame.forEach((query) => {
      return (query.style.display = "none");
    });
    settingsDisplay.forEach((element) => {
      element.innerHTML.includes("host-settings")
        ? (element.style.display = "flex")
        : "";
    });
  });
  //------

  //Join Room--------
  btnJoin.addEventListener("click", function () {
    const playerName = guestPlayerInput.value;
    const cardName = guestCardInput.value;
    const gameID = guestGameIDInput.value;
    const playerImage = guestImage.src;
    const maxPlayers = +maxPlayersSelectEl.selectedOptions[0].value;
    socket.emit("joinRoom", {
      playerName,
      cardName,
      gameID,
      playerImage,
      maxPlayers,
    });
  });

  socket.on("guestJoined", function () {
    playGame.forEach((query) => {
      return (query.style.display = "none");
    });
    settingsDisplay.forEach((element) => {
      element.innerHTML.includes("guest-settings")
        ? (element.style.display = "flex")
        : "";
    });
  });

  socket.on("errorMessage", function (message) {
    alert(message);
  });
  //--------

  //Avatar creation ------
  btnAvatar.forEach((element) => {
    element.addEventListener("click", function () {
      socket.emit("createAvatar", URL);
    });
  });

  socket.on("avatarCreated", function (url) {
    imageAvatar.forEach((element) => {
      element.src = url;
    });
  });
  //-------
  //Get room users
  socket.on("roomplayers", ({ gameID, players }) => {
    outputGameID(gameID);
    outputPlayers(players);
  });

  function outputGameID(gameID) {
    gameRoom.innerHTML = `<h3>Game ID : ${gameID}</h3>`;
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

  //maxplayers change
  maxPlayersSelectEl.addEventListener("change", function () {
    const maxPlayers = maxPlayersSelectEl.value;
    socket.emit("changeMaxPlayers", maxPlayers);
  });

  socket.on("maxPlayersChanged", function (num) {
    maxPlayersEl.innerHTML = `<h4>Max Players : ${num}</h4>`;
  });

  //Start Game
  btnStart.addEventListener("click", function () {
    const nextPage = "./game.html";
    socket.emit("startGame", nextPage);
  });
}

socket.on("gameStarted", function (allPlayers) {
  const { players, currentPlayer, otherPlayers } = allPlayers;
  console.log(currentPlayer, otherPlayers);
  otherPlayersEl.innerHTML = otherPlayers.map(
    (element) => ` 
  <li class="player-id">
  <img
    src=${element.playerImage}
    alt="avatar"
    width="70"
    height="70"
    class="img-avatar"
  />
  <p class="player-name">${element.playerName}</p>
</li>`
  );
  currentPlayerEl.innerHTML = `
  <img
  src=${currentPlayer.playerImage}
  alt="avatar"
  width="70"
  height="70"
  class="img-avatar"
/>
<p class="user-name">${currentPlayer.playerName}</p>`;
  cardListEl.innerHTML = currentPlayer.cards.map(
    (element) => `
  <div class="card card--active">
  <div class="row-box">
    <div class="box"></div>
    <div class="box"></div>
  </div>
  <p class="card-name">${element}</p>
  <div class="row-box">
    <div class="box1"></div>
    <div class="box1"></div>
  </div>
</div>`
  );
});
