
class GameView {
  constructor(game, ctx, colors, canvas) {
    this.game = game;
    this.ctx = ctx;
    this.colors = colors;
    this.canvas = canvas;
    this.radius = 20;
    this.moveCount = 0;
    this.handleMouseMove = this.handleMouseMove.bind(this);
    // this.start = this.start.bind(this);
    document.addEventListener('mousemove', this.handleMouseMove, false);
    canvas.addEventListener('mousedown', this.handleMouseClick.bind(this), false);
    const playAgain = document.getElementById('play-again');
    playAgain.addEventListener('mousedown', this.start.bind(this));
    
  }

  start() {
    document.location.reload();
    this.game.over = false;
    const d = document.getElementById("message");
    d.style.display = 'none';
    // document.addEventListener('mousemove', this.handleMouseMove, false);
    debugger
    const interval = setInterval(() => {
      debugger
      if (this.game.over) {
        clearInterval(interval);
        document.removeEventListener('mousemove', this.handleMouseMove);
        
      } else {
        this.draw();
      }
    }, 5);
  }

  handleMouseMove(e) {
    let relativeX = e.x - this.canvas.offsetLeft;
    let relativeY = e.y - this.canvas.offsetTop;
   
    this.ctx.beginPath();
    this.ctx.setLineDash([15, 10]);
    this.ctx.moveTo(this.canvas.width/2, this.canvas.height - 40);
    this.ctx.lineTo(relativeX, relativeY);
    this.ctx.stroke();
  }
  
  handleMouseClick(e) {
    this.moveCount++;
    let clickedX = e.x - this.canvas.offsetLeft;
    let clickedY = e.y - this.canvas.offsetTop;
    this.game.dx = (clickedX - this.canvas.width/2)/100;
    this.game.dy = (clickedY - 570)/100;
    
    if (this.moveCount === 4) {
      this.game.addRow();
      this.moveCount = 0;
    }
  }


  drawPlayer() {
    this.ctx.beginPath();
    this.ctx.arc(this.game.x, this.game.y, this.radius, 0, Math.PI*2);
    this.ctx.fillStyle = this.game.player.color;
    this.ctx.fill();
    this.ctx.strokeStyle = 'blue';
    this.ctx.stroke();
    this.ctx.closePath;
  }

  drawBubbles() {
    let bubblePadding = 1;
    let leftOffset = 3;
    let topOffset = 3;
    for (let c = 0; c < this.game.bubbles.length; c++) {
      for (let r = 0; r < this.game.bubbles[c].length; r++) {
        let bubbleX = (bubblePadding + 2*this.radius) * c + this.radius + leftOffset;
        if (this.game.fullRowCount % 2 === 0) {
        
          if (r % 2 === 0) {
            bubbleX += this.radius;
    
          }
        } else {
          if (r % 2 !== 0) {
            bubbleX += this.radius;
        
          }
        } 
        let bubbleY = (2 * this.radius + topOffset) * r + this.radius;
        this.game.bubbles[c][r].x = bubbleX;
        this.game.bubbles[c][r].y = bubbleY;
        this.game.bubbles[c][r].c = c;
        this.game.bubbles[c][r].r = r;
        this.ctx.beginPath();
        this.ctx.arc(bubbleX, bubbleY, this.radius, 0, Math.PI*2);
        this.ctx.fillStyle = this.game.bubbles[c][r].color;
        // this.ctx.strokeStyle = 'blue';
        // this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
        
        if (bubbleY >=535 && this.game.bubbles[c][r].color !== 'transparent') {
          this.game.over = true;
          this.game.gameOver();
        }
      }
    }
  }
  
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawPlayer();
    this.drawBubbles();
    this.game.detectCollision();
    if (this.game.x < this.radius || this.game.x > this.canvas.width - this.radius) {
      this.game.dx = -this.game.dx;
    }
    
    if (this.game.y < this.radius || this.game.y > this.canvas.height - this.radius) {
      this.game.dy = -this.game.dy;
    }
    
    this.game.x += this.game.dx;
    this.game.y += this.game.dy;
  
    // requestAnimationFrame(() => this.draw());
  }

}


module.exports = GameView;