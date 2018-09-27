const Bubble = require('./bubble');

class Game {
  constructor(ctx, colors, canvas) {
    this.ctx = ctx;
    this.dx = 2;
    this.dy = -2;
    this.bubbles = [];
    this.colors = colors;
    this.canvas = canvas;
    this.columns = 15;
    this.rows = 1;
    this.x = canvas.width/2;
    this.y = canvas.height - 20;
    this.radius = 20;
    this.createBubbles();
  }

  createBubbles() {
    for (let c = 0; c < this.columns; c++) {
      this.bubbles[c] = []
      for (let r = 0; r < this.rows; r++) {
        let color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.bubbles[c][r] = {x: 0, y: 0, color: color,  };
      }
    }
  }

  detectCollision() {
    for (let c = 0; c < this.columns; c++) {
      for (let r = 0; r < this.bubbles[c].length; r++) {
        let b = this.bubbles[c][r];
        
        if (this.x > b.x - this.radius && this.x < b.x + this.radius && this.y > b.y && this.y <= b.y + 2 * this.radius) {
          this.dy = -this.dy;
        }
      }
    }
  }
  
  drawPlayer() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    this.ctx.fillStyle = 'yellow';
    this.ctx.fill();
    this.ctx.closePath;
  }
  
  
  drawBubbles() {
    for (let c = 0; c < this.columns; c++) {
      for (let r = 0; r < this.rows; r++) {
        let bubbleX = this.radius * (2 * c + 1);
        let bubbleY = this.radius * (r + 1);
        this.bubbles[c][r].x = bubbleX;
        this.bubbles[c][r].y = bubbleY;
        this.ctx.beginPath();
        this.ctx.arc(bubbleX, bubbleY, this.radius, 0, Math.PI*2);
        this.ctx.fillStyle = this.bubbles[c][r].color;
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