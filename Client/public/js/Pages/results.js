const resultPageEl = document.querySelector(".result-page-container");
const gamePageEl = document.querySelector(".game-page-container");
const pointsTableRowsEl = document.querySelector(".table-rows");

function gamePoints(socket) {
  const serverSocket = socket;
  serverSocket.on("gamePoints", function (pointsTable) {
    gamePageEl.classList.add("display-hide");
    resultPageEl.classList.remove("display-hide");
    localStorage.setItem("currentPage", "result");
    pointsTable.forEach((el) => {
      pointsTableRowsEl.insertAdjacentHTML(
        "beforeend",
        `<tr>
      <td class="tableCellWidth"> <img
        src="${el.playerImage}"
        alt="avatar"
        width="70"
        height="70"
        class="img-avatar"
      
      /></td>
      <td class="tableCellWidth">${el.playerName}</td>
      <td>${el.points}</td>
      </tr>`
      );
    });
  });
}

export { gamePoints };
