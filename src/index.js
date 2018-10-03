import _ from 'lodash';
const Game = require('./game');
const GameView = require('./game_view');
// export let interval;

document.addEventListener('DOMContentLoaded', () => {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  
  let colors = ['blue', 'yellow', 'red', 'purple', 'green', 'pink']
  
  let game = new Game(colors, canvas);
  let game_view = new GameView(game, ctx, colors, canvas);
  
  // game_view.draw();
  // requestAnimationFrame(() => game_view.draw());

    const interval = setInterval(() => {
      if (game.over) {
        clearInterval(interval);
        document.removeEventListener('mousemove', game_view.handleMouseMove);
        alert('game over');
      } else {
        game_view.draw()

      }
    }, 5);
  });
