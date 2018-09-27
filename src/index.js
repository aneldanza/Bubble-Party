import _ from 'lodash';
const Game = require('./game');

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");



let colors = ['blue', 'yellow', 'red', 'green', 'purple', 'orange'];



let game = new Game(ctx, colors, canvas);
window.game = game;
setInterval(() => game.draw(), 10);