const btnAvatar = document.querySelectorAll(".btn-avatar");
const playerAvatarEl = document.querySelectorAll(".player-avatar");

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

export { createAvatar, recieveAvatar };
