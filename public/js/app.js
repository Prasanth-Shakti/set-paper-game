const btn = document.querySelector(".page-container");
const btn2 = document.querySelector(".page-main");
const socket = io();
// btnHost.addEventListener("click", function () {
//   window.location.href = "./settings.html";
// });

btn.addEventListener("click", function (e) {
  const btnHost = e.target.closest(".btn-host");
  if (!btnHost) return;
  socket.emit("joinRoom", "new user joined");
});

btn2.addEventListener("click", function (e) {
  const btnStart = e.target.closest(".btn-start");
  if (!btnStart) return;
  if (btnStart) window.location.href = "./game.html";
});
