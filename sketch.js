let spriteSheet;

let walkingAnimation;

let spriteSheetFilenames = ["bugSprite_1.png", "bugSprite_2.png", "bugSprite_3.png", "bugSprite_4.png"];
let spriteSheets = [];
let animations = [];
let squish = [];

const GameState = {
  Start: "Start",
  Playing: "Playing",
  GameOver: "GameOver"
};

let game = {score: 0, maxScore: 0, maxTime: 30, elapsedTime: 0, totalSprites: 15, state: GameState.Start};

function preload() {
  for(let i = 0; i < 3; i++) {
    spriteSheets[i] = loadImage("assets/" + spriteSheetFilenames[i]);
    squish = loadImage("assets/bugSquished.png");
  }
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);
  angleMode(DEGREES);
  
  reset();
}

function reset() {
  game.elapsedTime = 0;
  game.score = 0;
  game.totalSprites = random(10,30);
  

  animations = [];
  for(let i = 0; i < game.totalSprites; i++) {
    animations[i] = new WalkingAnimation(random(spriteSheets), 80, 80, random(100,300), random(100,300), 3, random(0.5,1), 6, random([0,1]));
  }
}

function draw() {
  switch(game.state) {
    case GameState.Playing:
      background(120);
  
      for(let i = 0; i < animations.length; i++) {
        animations[i].draw();
      }
      
      fill(0);
      textSize(40);
      text(game.score,20,40);
      let currentTime = game.maxTime - game.elapsedTime;
      text(ceil(currentTime), 300, 40);
      game.elapsedTime += deltaTime / 1000;

      if (currentTime < 0)
        game.state = GameState.GameOver;
      break;

    case GameState.GameOver:
      game.maxScore = max(game.score,game.maxScore);

      background(0);
      fill(255);
      textSize(40);
      textAlign(CENTER);
      text("Game Over!", 200, 200);
      textSize(35);
      text("Bugs Squished: " + game.score, 200, 270);
      text("Max Bugs Squished: " + game.maxScore, 200, 320);
      break;

    case GameState.Start:
      background(0);
      fill(255);
      textSize(50);
      textAlign(CENTER);
      text("The", 200, 100);
      text("Bugged", 200, 145);
      text("Bug Squish", 200, 200);
      text("Game", 200, 255);
      textSize(30);
      text("Press Any Key to Start", 200, 325);
      break;
  }
  
}

function keyPressed() {
  switch(game.state) {
    case GameState.Start:
      game.state = GameState.Playing;
      break;
    case GameState.GameOver:
      reset();
      game.state = GameState.Playing;
      break;
  }
}

function mousePressed() {
  switch(game.state) {
    case GameState.Playing:
      for (let i=0; i < animations.length; i++) {
        let contains = animations[i].contains(mouseX,mouseY);
        if (contains) {
          if (animations[i].moving != 0) {
            animations[i].stop();
            game.score += 1;
            speed += 1;
          }
          else {
            if (animations[i].xDirection === 1)
              animations[i].moveRight();
            else
              animations[i].moveLeft();
          }
        }
      }
      break;
  }
  
}

class WalkingAnimation {
  constructor(spritesheet, sw, sh, dx, dy, animationLength, speed, framerate, vertical = false, offsetX = 0, offsetY = 0) {
    this.spritesheet = spritesheet;
    this.sw = sw;
    this.sh = sh;
    this.dx = dx;
    this.dy = dy;
    this.u = 0;
    this.v = 0;
    this.animationLength = animationLength;
    this.currentFrame = 0;
    this.moving = 1;
    this.xDirection = 1;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.speed = speed;
    this.framerate = framerate*speed;
    this.vertical = vertical;
  }

  draw() {

    this.u = (this.moving != 0) ? this.currentFrame % this.animationLength : 0;

    push();
    translate(this.dx, this.dy);
    if (this.vertical)
      rotate(90);
    scale(this.xDirection, 1);
    

    image(this.spritesheet, 0, 0, this.sw, this.sh, this.u * this.sw + this.offsetX, this.v * this.sh + this.offsetY, this.sw, this.sh);
    pop();

    let proportionalFramerate = round(frameRate() / this.framerate);
    if (frameCount % proportionalFramerate == 0) {
      this.currentFrame++;
    }
  
    if (this.vertical) {
      this.dy += this.moving * this.speed;
      this.move(this.dy, this.sw / 4, height - this.sw / 4);
    }
    else {
      this.dx += this.moving * this.speed;
      this.move(this.dx, this.sw / 4, width - this.sw / 4);
    }
    

  }

  move(position,lowerBounds,upperBounds) {
    if (position > upperBounds) {
      this.moveLeft();
    } 
    else if (position < lowerBounds) {
      this.moveRight();
    }
  }

  moveRight() {
    this.moving = 1;
    this.xDirection = 1;
    this.v = 0;
  }

  moveLeft() {
    this.moving = -1;
    this.xDirection = -1;
    this.v = 0;
  }

  keyPressed(right, left) {
    if (keyCode === right) {
      this.currentFrame = 1;
    } 
    else if (keyCode === left) {
      this.currentFrame = 1;
    }
  }

  keyReleased(right,left) {
    if (keyCode === right || keyCode === left) {
      this.moving = 0;
    }
  }

  contains(x,y) {
    let insideX = x >= this.dx - 25 && x <= this.dx + 25;
    let insideY = y >= this.dy - 35 && y <= this.dy + 35;
    return insideX && insideY;
  }

  stop() {
    this.spritesheet = squish;
    this.moving = 0;
  }
}