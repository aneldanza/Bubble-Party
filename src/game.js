const Bubble = require('./bubble');
const CLUSTER_POSITIONS = [
  [0, -1],
  [0, 1],
  [-1, 0], 
  [1, 0], 
  [-1, -1], 
  [-1, 1]
];

const OFFSET_CLUSTER_POSITIONS = [
  [0, -1],
  [0, 1],
  [-1, 0], 
  [1, 0], 
  [1, -1], 
  [1, 1]
];


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
    this.radius = 20;
    this.moveCount = 0;
    this.createBubbles();
    this.fullRowCount = 1;
    this.cluster = [];
    this.newPlayer();
    document.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
    document.addEventListener('mousedown', this.handleMouseClick.bind(this), false);
  }


  handleMouseMove(e) {
    let relativeX = e.x - this.canvas.offsetLeft;
    let relativeY = e.y - this.canvas.offsetTop;

    this.ctx.beginPath();
    this.ctx.setLineDash([15, 10]);
    this.ctx.moveTo(this.canvas.width/2, this.canvas.height - 40);
    let targetX = relativeX * Math.cos(relativeY/relativeX);
    let targetY = relativeY * Math.sin(relativeY/relativeX);

    this.ctx.lineTo(targetX, targetY);
    this.ctx.stroke();
  }
  
  handleMouseClick(e) {
    this.moveCount++;
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
    
    if (this.moveCount === 4) {
      this.addRow();
      this.moveCount = 0;
    }
  }

  searchForCluster(bubble) {
    debugger
     this.cluster.push(bubble);
    // for (let i = 0; i < this._POSITIONS.length; i++) {
    //   let c = this._POSITIONS[i][0] + bubble.c;
    //   if (c > 13 || c < 0) {
    //     continue;
    //   }
    //   let r = this._POSITIONS[i][1] + bubble.r;
    //   if (this.bubbles[c][r] && this.bubbles[c][r].color === bubble.color) {
    //     debugger
    //     cluster.push(this.bubbles[c][r]);
    //   }
    // }
    if (this.bubbles[0][bubble.r].x === 23) {
      for (let i = 0; i < CLUSTER_POSITIONS.length; i++) {
        let c = CLUSTER_POSITIONS[i][0] + bubble.c;
        if (c > 13 || c < 0) {
              continue;
            }
        let r = CLUSTER_POSITIONS[i][1] + bubble.r;
        debugger
        if (this.bubbles[c][r] && this.bubbles[c][r].color === bubble.color && !this.cluster.includes(this.bubbles[c][r])) {
          // cluster.push(this.bubbles[c][r]);
          this.searchForCluster(this.bubbles[c][r]);
          debugger
        }
      }
    } else {
      for (let i = 0; i < OFFSET_CLUSTER_POSITIONS.length; i++) {
        let c = OFFSET_CLUSTER_POSITIONS[i][0] + bubble.c;
        if (c > 13 || c < 0) {
          continue;
        }
        let r = OFFSET_CLUSTER_POSITIONS[i][1] + bubble.r;
        debugger
        if (this.bubbles[c][r] && this.bubbles[c][r].color === bubble.color && !this.cluster.includes(this.bubbles[c][r])) {
          // cluster.push(this.bubbles[c][r]);
          this.searchForCluster(this.bubbles[c][r]);
          debugger
        }
      }
    }
    debugger
    return this.cluster;

  }
  
  dropCluster() {
    if (this.cluster.length > 2) {
      console.log(this.cluster);
      this.cluster = [];
    }
    debugger
  }

  addRow() {
    for (let c = this.columns - 1; c >= 0; c--) {
      for (let r = this.bubbles[c].length - 1; r >= 1;  r--) {
       this.bubbles[c][r] = this.bubbles[c][r - 1];
      }
    }

    for (let c = 0; c < this.columns; c++) {
      let color = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.bubbles[c][0] = new Bubble(0, 0, color, 0, 0, 'visible');
    }

    this.fullRowCount++;
  }

  createBubbles() {
    for (let c = 0; c < this.columns; c++) {
      this.bubbles[c] = [];
      for (let r = 0; r < 12; r++) {
        this.bubbles[c][r] = new Bubble(0,0,'transparent', 0,0, 'placeholder');
      }
    }
    this.addRow();
  }

  detectCollision() {
    for (let c = 0; c < this.columns; c++) {
      for (let r = 0; r < this.bubbles[c].length; r++) {
        let b = this.bubbles[c][r];
        
        if (b.status === 'visible'
          && this.x > b.x - this.radius
          && this.x < b.x + this.radius 
          && this.y > b.y 
          && this.y <= b.y + 2 * this.radius) 
          {
          this.dx = 0;
          this.dy = 0;
          let newBubble = new Bubble(this.x, this.y, this.player.color, 0, 0, 'visible');
       
          if (this.x < this.bubbles[c][r].x) {
            if (this.bubbles[0][r].x === 23) {
              if (this.bubbles[c - 1][r + 1].isAvailable()) {
                this.bubbles[c - 1][r + 1] = newBubble;
                this.newBubbleC = c - 1;
                this.newBubbleR = r + 1;
              } else {
                this.bubbles[c - 1][r] = newBubble;
                this.newBubbleC = c - 1;
                this.newBubbleR = r;
              } 
            } else {
              if (this.bubbles[c][r + 1].isAvailable()) {
                this.bubbles[c][r + 1] = newBubble;
                this.newBubbleC = c;
                this.newBubbleR = r + 1;
              } else {
                this.bubbles[c - 1][r] = newBubble;
                this.newBubbleC = c - 1;
                this.newBubbleR = r;
              }
            }
          } else {
            if (this.bubbles[0][r].x === 23) {
              if (this.bubbles[c][r + 1].isAvailable()) {
                this.bubbles[c][r + 1] = newBubble;
                this.newBubbleC = c;
                this.newBubbleR = r + 1;
              } else {
                this.bubbles[c + 1][r] = newBubble;
                this.newBubbleC = c + 1;
                this.newBubbleR = r;
              } 
            } else {
              if (this.bubbles[c + 1][r + 1].isAvailable()) {
                this.bubbles[c + 1][r + 1] = newBubble;
                this.newBubbleC = c + 1;
                this.newBubbleR = r + 1;
              } else {
                this.bubbles[c + 1][r] = newBubble;
                this.newBubbleC = c + 1;
                this.newBubbleR = r;
              }
            }
          }
          newBubble.c = this.newBubbleC;
          newBubble.r = this.newBubbleR;
          debugger
          if (this.searchForCluster(newBubble).length > 2) {
            debugger
            this.dropCluster();
          }
      
          this.newPlayer();
        }
      }
    }
  }

  
  newPlayer() {
    this.x = this.canvas.width/2;
    this.y = 550;
    let color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.player = new Bubble(this.x, this.y, color);
    
  }

  drawPlayer() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    this.ctx.fillStyle = this.player.color;
    this.ctx.fill();
    this.ctx.strokeStyle = 'blue';
    this.ctx.stroke();
    this.ctx.closePath;
  }
  
  
  drawBubbles() {
    let bubblePadding = 1;
    let leftOffset = 3;
    let topOffset = 3;
    for (let c = 0; c < this.bubbles.length; c++) {
      for (let r = 0; r < this.bubbles[c].length; r++) {
        let bubbleX = (bubblePadding + 2*this.radius) * c + this.radius + leftOffset;
        if (this.fullRowCount % 2 === 0) {
          if (r % 2 === 0) {
            bubbleX += this.radius;
          }
        } else {
          if (r % 2 !== 0) {
            bubbleX += this.radius;
          }
        }
        let bubbleY = (2 * this.radius + topOffset) * r + this.radius;
        this.bubbles[c][r].x = bubbleX;
        this.bubbles[c][r].y = bubbleY;
        this.bubbles[c][r].c = c;
        this.bubbles[c][r].r = r;
        this.ctx.beginPath();
        this.ctx.arc(bubbleX, bubbleY, this.radius, 0, Math.PI*2);
        this.ctx.fillStyle = this.bubbles[c][r].color;
        // this.ctx.strokeStyle = 'blue';
        // this.ctx.stroke();
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