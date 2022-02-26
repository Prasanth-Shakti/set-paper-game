const rulesListEl = document.querySelector(".rules-list");

function rulesList() {
  rulesListEl.innerHTML = ` 
  <li class="rule">Before starting, Each Player chooses a game card, which will be multiplied by 4(i.e., 1 set).</li>
  <li class="rule">Total number of cards will be No. of players * 1 set.<br/>
  eg: 4(players) * 4 cards(1 set) = 16 cards (i.e., 4 different sets).</li>
  <li class="rule">After starting game all the cards are shuffled and each player will be assigned 4 cards.</li>
  <li class="rule">Each player passes any 1 card to next player and this continues until the game finishes.</li>
  <li class="rule">Game finishes when any player gets any 1 complete set of cards.</li>
  <li class="rule">When a player finishes the game he says 'SET' by placing hand on the table.</li>
  <li class="rule">Once player finish the game all the other players tries to place their hand on the finished player hand.</li>
  <li class="rule">Points will be decided after everyone places their hand. ie., finished player has highest points, next will be the player who place hand on finished player and then next will be player hand on the second player...so on.</li>
  `;
}

export { rulesList };
