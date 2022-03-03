const btnAvatar = document.querySelectorAll(".btn-avatar");
const playerAvatarEl = document.querySelectorAll(".player-avatar");
const btnRandomEl = document.querySelectorAll(".btn-random");
const hostPlayerNameEl = document.getElementById("hostPlayerName");
const hostCardNameEl = document.getElementById("hostCardName");
const guestPlayerNameEl = document.getElementById("guestPlayerName");
const guestCardNameEl = document.getElementById("guestCardName");

function createAvatar(socket) {
  btnAvatar.forEach((element) => {
    element.addEventListener("click", function () {
      socket.emit("createAvatar");
    });
  });
}

function recieveAvatar(socket) {
  socket.on("avatarCreated", function (url) {
    playerAvatarEl.forEach((element) => {
      element.src = url;
    });
  });
}

function createNames(socket) {
  btnRandomEl.forEach((element) => {
    element.addEventListener("click", function () {
      socket.emit("getRandomNames");
    });
  });
}

function recieveNames(socket) {
  socket.on("randomNamesCreated", function (names) {
    const { playerName, cardName } = names;
    hostPlayerNameEl.value = playerName;
    hostCardNameEl.value = cardName;
    guestPlayerNameEl.value = playerName;
    guestCardNameEl.value = cardName;
  });
}

export { createAvatar, recieveAvatar, createNames, recieveNames };
