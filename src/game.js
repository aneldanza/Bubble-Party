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
    this.rows = 14;
    this.moveCount = 0;
    this.createBubbles();
    this.fullRowCount = 1;
    this.score = 0;
    this.highestScore = this.highestScore;
    this.cluster = [];
    this.newPlayer();
    this.over = false;
    this.bottomCollision = false;
    this.leftSideCollision = false;
    this.rightSideCollision = false;
    this.topBorderCollision = false;
    const stop = document.getElementById('quit');
    stop.addEventListener('mousedown', this.gameOver.bind(this));
  }

  searchForCluster(bubble) {
    if (!this.cluster.includes(bubble)) {
      this.cluster.push(bubble);
    }
    
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
    if (this.cluster.length > 0) {
      this.score += this.cluster.length;
    }
    this.cluster = [];
  }

  isDisattached({c, r}) { 
    if (r === 0) {
      return false;
    }
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
      
        if ((this.bubbles[c][r].status === 'visible' && this.isDisattached(this.bubbles[c][r]) && c === 0 && r > 0) ||(this.bubbles[c][r].status === 'visible' && this.isDisattached(this.bubbles[c][r]) 
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
    let score = document.getElementById('current-score');
    let currentScore = this.score;
    score.innerHTML = currentScore;
    var d = document.getElementById("message");
    d.className = "game-over";
    d.style.display = 'grid'; 
    let highestScore = document.getElementById('highest-score');
    if (this.score > this.highestScore) {
      this.highestScore = this.score;
    }
    highestScore.innerHTML = this.highestScore;
    this.over = true;
  }

  createBubbles() {
    for (let c = 0; c < this.columns; c++) {
      this.bubbles[c] = [];
      for (let r = 0; r < this.rows; r++) {
        this.bubbles[c][r] = new Bubble(0,0,'transparent', 0,0, 'placeholder');
      }
    }
    this.addRow();
  }

  isBottomCollision(bubble) {
    if (
      bubble.status === 'visible'
      && this.x > bubble.x - bubble.radius - 1
      && this.x < bubble.x + bubble.radius + 1
      && this.y > bubble.y 
      && this.y <= bubble.y + 2 * bubble.radius + 2) {
        this.bottomCollision = true;
        return true;
      } 
      return false;
  }
  
  isRightSideCollision(bubble) {
    if (
      bubble.status === 'visible'
      && this.y > bubble.y - bubble.radius
      && this.y < bubble.y + bubble.radius
      && this.x > bubble.x 
      && this.x <= bubble.x + 2 * bubble.radius - 5) {
        this.rightSideCollision = true; 
        return true;
    }
    return false;
  }
  
  isLeftSideCollision(bubble) {
    if (
      bubble.status === 'visible'
      && this.y > bubble.y - bubble.radius
      && this.y < bubble.y + bubble.radius
      && this.x < bubble.x 
      && this.x >= bubble.x - 2 * bubble.radius + 5
      ) {
        this.leftSideCollision = true;
        return true;
      }
      return false;
    }
    
    handleBottomCollision(bubble) {
      this.bottomCollision = false;
      if (this.x < bubble.x) {
        
        if (this.bubbles[0][bubble.r].x === 23 && bubble.c > 0) {
          return [bubble.c - 1, bubble.r + 1];
        } else {
          return [bubble.c, bubble.r + 1]
        }
      } else {
        if (this.bubbles[0][bubble.r].x === 23) {
          return [bubble.c, bubble.r + 1];
        } else {
          if (bubble.c === this.columns - 1) {
            return [bubble.c, bubble.r + 1]
          } else {
            return [bubble.c + 1, bubble.r + 1]
          }
        }
      }
    }
    
    handleLeftSideCollision(bubble) {
      this.leftSideCollision = false;
      if (bubble.c === 0) {
        this.handleBottomCollision.call(this, bubble)
      } else {
        return [bubble.c - 1, bubble.r];
      }
    }
    
    handleRightSideCollision(bubble) {
      this.rightSideCollision = false;
      if (bubble.c === this.columns - 1) {
        this.handleBottomCollision.call(this, bubble);
      } else {
      return [bubble.c + 1, bubble.r];
    }
  }
  isTopBorderCollision() {
    if (this.y > 0 && this.y <= 20) {
      this.topBorderCollision = true;
      return true;
    }
    return false;
  }

  handleTopBorderCollision() {
    this.topBorderCollision = false;
    for(let c = 0; c < this.columns; c++) {
      if (this.x < this.bubbles[c][0].x + 20 &&
          this.x > this.bubbles[c][0].x - 20) {
            return [c, 0];
          }
    }
  }

  
  detectCollision() {
    for (let c = 0; c < this.columns; c++) {
      for (let r = 0; r < this.bubbles[c].length; r++) {
        let bubble = this.bubbles[c][r];
        
        if (this.topBorderCollision ||
            this.isBottomCollision.call(this, bubble) ||
            this.isLeftSideCollision.call(this, bubble) ||
            this.isRightSideCollision.call(this, bubble)) 
          {
          this.dx = 0;
          this.dy = 0;
          let newBubble = new Bubble(this.x, this.y, this.player.color, 0, 0, 'visible');
  
          if (bubble.y >= 500) {
            this.gameOver();
            return
          }
       
          let coordinates = [];
          if (this.topBorderCollision) {
            coordinates = this.handleTopBorderCollision.call(this);
          }
          if (this.bottomCollision) {
            coordinates = this.handleBottomCollision.call(this, bubble);
          } else if (this.leftSideCollision) {
            coordinates = this.handleLeftSideCollision.call(this, bubble);
          } else if (this.rightSideCollision) {
            coordinates = this.handleRightSideCollision.call(this, bubble);
          } 

          newBubble.c = coordinates[0];
          newBubble.r = coordinates[1];
          this.bubbles[newBubble.c][newBubble.r] = newBubble;

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