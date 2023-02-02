//Keyboard Input (keydown, keyup)
var inputKeys = {};

addEventListener(
  "keydown",
  function (e) {
    //console.log(e);
    inputKeys[e.keyCode] = true;
  },
  false
);
addEventListener(
  "keyup",
  function (e) {
    if (e.keyCode != 83 && e.keyCode != 87) inputKeys[e.keyCode] = false;
  },
  false
);

//Main Game Class
class Game {
  constructor() {
    this.canvas = document.getElementById("myCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.sprites = [];
    this.gameRunning = false;
    this.whistle = new Audio("assets/mp3/RefereeWhistle.mp3");
  }
  update() {
    var lSpriteLength = this.sprites.length;
    var ldeletedArrays = [];
    for (var i = 0; i < lSpriteLength; i++) {
      this.sprites[i].update(this.sprites);
      if (this.sprites[i] instanceof Ball) {
        if (this.sprites[i].deleted) ldeletedArrays.push(this.sprites[i]);
      }
    }
    for (var i = 0; i < ldeletedArrays.length; i++) {
      var index = this.sprites.indexOf(ldeletedArrays[i]);
      this.sprites.splice(index, 1);
    }
    ldeletedArrays = [];
    if (inputKeys[32]) {
      this.gameRunning = true;
      this.whistle.play();
    }
  }
  draw() {
    var bgImage = new Image();
    bgImage.src = "assets/images/fieldBg.png"; //bg image

    this.ctx.drawImage(
      bgImage,
      0,
      0,
      bgImage.width,
      bgImage.height,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    var lSpriteLength = this.sprites.length;
    for (var i = 0; i < lSpriteLength; i++) {
      this.sprites[i].draw(this.ctx);
    }
  }
  addSprite(pSprite) {
    this.sprites.push(pSprite);
  }
}
//Sprite
class Sprite {
  constructor() {}
  update() {}
  draw() {}
}

class Ball extends Sprite {
  constructor(centerX, centerY, p1, p2, p3, game) {
    super();
    this.x = centerX;
    this.y = centerY;
    this.w = 34; //width of ball
    this.h = 20; //height of ball
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.p3passingtop2 = false;
    this.game = game;
    this.gameMusic = new Audio("assets/mp3/gameSound.mp3");
    this.goalSound = new Audio("assets/mp3/goal.mp3");
    this.passing = false;
    this.tickCountx = 0;
    this.lost = false;
    this.won = false;
    this.reset = false;
  }
  update(arrayOfCollisions) {
    this.tickCountx += 1;
    if (this.tickCountx == 40) { //animation for ball when passing
      this.tickCountx = 0;
    }
    if (inputKeys[67]) { //c to continue
      this.game.gameRunning = true;
    }

    if (inputKeys[82]) { //r for reset
      this.lost = false;
      this.won = false;
      this.x = 120;
      this.y = 105;
      this.p1.x = 100;
      this.p1.y = 100;
      this.p2.x = 100;
      this.p2.y = 300;
      this.p3.x = 100;
      this.p3.y = 500;
      this.p1.moving = true;
      this.p1.haveBall = true;
      this.p2.moving = true;
      this.p3.moving = true; //reset player and ball
      var enemyArr = arrayOfCollisions;
      var length = arrayOfCollisions.length;
      for (var q = 0; q < length; q++) {
        if (enemyArr[q] instanceof Enemy) {
          enemyArr[q].moving = true;
          if (enemyArr[q].nb == 1) {
            enemyArr[q].x = 800;
          } else if (enemyArr[q].nb == 2) {
            enemyArr[q].x = 840;
          } else {
            enemyArr[q].x = 880;
          }
        }
      }//reset enemies
      this.game.gameRunning = false;
    }
    if (this.game.gameRunning && !this.lost) { //game running
      this.gameMusic.play();

      if (inputKeys[80]) { //p for pause
        //console.log("pause");
        this.gameMusic.pause();
        this.game.gameRunning = false;
      }

      if (inputKeys[83]) { //passing downwards
        if (this.y <= this.p2.y && (this.p1.haveBall || this.p2.haveBall)) { //p1 passing to p2
          this.passing = true;
          this.y++;
          this.p1.haveBall = false;
          this.p2.haveBall = true;
          if (this.x >= this.p2.x + this.w) {
            this.x -= 0.5;
          } else if (this.x <= this.p2.x) {
            this.x += 0.5;
          }
          if (this.y >= this.p2.y - 5 && this.p2.haveBall) {
            inputKeys[83] = false;
            this.passing = false;
          }
        } else if (
          this.y <= this.p3.y &&
          (this.p2.haveBall || this.p3.haveBall) //p2 passing to p3
        ) {
          this.passing = true;
          this.y++;
          this.p2.haveBall = false;
          this.p3.haveBall = true;
          if (this.x >= this.p3.x + this.w) {
            this.x -= 0.5;
          } else if (this.x <= this.p3.x) {
            this.x += 0.5;
          }
          if (this.y >= this.p3.y - 5 && this.p3.haveBall) {
            inputKeys[83] = false;
            this.passing = false;
          }
        }
      }
      if (inputKeys[87]) { //passing upwards
        if (this.p3.haveBall && this.y > this.p3.y) { //p3 passing to p2
          this.p3passingtop2 = true;
        }
        if (this.p3passingtop2) {
          this.passing = true;
          this.y--;
          this.p2.haveBall = true;
          this.p3.haveBall = false;
          if (this.x >= this.p2.x + this.w) {
            this.x -= 0.5;
          } else if (this.x <= this.p2.x) {
            this.x += 0.5;
          }
          if (this.y <= this.p2.y && this.p2.haveBall) {
            inputKeys[87] = false;
            this.p3passingtop2 = false;
            this.passing = false;
          }
        } else if (
          this.y >= this.p1.y &&
          (this.p1.haveBall || this.p2.haveBall)
        ) { //p2 passing to p1
          this.passing = true;
          this.y--;
          this.p2.haveBall = false;
          this.p1.haveBall = true;
          if (this.x >= this.p1.x + this.w) {
            this.x -= 0.5;
          } else if (this.x <= this.p1.x) {
            this.x += 0.5;
          }
          if (this.y <= this.p1.y + 5 && this.p1.haveBall) {
            inputKeys[87] = false;
            this.passing = false;
          }
        }
      }

      //if players switch positions
      if (this.p1.y > this.p2.y) {
        let temp = this.p1;
        this.p1 = this.p2;
        this.p2 = temp;
      }
      if (this.p2.y > this.p3.y) {
        let temp = this.p2;
        this.p2 = this.p3;
        this.p3 = temp;
      }

      if (this.x >= 890) { //if ball crosses end zone line player wins
        this.won = true;
        this.p2.haveBall = false;
        this.p3.haveBall = false;
        //console.log("Won")
        this.goalSound.play();
        this.game.gameRunning = false;
        this.gameMusic.pause();
      }
      var lArray = arrayOfCollisions;
      var lArrayLength = arrayOfCollisions.length; //check collisions
      for (var i = 0; i < lArrayLength; i++) {
        if (lArray[i] instanceof Player) {
          if (
            this.x >= lArray[i].x - 5 &&
            this.x <= lArray[i].x + lArray[i].w + 10 &&
            this.y >= lArray[i].y - 5 &&
            this.y <= lArray[i].y + lArray[i].h + 5
          ) {
            if (!inputKeys[83] && !inputKeys[87] && lArray[i].haveBall) {
              this.x = lArray[i].x + lArray[i].w;
              this.y = lArray[i].y + lArray[i].h / 2 - 10;
            }
          } //collison between player and ball
          for (var j = 0; j < lArrayLength; j++) { //collision between player and enemy
            if (lArray[j] instanceof Enemy) {
              if (
                lArray[i].x + lArray[i].w >= lArray[j].x &&
                lArray[i].x <= lArray[j].x + lArray[j].w &&
                ((lArray[i].y >= lArray[j].y &&
                  lArray[i].y <= lArray[j].y + lArray[j].h - 10) ||
                  (lArray[i].y + lArray[i].h >= lArray[j].y + 10 &&
                    lArray[i].y + lArray[i].h <= lArray[j].y + lArray[j].h))
              ) {
                if (lArray[i].haveBall) { //if player with ball is hit game is over
                  //console.log("Player with ball hit enemy")
                  this.lost = true;
                  lArray[i].moving = false;
                } else {
                  //console.log("Player hit enemy")
                  lArray[i].moving = false;
                  lArray[j].moving = false;
                }
              }
            }
          }
        }
        if (lArray[i] instanceof Enemy) { //if enemy ctaches the ball game is over
          if (
            this.x >= lArray[i].x - 5 &&
            this.x <= lArray[i].x + lArray[i].w + 5 &&
            this.y >= lArray[i].y - 5 &&
            this.y <= lArray[i].y + lArray[i].h + 5
          ) {
            this.lost = true;
          }
          if (this.reset) {
            lArray[i].x = 800; 
          }
        }
      }
    }
    if (this.lost) {
      //console.log("Lost")
      this.p2.haveBall = false;
      this.p3.haveBall = false;
      this.gameMusic.pause();
      this.game.gameRunning = false;
    }
  }

  draw(ctx) {
    var ballImg = new Image();
    ballImg.src = "assets/images/ball_football.png"; //ball image
    var ballImg2 = new Image();
    ballImg2.src = "assets/images/ball_football2.png"; //ball image rotated

    if (this.tickCountx >= 20 && this.passing && !this.lost)
      ctx.drawImage(ballImg, this.x, this.y);
    else {
      ctx.drawImage(ballImg2, this.x, this.y);
    }
    if (this.game.gameRunning) {
      ctx.beginPath();
      ctx.font = "25px Ariel";
      ctx.fillStyle = "Black";
      ctx.fillText(" Score: Lebanon: 8 || Italy 9", 700, 590);
    }
    if (!this.lost && !this.won && !this.game.gameRunning) {
      ctx.beginPath();
      ctx.font = "25px Impact";
      ctx.fillStyle = "Black";
      ctx.fillText(
        "You are playing in the rugby world cup final and this is the last attack of the match",
        50,
        30
      );
      ctx.fillText("You need to score on this attack or you will lose", 50, 80);
      ctx.fillText("The hope of your country lies on your shoulder", 50, 160);
      ctx.fillText("Press space to start, use the arrow to move", 50, 190);
      ctx.fillText("W to pass upwards and S for downwards ", 50, 220);
      ctx.fillText("P to Pause and C to continue ", 50, 250);
      ctx.fillText("Good Luck!!!!", 50, 280);
    } else if (this.lost) {
      ctx.beginPath();
      ctx.font = "25px Impact";
      ctx.fillStyle = "Red";
      ctx.fillText(
        "Your country has lost the world cup final, better luck next time",
        50,
        160
      );
      ctx.fillText("Press r to reset", 50, 190);
      ctx.fillText(" Score: Lebanon: 8 || Italy 9", 700, 590);
    } else if (this.won) {
      ctx.beginPath();
      ctx.font = "25px Impact";
      ctx.fillStyle = "Blue";
      ctx.fillText(
        "Congrats, your country has Won the world cup final",
        50,
        160
      );
      ctx.fillText("Press r to reset", 50, 190);
      ctx.fillText(" Score: Lebanon: 12 || Italy 9", 700, 590);
    }
  }
}

class Player extends Sprite {
  constructor(pX = 0, pY = 0, haveBall, number, game) {
    super();
    this.x = pX;
    this.y = pY;
    this.h = 35;
    this.w = 20;
    this.haveBall = haveBall;
    this.nb = number;
    this.game = game;
    this.moving = true;
  }
  update() {
    if (this.game.gameRunning) {
      if (this.haveBall && this.moving) { //move player controled by user
        if (inputKeys[37]) {
          if (this.x >= 0) this.x -= 0.75;
        }
        if (inputKeys[38]) {
          if (this.y >= 25) this.y -= 0.75;
        }
        if (inputKeys[39]) {
          if (this.x + this.w <= 950) this.x += 0.75;
        }
        if (inputKeys[40]) {
          if (this.y + this.h <= 575) this.y += 0.75;
        }
      }
      if (!this.haveBall && this.moving) { //move player not ocntrolled by user
        if (this.x + this.w <= 950) {
          this.x += 0.6;
        }
      }
    }
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.beginPath();
    var playerImg = new Image();
    if (this.haveBall) playerImg.src = "assets/images/player.png";
    else playerImg.src = "assets/images/playerBlue.png";
    ctx.drawImage(playerImg, this.x, this.y);
  }
}
class Enemy extends Sprite {
  constructor(pX = 0, pY = 0, game, nb, ball) {
    super();
    this.x = pX;
    this.y = pY;
    this.h = 35;
    this.w = 20;
    this.nb = nb;
    this.game = game;
    this.ball = ball;
    this.turn = false;
    this.moving = true;
    // this.angle = 0;
    // this.offset = 60;
    // this.scalar = 20;
  }
  update() {
    if (this.game.gameRunning) {
      //to move charachter based on sin
      //this.y = 40 + Math.sin(this.angle) * this.scalar;
      //this.angle += 0.12
      if (this.moving) { //moe enemies
        if (this.x > this.ball.x) {
          this.turn = false;

          if (this.x > 90 && this.nb == 1) {
            this.x -= 0.63;
          } else if (this.x > 90 && this.ball.x > 400 && this.nb == 2) {
            this.x -= 0.58;
          } else if (this.x > 90 && this.ball.x > 600 && this.nb == 3) {
            this.x -= 0.53;
          }
        } else if (this.x < this.ball.x - 30) {
          this.x += 0.3;
          this.turn = true;
        }
      }
    }
  }
  draw(ctx) {
    ctx.beginPath();
    var enemyImg = new Image();
    if (!this.turn) {
      enemyImg.src = "assets/images/enemy.png";
    } else {
      enemyImg.src = "assets/images/enemyTurned.png";
    }
    ctx.drawImage(enemyImg, this.x, this.y);
  }
}
window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();
