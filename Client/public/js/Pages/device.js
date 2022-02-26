const playerEl = document.querySelector(".player-section");
const deviceMessageEl = document.querySelector(".device-message");
const hostSettingsEl = document.querySelector(".host-settings");
const guestSettingsEl = document.querySelector(".guest-settings");
const homeEl = document.querySelector(".home-page-container");
const gameEl = document.querySelector(".game-page-container");
const resultEl = document.querySelector(".result-page-container");

const checkPage = async function () {
  const isPlayerElExist = !playerEl.classList.contains("display-hide");
  const isHostSettingsElExist =
    !hostSettingsEl.classList.contains("display-hide");
  const isGuestSettingsElElExist =
    !guestSettingsEl.classList.contains("display-hide");

  let page = null;
  if (isPlayerElExist) {
    page = "home";
  }
  if (isHostSettingsElExist) {
    page = "home";
  }
  if (isGuestSettingsElElExist) {
    page = "home";
  }

  localStorage.setItem("currentPage", page);
  logWindowResize();
};

const logWindowResize = async function () {
  console.log(window.innerWidth, window.innerHeight);

  const isDeviceElExist = !deviceMessageEl.classList.contains("display-hide");
  if (window.innerHeight > window.innerWidth) {
    displayPage();
  } else {
    isDeviceElExist ? displayPage() : "";
  }
};

function displayPage() {
  const page = localStorage.getItem("currentPage");
  page ? deviceMessageEl.classList.toggle("display-hide") : "";
  switch (page) {
    case "home":
      homeEl.classList.toggle("display-hide");
      break;
    case "game":
      gameEl.classList.toggle("display-hide");
      break;
    case "result":
      resultEl.classList.toggle("display-hide");
      break;
    default:
      break;
  }
}

checkPage();

export { logWindowResize };
