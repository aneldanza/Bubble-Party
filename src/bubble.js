
class Bubble {
  constructor(x, y, color, c, r, status) {
    this.x = x;
    this.y = y; 
    this.color = color;
    this.c = c;
    this.r = r;
    this.status = status;
    this.radius = 20;
  }

  isAvailable() {
    if(this.status === 'placeholder' && this.isValid()) {
      return true;
    } 
    return false;
  }

  isValid() {
    if (this.c < 14 && this.c >= 0 && this.r < 12 && this.r >= 0) {
      return true;
    }
    return false;
  }

}

module.exports = Bubble;
