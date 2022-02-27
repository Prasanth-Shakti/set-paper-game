const btnHost = document.querySelector(".btn-host");
const btnJoin = document.querySelector(".btn-join");

const playerSectionEl = document.querySelector(".player-section");
const hostSettingsEl = document.querySelector(".host-settings");
const guestSettingsEl = document.querySelector(".guest-settings");
const rulesSettingsEl = document.querySelector(".rules-settings");

const hostPlayerNameEl = document.getElementById("hostPlayerName");
const hostCardNameEl = document.getElementById("hostCardName");
const guestPlayerNameEl = document.getElementById("guestPlayerName");
const guestCardNameEl = document.getElementById("guestCardName");
const gameIDEl = document.getElementById("gameID");

const hostImage = document.getElementById("host-img");
const guestImage = document.getElementById("guest-img");
const hostErrorMsgEl = document.querySelector(".host-error-message");
const guestErrorMsgEl = document.querySelector(".guest-error-message");

//Create Room------
function createRoom(socket) {
  btnHost.addEventListener("click", function () {
    const playerName = hostPlayerNameEl.value;
    const cardName = hostCardNameEl.value;
    const playerImage = hostImage.src;
    if (playerName !== "" || cardName !== "") {
      hostErrorMsgEl.classList.remove("display-hide");
      socket.emit("createRoom", { playerName, cardName, playerImage });
    } else {
      hostErrorMsgEl.classList.remove("display-hide");
      hostErrorMsgEl.innerText = "Player name and Card name is mandatory";
    }
  });
}

function gameCreated(socket) {
  socket.on("gameCreated", function () {
    playerSectionEl.classList.add("display-hide");
    hostSettingsEl.classList.remove("display-hide");
    rulesSettingsEl.classList.remove("display-hide");
  });
}

//------

//Join Room--------
function joinRoom(socket) {
  btnJoin.addEventListener("click", function () {
    const playerName = guestPlayerNameEl.value;
    const cardName = guestCardNameEl.value;
    const gameID = gameIDEl.value;
    const playerImage = guestImage.src;
    if (playerName !== "" || cardName !== "") {
      guestErrorMsgEl.classList.remove("display-hide");
      socket.emit("joinRoom", {
        playerName,
        cardName,
        gameID,
        playerImage,
      });
    } else {
      guestErrorMsgEl.classList.remove("display-hide");
      guestErrorMsgEl.innerText =
        "GameID, Player name and Card name is mandatory";
    }
  });
}

function guestJoined(socket) {
  socket.on("guestJoined", function () {
    playerSectionEl.classList.add("display-hide");
    guestSettingsEl.classList.remove("display-hide");
    rulesSettingsEl.classList.remove("display-hide");
  });
}

function joinError(socket) {
  socket.on("joinErrorMessage", function (message) {
    guestErrorMsgEl.innerHTML = message;
  });
}

export { createRoom, gameCreated, joinRoom, guestJoined, joinError };
