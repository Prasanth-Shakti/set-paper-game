const numPlayers = document.querySelectorAll(".players-joined");
const playersList = document.querySelectorAll(".players");
const gameRoom = document.querySelector(".gameID-text");
const tooltipEl = document.getElementById("myTooltip");
const maxPlayersSelectEl = document.getElementById("select-max-players");
const maxPlayersEl = document.querySelector(".max-player-limit");

const homePageEl = document.querySelector(".home-page-container");
const gamePageEl = document.querySelector(".game-page-container");

const btnStart = document.getElementById("btn-start");

//Get room users
function roomplayers(socket) {
  socket.on("roomplayers", ({ gameID, players, maxPlayers }) => {
    localStorage.setItem("gameID", gameID);
    outputGameID(gameID);
    outputPlayers(players);
    outputMaxPlayers(maxPlayers);
  });
}

//maxplayers change
function changeMaxPlayers(socket) {
  maxPlayersSelectEl.addEventListener("change", function () {
    const maxPlayers = maxPlayersSelectEl.value;
    const gameID = localStorage.getItem("gameID");
    socket.emit("changeMaxPlayers", { gameID, maxPlayers });
  });
}

function recieveMaxPlayers(socket) {
  socket.on("maxPlayersChanged", function (maxPlayers) {
    outputMaxPlayers(maxPlayers);
  });
}

function copyGameID() {
  const copyBtn = document.querySelector(".copy-text");
  copyBtn.addEventListener("click", function () {
    gameRoom.select();
    gameRoom.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(gameRoom.value);
    tooltipEl.innerHTML = "Copied: " + gameRoom.value;
  });
}

//Start Game
function startGame(socket) {
  btnStart.addEventListener("click", function () {
    const gameID = localStorage.getItem("gameID");
    socket.emit("startGame", gameID);
  });
}

function recieveGame(socket) {
  socket.on("gameStarting", function () {
    homePageEl.classList.add("display-hide");
    gamePageEl.classList.remove("display-hide");
    localStorage.setItem("currentPage", "game");
    socket.emit("getPlayerDetails", socket.id);
  });
}

//output functions
function outputGameID(gameID) {
  gameRoom.value = gameID;
}
function outputMaxPlayers(maxPlayers) {
  maxPlayersEl.innerHTML = `<h4>Max Players : ${maxPlayers}</h4>`;
}

function outputPlayers(players) {
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

export {
  roomplayers,
  changeMaxPlayers,
  recieveMaxPlayers,
  startGame,
  recieveGame,
  copyGameID,
};
