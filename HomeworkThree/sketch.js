let spriteSheet;
let sx = 0;
let sy = 0;
let sw = 80;
let sh = 80;
let u = 0; v = 0;
let animationLength = 9;
let currentFrame = 0;
let x = 200;
let moving = 0;
let xDirection = 1;
let walkingAnimation;
let walkingAnimation2;

function preload() {
  spriteSheet = loadImage("assets/SpelunkyGuy.png");
  spriteSheet2 = loadImage("assets/Green.png")
}

function setup() {
  createCanvas(550, 450);
  imageMode(CENTER);

  walkingAnimation = new WalkingAnimation(spriteSheet, 80, 80, 200, 200, 9);
  walkingAnimation2 = new WalkingAnimation(spriteSheet2, 80, 80, 100, 300, 9);
}

function draw() {
  background(180, 250, 250);

  walkingAnimation.draw();
  walkingAnimation2.draw();
}

function keyPressed(){
  walkingAnimation.keyPressed(RIGHT_ARROW, LEFT_ARROW, DOWN_ARROW, UP_ARROW);
  walkingAnimation2.keyPressed(LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW);
}

function keyReleased(){
  walkingAnimation.keyReleased(RIGHT_ARROW, LEFT_ARROW, DOWN_ARROW, UP_ARROW);
  walkingAnimation2.keyReleased(LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW);
}

class WalkingAnimation{
  constructor(spritesheet, sw, sh, dx, dy, animationLength, offsetX = 0, offsetY = 0){
    this.spritesheet = spritesheet;
    this.sw = sw;
    this.sh = sh;
    this.dx = dx;
    this.dy = dy;
    this.u = 0;
    this.v = 0;
    this.animationLength = animationLength;
    this.currentFrame = 0;
    this.moving = 0;
    this.xDirection = 1;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  draw(){
    this.u = (this.moving != 0) ? this.currentFrame % this.animationLength : 0;
    push();
    translate(this.dx, this.dy);
    scale(this.xDirection, 1);

    image(this.spritesheet, 0, 0, this.sw, this.sh, this.u * this.sw + this.offsetX, this.v * this.sh + this.offsetY, this.sw, this.sh)
    pop();

    if (frameCount % 6 == 0) {
      this.currentFrame++;
    }

    this.dx += this.moving;
  }

  keyPressed(right, left, up, down) {
    if (keyCode === right) {
      this.moving = 1;
      this.xDirection = 1;
      this.currentFrame = 1;
    }
    else if (keyCode === left){
      this.moving = -1;
      this.xDirection = -1;
      this.currentFrame = 1;
    }
    else if (keyCode === up){
      this.moving = 1;
      this.xDirection = 1;
      this.currentFrame = 1;
    }
    else if (keyCode === down) {
      this.moving = -1;
      this.xDirection = -1;
      this.currentFrame =1;
    }
  }

  keyReleased(right, left, up, down) {
    if (keyCode === right || keyCode === left || keyCode === up || keyCode === down) {
      this.moving = 0;
    }
  }
}