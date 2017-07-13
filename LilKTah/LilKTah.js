"use strict";
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var health = document.getElementById("health");
var score = document.getElementById("score");

var playerImage = new Image();
playerImage.src = "http://pre09.deviantart.net/7ee7/th/pre/f/2013/038/4/0/patrick_star_rainmeter_skin_by_no121else-d5u56i2.png"
var zombieImage = new Image();
zombieImage.src = "http://2.bp.blogspot.com/-rlht3DJHE7Y/UvURp6NXQJI/AAAAAAAABzM/9zV3YJQcZEs/s1600/ZombieWalk_normal_scaled_slower.gif";

function clamp(value, low, high) {
  return Math.max(low, Math.min(high, value));
}

function distanceBetween(p, q) {
  var dx = q.x - p.x;
  var dy = q.y - p.y;
  return Math.sqrt(dx * dx + dy * dy);
}

document.body.onmousemove = function(e) {
  var canvasRect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - canvasRect.left;
  mouse.y = e.clientY - canvasRect.top;
}

class Agent {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
  }
  image(img) {
    ctx.drawImage(img, this.x - this.width / 2, this.y - this.width / 2, this.width, this.width);
  }
  moveToward(target, speed) {
    var dx = target.x - this.x;
    var dy = target.y - this.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 1) return this;
    this.x = clamp(this.x + speed * dx / distance, 0, canvas.width);
    this.y = clamp(this.y + speed * dy / distance, 0, canvas.height);
    return this;
  }
}

class Player extends Agent {
  constructor(x, y) {
    super(x, y, 'green')
    this.alive = true;
    this.speed = 2;
    this.score = 0;
  }
  run() {
    this.moveToward(mouse, this.speed).image(playerImage);
  }
  die() {
    this.alive = false;
  }
  isDead() {
    return !this.alive;
  }
  addScore() {
    this.score += (1 / 30);
  }
}

class Zombie extends Agent {
  constructor() {
    super(Math.random() * canvas.width, Math.random() * canvas.height);
    this.speed = 1;
  }
  hasCollidedWith(agent) {
    return distanceBetween(this, player) < player.width;
  }
  attack(player) {
    this.moveToward(player, this.speed).image(zombieImage);
    if (this.hasCollidedWith(player)) {
      health.value -= 1;
      this.speed -= .008;
    }
    if (health.value === 0) {
      player.die();
    }
  }
}

function addZombie() {
  zombies.push(new Zombie());
}

function continueIfNecessary() {
  if (!player.isDead()) {
    setTimeout(refreshScene, 1000 / 30);
  } else {
    showDeathMessage();
  }
}

function refreshScene() {
  canvas.width = canvas.width;
  player.run()
  player.addScore();
  score.innerHTML = "Score: " + Math.trunc(player.score);
  for (var zombie of zombies) {
    zombie.attack(player);
  }
  continueIfNecessary();
}

var player = new Player(100, 100);
var zombies = [new Zombie(), new Zombie(), new Zombie()];
var mouse = {
  x: player.x,
  y: player.y
};

refreshScene();
setInterval(addZombie, 2000);

function showDeathMessage() {
  ctx.fillStyle = 'red';
  ctx.font = "47px Nosifer";
  ctx.fillText("Lil' K'tah Got You!", 0, canvas.height / 2);
};
