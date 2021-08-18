let id = null;
let animate = {
  MAX: 0,
  pos: 0,
  frameRate: 1,
  terminalPosition: 0,
  start: function () {
    console.log("animation start: will be overridden!");
  },
  move: function (distance, dataDiv) {
    let thisContext = this;
    thisContext.start();
    thisContext.terminalPosition += distance;
    var elem = document.getElementById(dataDiv);
    clearInterval(id);
    id = setInterval(frame, 10);
    function frame() {
      if (thisContext.pos >= thisContext.terminalPosition) {
        clearInterval(id);
        thisContext.stop();
        elem.style.left = thisContext.terminalPosition + "px";
        if (thisContext.terminalPosition >= thisContext.MAX) {
          thisContext.pos = 0;
          thisContext.terminalPosition = 0;
          thisContext.complete();
        } else {
          thisContext.pos = thisContext.terminalPosition;
        }
      } else {
        if (!(thisContext.pos >= thisContext.MAX)) {
          thisContext.pos += thisContext.frameRate;
          elem.style.left = thisContext.pos + "px";
        } else {
          thisContext.complete();
          // clearInterval(id);
        }
      }
    }
  },
  stop: function () {
    console.log("animation stop: will be overriden!");
  },
  complete: function () {
    console.log("animation complete: will be overriden!");
  },
};
