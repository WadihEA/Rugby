var myGame = new Game();

var p1 = new Player(100, 100, true, 1, myGame);
myGame.addSprite(p1);
var p2 = new Player(100, 300, false, 2, myGame);
myGame.addSprite(p2);
var p3 = new Player(100, 500, false, 3, myGame);
myGame.addSprite(p3);
var lBall = new Ball(120, 105, p1, p2, p3, myGame);
myGame.addSprite(lBall);


var e1 = new Enemy(800, 100, myGame, 1, lBall);
myGame.addSprite(e1);
var e2 = new Enemy(840, 150, myGame, 2, lBall);
myGame.addSprite(e2);
var e3 = new Enemy(880, 200, myGame, 3, lBall);
myGame.addSprite(e3);

var e4 = new Enemy(840, 250, myGame, 2, lBall);
myGame.addSprite(e4);
var e5 = new Enemy(800, 300, myGame, 1, lBall);
myGame.addSprite(e5);
var e6 = new Enemy(840, 350, myGame, 2, lBall);
myGame.addSprite(e6);

var e7 = new Enemy(880, 400, myGame, 3, lBall);
myGame.addSprite(e7);
var e8 = new Enemy(840, 450, myGame, 2, lBall);
myGame.addSprite(e8);
var e9 = new Enemy(800, 500, myGame, 1, lBall);
myGame.addSprite(e9);

// myGame.addSprite(e10);
// var e11 = new Enemy(640, 150, myGame, 2, lBall);
// myGame.addSprite(e11);
// // var e12 = new Enemy(680, 200, myGame, 3, lBall);
// // myGame.addSprite(e12);

// var e13 = new Enemy(640, 250, myGame, 2, lBall);
// myGame.addSprite(e13);
// var e14 = new Enemy(600, 300, myGame, 1, lBall);
// myGame.addSprite(e14);
// var e15 = new Enemy(640, 350, myGame, 2, lBall);
// myGame.addSprite(e15);

// // var e16 = new Enemy(680, 400, myGame, 3, lBall);
// // myGame.addSprite(e16);
// var e17 = new Enemy(640, 450, myGame, 2, lBall);
// myGame.addSprite(e17);
// var e18 = new Enemy(600, 500, myGame, 1, lBall);
// myGame.addSprite(e18);

function animate() {
  var start = window.performance.now();
  myGame.update();
  myGame.draw();
  var end = window.performance.now();
  var ldiff = end - start;
  //console.log('Execution time:' +  (end - start));
  //wait function
  while (ldiff < 0.0166667) {
    end = window.performance.now();
    ldiff = end - start;
    //console.log('Wait');
  }

  // request new frame
  requestAnimFrame(animate);
}

animate();
