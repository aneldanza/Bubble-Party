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
  constructor(colors, canvas) {
    this.dx = 0;
    this.dy = 0;
    this.bubbles = [];
    this.colors = colors;
    this.canvas = canvas;
    this.floating = true;
    this.columns = 14;
    this.rows = 13;
    this.moveCount = 0;
    this.createBubbles();
    this.fullRowCount = 1;
    this.cluster = [];
    this.newPlayer();
    this.over = false;
  }

  searchForCluster(bubble) {
     this.cluster.push(bubble);

     for (let i = 0; i < CLUSTER_POSITIONS.length; i++) {
       let c, r;
       if (this.bubbles[0][bubble.r].x === 23) {
        c = CLUSTER_POSITIONS[i][0] + bubble.c;
        r = CLUSTER_POSITIONS[i][1] + bubble.r;
       } else {
        c = OFFSET_CLUSTER_POSITIONS[i][0] + bubble.c;
        r = OFFSET_CLUSTER_POSITIONS[i][1] + bubble.r;
       }
       
       if (c > this.columns || c < 0 || r > this.rows || r < 0) {
          continue;
        } else if (this.bubbles[c] &&
          this.bubbles[c][r] &&
          this.bubbles[c][r].color === bubble.color && !this.cluster.includes(this.bubbles[c][r])) {
         
          this.searchForCluster(this.bubbles[c][r]);
        }
     }
   
    return this.cluster;
  }
  
  dropCluster() {
    for (let bubble = 0; bubble < this.cluster.length; bubble++) {
      this.cluster[bubble].status = 'placeholder';
      this.cluster[bubble].color = 'transparent';
    }
    this.cluster = [];
  }

  isDisattached({c, r}) {
    if (this.bubbles[c][r - 1].status === 'placeholder') {
      if (this.bubbles[0][r].x === 23) {
       
        if (c > 0 &&
          this.bubbles[c - 1][r - 1].status === 'placeholder') {
          return true;
        } else if (c === 0) {
          return true;
        }
      } else {
        if (c < this.columns - 1 &&
          this.bubbles[c + 1][r - 1].status === 'placeholder') {
          return true;
        } else if(c === this.columns - 1 &&
          this.bubbles[c - 1][r].status === 'placeholder') {
          return true;
        } 
      }
    }
    return false;
  }

  detectFloatingBubbles() {
    this.floating = false;
    for (let c = 0; c < this.columns; c++) {
      for (let r = 1; r < this.rows; r++ ){ 
      
        if ((this.bubbles[c][r].status === 'visible' && this.isDisattached(this.bubbles[c][r]) && c === 0) ||(this.bubbles[c][r].status === 'visible' && this.isDisattached(this.bubbles[c][r]) 
        && this.bubbles[c - 1][r].status === 'placeholder'))
        {      
          this.cluster.push(this.bubbles[c][r]);
          for (let i = c + 1; i < this.columns; i++) {

            if (this.bubbles[i][r].status === 'visible' && this.isDisattached.call(this, this.bubbles[i][r])) {
              this.cluster.push(this.bubbles[i][r])
            } else if (this.bubbles[i][r] === 'undefined' || this.bubbles[i][r].status === 'placeholder') {
              break;
            } else {
              this.cluster = [];
              break;
            }  
          } 
          
          
          if (this.cluster.length > 0) {
            let start_column = this.cluster[0].c
            let start_row = this.cluster[0].r + 1;
            
            for (let k = start_column; k <= this.cluster[this.cluster.length - 1].c; k++) {
              for (let j =  start_row; j < this.rows; j++) {
                if (this.bubbles[k][j].status === 'visible') {
                  this.cluster.push(this.bubbles[k][j]);
                  this.cluster
                }
              }
            }
          this.dropCluster();
          this.floating = true;         
          } 
        } 
      }
    }
  }

  addRow() {
    for (let c = 0; c < this.columns; c++) {
      for (let r = this.rows - 1; r >= 1;  r--) {
       this.bubbles[c][r] = this.bubbles[c][r - 1];
      }
    }

    for (let c = 0; c < this.columns; c++) {
      let color = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.bubbles[c][0] = new Bubble(0, 0, color, 0, 0, 'visible');
    }

    this.fullRowCount++;
  }

  gameOver() {
    var d = document.getElementById("message");
    d.className = "game-over";
    d.style.display = 'grid'; 
  }

  createBubbles() {
    for (let c = 0; c < this.columns; c++) {
      this.bubbles[c] = [];
      for (let r = 0; r < this.rows; r++) {
        this.bubbles[c][r] = new Bubble(0,0,'transparent', 0,0, 'placeholder');
      }
    }
    this.addRow();
    this.addRow();
    this.addRow();
    this.addRow();
    this.addRow();
    this.addRow();
    this.addRow();
    this.addRow();
    this.addRow();
    this.addRow();
    this.addRow();
  }

  detectCollision() {
    for (let c = 0; c < this.columns; c++) {
      for (let r = 0; r < this.bubbles[c].length; r++) {
        let b = this.bubbles[c][r];
        
        if (b.status === 'visible'
          && this.x > b.x - b.radius - 1
          && this.x < b.x + b.radius 
          && this.y > b.y 
          && this.y <= b.y + 2 * b.radius + 1) 
          {
          this.dx = 0;
          this.dy = 0;
          let newBubble = new Bubble(this.x, this.y, this.player.color, 0, 0, 'visible');

          if (b.y >= 500) {
            this.gameOver();
            this.over = true; 
          }

            if (this.x < this.bubbles[c][r].x) {
              if (this.bubbles[0][r].x === 23 && this.bubbles[c - 1] && r < this.rows) {
                if (r + 1 < this.rows && this.bubbles[c - 1][r + 1].isAvailable()) {
                  newBubble.c = c - 1;
                  newBubble.r = r + 1;
                  this.bubbles[c - 1][r + 1] = newBubble;
              
                } else {
                  newBubble.c = c - 1;
                  newBubble.r = r;
                  this.bubbles[c - 1][r] = newBubble;
                } 
              } else {
                if (this.bubbles[c] && this.bubbles[c][r + 1].isAvailable()) {
                  newBubble.c = c;
                  newBubble.r = r + 1;
                  this.bubbles[c][r + 1] = newBubble;
                } else if (this.bubbles[c - 1]) {
                  newBubble.c = c - 1;
                  newBubble.r = r;
                  this.bubbles[c - 1][r] = newBubble;
                }
              }
            } else {
              // 
              if (this.bubbles[0][r].x === 23) {
                if (this.bubbles[c][r + 1] && this.bubbles[c][r + 1].isAvailable()) {
                  newBubble.c = c;
                  newBubble.r = r + 1;
                  this.bubbles[c][r + 1] = newBubble;
                } else if (this.bubbles[c + 1]){
                  newBubble.c = c + 1;
                  newBubble.r = r;
                  this.bubbles[c + 1][r] = newBubble;
                } 
              } else {
                if (this.bubbles[c + 1][r + 1] && this.bubbles[c + 1][r + 1].isAvailable()) {
                  newBubble.c = c + 1;
                  newBubble.r = r + 1;
                  this.bubbles[c + 1][r + 1] = newBubble;
                } else {
                  newBubble.c = c + 1;
                  newBubble.r = r;
                  this.bubbles[c + 1][r] = newBubble;
                }
              }
            }

          let cluster = this.searchForCluster.call(this, newBubble);  
            if (cluster.length > 2) {  
              this.dropCluster();
              this.floating = true;
    
              while (this.floating) {
                this.detectFloatingBubbles();
              }
            }
            this.cluster = [];
            this.newPlayer();
        }
      }
    }
  }

  newPlayer() {
    this.x = this.canvas.width/2;
    this.y = 570;
    let color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.player = new Bubble(this.x, this.y, color);
  } 
}

module.exports = Game;