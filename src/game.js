const Bubble = require('./bubble');

class Game {
  constructor(ctx, colors, canvas) {
    this.ctx = ctx;
    this.dx = 0;
    this.dy = 0;
    this.bubbles = [];
    this.colors = colors;
    this.canvas = canvas;
    this.columns = 14;
    this.rows = 1;
    this.x = canvas.width/2;
    this.y = 550;
    this.radius = 20;
    this.createBubbles();
    canvas.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
    canvas.addEventListener('mousedown', this.handleMouseClick.bind(this), false);
  }


  handleMouseMove(e) {
    let relativeX = e.x - this.canvas.offsetLeft;
    let relativeY = e.y - this.canvas.offsetTop;
    
    this.ctx.beginPath();
    this.ctx.setLineDash([15, 10]);
    this.ctx.moveTo(this.canvas.width/2, this.canvas.height - 20);
    this.ctx.lineTo(relativeX * Math.cos(relativeY/relativeX), relativeY * Math.sin(relativeY/relativeX) );
    this.ctx.stroke();
  }
  
  handleMouseClick(e) {
    let clickedX = e.x - this.canvas.offsetLeft;
    let clickedY = e.y - this.canvas.offsetTop;
  
    let dx = Math.floor(clickedX * Math.cos(clickedY/clickedX));
    let dy = Math.floor(clickedY * Math.sin(clickedY/clickedX));
  
    if (clickedX < 300) {
      this.dx = (300 - dx) /(-100);
    } else {
      this.dx = (dx - 300) / 100;
    }
  
    this.dy = (550 - dy) / (-100);

  }

  createBubbles() {
    for (let c = 0; c < this.columns; c++) {
      this.bubbles[c] = []
      for (let r = 0; r < this.rows; r++) {
        let color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.bubbles[c][r] = new Bubble(0, 0, color);
      }
    }
  }

  detectCollision() {
    for (let c = 0; c < this.columns; c++) {
      for (let r = 0; r < this.bubbles[c].length; r++) {
        let b = this.bubbles[c][r];
        
        if (this.x > b.x - this.radius && this.x < b.x + this.radius 
          && this.y > b.y && this.y <= b.y + 2 * this.radius + 3) {
          this.dx = 0;
          this.dy = 0;
        }
      }
    }
  }
  
  drawPlayer() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    this.ctx.fillStyle = 'yellow';
    this.ctx.fill();
    this.ctx.strokeStyle = 'blue';
    this.ctx.stroke();
    this.ctx.closePath;
  }
  
  
  drawBubbles() {
    let leftOffset = 5;
    let bubblePadding = 3;
    for (let c = 0; c < this.columns; c++) {
      for (let r = 0; r < this.rows; r++) {
        // let bubbleX = this.radius * (2 * c + 1) + leftOffset;
        let bubbleX = (bubblePadding + 2*this.radius) * c + this.radius;
        let bubbleY = this.radius * (r + 1);
        this.bubbles[c][r].x = bubbleX;
        this.bubbles[c][r].y = bubbleY;
        this.ctx.beginPath();
        this.ctx.arc(bubbleX, bubbleY, this.radius, 0, Math.PI*2);
        this.ctx.fillStyle = this.bubbles[c][r].color;
        this.ctx.strokeStyle = 'blue';
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
      }
    }
  }
  
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawPlayer();
    this.drawBubbles();
    this.detectCollision();

    if (this.x < this.radius || this.x > this.canvas.width - this.radius) {
      this.dx = -this.dx;
    }
  
    if (this.y < this.radius || this.y > this.canvas.height - this.radius) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
    
  
    // requestAnimationFrame(draw);
  }
  
  // draw();
  
}

module.exports = Game;