const { async } = require("regenerator-runtime");

const hostPlayerNameEl = document.getElementById("hostPlayerName");
const hostCardNameEl = document.getElementById("hostCardName");
const guestPlayerNameEl = document.getElementById("guestPlayerName");
const guestCardNameEl = document.getElementById("guestCardName");
const gameIDEl = document.getElementById("gameID");
const playerAvatarEl = document.querySelectorAll(".player-avatar");
const hostErrorMsgEl = document.querySelector(".host-error-message");

const btnAvatar = document.querySelectorAll(".btn-avatar");

//Avatar creation ------
const createRandomAvatar = async function () {
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
};
