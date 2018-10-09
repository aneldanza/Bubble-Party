
class Sound {
  constructor(src) {
    // this.sound = document.createElement('audio');
    // this.src = src;
    // this.sound.setAttribute("preload", "auto");
    // this.sound.setAttribute("controls", "none");
    // this.sound.style.display = "none";
    // document.body.appendChild(this.sound);
    
  }

 
  
  stop(){
    this.sound.pause();
  }

}

module.exports = Sound;