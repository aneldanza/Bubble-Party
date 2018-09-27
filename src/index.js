import _ from 'lodash';


var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height - 20;
var radius = 20;
var dx = 2;
var dy = -2;

let columns = 15;
let rows = 1;


let colors = ['blue', 'yellow', 'red', 'green', 'purple', 'orange'];

var bubbles = [];
for (let c = 0; c < columns; c++) {
  bubbles[c] = []
  for (let r = 0; r < rows; r++) {
    let color = colors[Math.floor(Math.random() * colors.length)];
    bubbles[c][r] = {x: 0, y: 0, color: color };
  }
}
console.log('bubbles: ', bubbles);

function detectCollision() {
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < bubbles[c].length; r++) {
      let b = bubbles[c][r];
      
      console.log('bubbles: ', bubbles);
      console.log('b: ', b);
      
      console.log('x > b.x - radius: ', x > b.x - radius );
      if (x > b.x - radius && x < b.x + radius && y > b.y && y <= b.y + 2 * radius) {
        console.log('inside the if statement');
        dy = -dy;
      }
    }
  }
}

function drawPlayer() {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI*2);
  ctx.fillStyle = 'yellow';
  ctx.fill();
  ctx.closePath;
}



function drawBubbles() {
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows; r++) {
      let bubbleX = radius * (2 * c + 1);
      let bubbleY = radius * (r + 1);
      bubbles[c][r].x = bubbleX;
      bubbles[c][r].y = bubbleY;
      ctx.beginPath();
      ctx.arc(bubbleX, bubbleY, radius, 0, Math.PI*2);
      ctx.fillStyle = bubbles[c][r].color;
      ctx.fill();
      ctx.closePath();
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBubbles();
  detectCollision();
  if (x < radius || x > canvas.width - radius) {
    dx = -dx;
  }

  if (y < radius || y > canvas.height - radius) {
    dy = -dy;
  }
  x += dx;
  y += dy;
  // requestAnimationFrame(draw);
}

// draw();
setInterval(draw, 10);