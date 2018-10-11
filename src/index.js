import _ from 'lodash';
const Game = require('./game');
const GameView = require('./game_view');
// export let interval;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAEWvBjnicABetSjMV73WYidvq0M9xqssE",
    // authDomain: "bubble-party.firebaseapp.com",
    databaseURL: "https://bubble-party.firebaseio.com",
    projectId: "bubble-party",
    // storageBucket: "bubble-party.appspot.com",
    messagingSenderId: "448048905735"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();
  
  function highestScore(score) {
    database.ref('/').set({
      score: score
    });
  }

  let previousHighScore = 0;
  var highestScoreCount = firebase.database().ref('/');
  highestScoreCount.on('value', function(snapshot) {
    previousHighScore = snapshot.val().score;
    game.highestScore = snapshot.val().score;
  });


  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  
  let colors = ['blue', 'yellow', 'red', 'purple', 'green', 'pink']
  // let colors = ['blue', 'yellow'];
  let game = new Game(colors, canvas);
  let game_view = new GameView(game, ctx, colors, canvas);

  
    const interval = setInterval(() => {
      if (game.over) {
        if (game.score > previousHighScore) {
          highestScore(game.score);
        }
        clearInterval(interval);
        document.removeEventListener('mousemove', game_view.handleMouseMove);
        game.score = 0;
      } else if(!game_view.pause) {
        game_view.draw()
        
      }
    }, 5);
});
