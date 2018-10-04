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
  
  // function start() {
  //   game.over = false;
  //   debugger
  //   setInterval(() => {
  //     if (game.over) {
  //       clearInterval(interval);
  //       document.removeEventListener('mousemove', game_view.handleMouseMove);
        
  //     } else {
  //       game_view.draw()

  //     }
  //   }, 5);
  // }

  
    const interval = setInterval(() => {
      if (game.over) {
        clearInterval(interval);
        document.removeEventListener('mousemove', game_view.handleMouseMove);
        
      } else {
        game_view.draw()
        
      }
    }, 5);



  
  const playAgain = document.getElementById('start');
  playAgain.addEventListener('mousedown', game_view.start);


});
