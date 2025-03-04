import _ from "lodash";
const Game = require("./game");
const GameView = require("./game_view");

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  const colors = ["blue", "yellow", "red", "purple", "green", "pink"];

  const game = new Game(colors, canvas);
  const game_view = new GameView(game, ctx, colors, canvas);

  const interval = setInterval(() => {
    if (game.over) {
      clearInterval(interval);
      document.removeEventListener("mousemove", game_view.handleMouseMove);
      game.score = 0;
    } else if (!game_view.pause) {
      game_view.draw();
    }
  }, 5);
});
