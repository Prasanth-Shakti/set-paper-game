# CLASSIC SET PAPER GAME

## Overview:

Game is developed using vanilla javascript (Client) and socket.io (Server).

## Deployment:

App Available in https://set-paper-game.netlify.app/

## How to play

1. Before starting, Each Player chooses a game card, which will be multiplied by 4(i.e., 1 set).</li>
2. Total number of cards will be No. of players _ 1 set.<br/>
   eg: 4(players) _ 4 cards(1 set) = 16 cards (i.e., 4 different sets).</li>
3. After starting game all the cards are shuffled and each player will be assigned 4 cards.</lclass=>
4. Each player passes any 1 card to next player and this continues until the game finishes.</li>
5. Game finishes when any player gets any 1 complete set of cards.</li>
6. When a player finishes the game he says 'SET' by placing hand on the table.</li>
7. Once player finish the game all the other players tries to place their hand on the finished player hand.</li>
8. Points will be decided after everyone places their hand. ie., finished player has highest points, next will be the player who place hand on finished player and then next will be player hand on the second player...so on.</li>

## Setup

Download code from repo.

Install Node.js

**Client:**

Go to root project folder, then run

    cd Client && npm i && npm start

**Server:**

Go to root project folder, then run in another terminal

    cd Server && npm i && npm start

Additionally, You can change endpoint in index.js and index.html to localhost:5000 for running the server locally.
