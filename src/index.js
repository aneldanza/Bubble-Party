import _ from 'lodash';
const Game = require('./game');
const GameView = require('./game_view');
// export let interval;

document.addEventListener('DOMContentLoaded', () => {
  // var config = {
  //   apiKey: "apiKey",
  //   authDomain: "projectId.firebaseapp.com",
  //   databaseURL: "https://databaseName.firebaseio.com",
  //   storageBucket: "bucket.appspot.com"
  // };

  // firebase.initializeApp(config);

  // // Get a reference to the database service
  // var database = firebase.database();

  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  
  let colors = ['blue', 'yellow', 'red', 'purple', 'green', 'pink']
  // let colors = ['blue', 'yellow', 'red']
  
  let game = new Game(colors, canvas);
  let game_view = new GameView(game, ctx, colors, canvas);

  
    const interval = setInterval(() => {
      if (game.over) {
        clearInterval(interval);
        document.removeEventListener('mousemove', game_view.handleMouseMove);
        
      } else if(!game_view.pause) {
        game_view.draw()
        
      }
    }, 5);



  
  // const playAgain = document.getElementById('start');
  // playAgain.addEventListener('mousedown', game_view.start);


});
