var rwm = rwm || {};

const $player = $('.player');

rwm.damage = function damage(){
  if (!this.damaged) {
    this.damaged = true;
    $('.counter').css('color', 'orange');
    $player.css('background-color', 'orange');
    if (this.shield) {
      this.shield.css('background-color', 'orange');
    }
    if (rwm.shieldCounter.length === 0){
      rwm.toggleSong();
      alert('GAME OVER!');
    } else {
      rwm.shield.css('opacity', rwm.shieldCounter.pop());
    }
    setTimeout(function(){
      rwm.damaged = false;
      $player.css('background-color', '#555');
      rwm.shield.css('background-color', '#FFF');
      $('.counter').css('color', '#FFF');
    }, 100);
  }
};

console.log($player.offset());

rwm.position = function position(item){
  return item.offset();
};

rwm.leftLength = function leftLength(item){
  return item.offset().left;
};

rwm.rightLength = function rightLength(item){
  return item.offset().left + item.width();
};

rwm.topHeight = function topHeight(item){
  return item.offset().top;
};

rwm.bottomHeight = function bottomHeight(item){
  return item.offset().top + item.height();
};

rwm.centerLength = function centerLength(item){
  return item.offset().left + 0.5 * item.width();
};

rwm.centerHeight = function centerHeight(item){
  return item.offset().top + 0.5 * item.height();
};

rwm.y = function y(item) {
  return item.height();
};

rwm.x = function x(item) {
  return item.width();
};

rwm.rgb = function rgb(r, g, b){
  r = Math.floor(r);
  g = Math.floor(g);
  b = Math.floor(b);
  return ['rgb(',r,',',g,',',b,')'].join('');
};

rwm.checkCollision = function checkCollision(item){
  if (rwm.topHeight(item) < 240 && rwm.topHeight($player) < rwm.bottomHeight(item)) {
    rwm.damage();
  } else if (rwm.topHeight(item) > 240 && rwm.bottomHeight($player) > rwm.topHeight(item)) {
    rwm.damage();
  }
};

const flowDuration = 1800;

rwm.flow = function flow(item){
  item.animate({
    left: '-100px'
  }, {
    duration: flowDuration,
    easing: 'linear'
  });
};

rwm.flowDetect = function flowDetect(item){
  item.animate({
    left: '-100px'
  }, {
    duration: flowDuration,
    easing: 'linear',
    step: function() {
      if (rwm.rightLength($player) > rwm.leftLength(item) && rwm.leftLength($player) < rwm.rightLength(item)) {
        rwm.checkCollision(item);
      }
    }
  });
};

rwm.projectDetect = function projectDetect(item){
  item.animate({
    left: '-100px'
  }, {
    duration: flowDuration,
    easing: 'linear',
    step: function() {
      if (rwm.rightLength(rwm.attackRadius) > rwm.leftLength(item) && rwm.leftLength(rwm.attackRadius) < rwm.rightLength(item)) {
        item.remove();
      }
      if (rwm.rightLength($player) > rwm.leftLength(item) && rwm.leftLength($player) < rwm.rightLength(item)) {
        rwm.checkCollision(item);
      }
      item.css('top', 330 + (1 / (((rwm.leftLength(item) - rwm.rightLength($player)) / 600) + 1) * (rwm.topHeight($player) + 0.5 * rwm.y($player) - 0.5 * rwm.y(item) - 330)));
    }
  });
};

rwm.shieldFollow = function shieldFollow(item){
  item.animate({
    'background-color': '#FFF'
  }, {
    duration: 1000000,
    easing: 'linear',
    step: function() {
      item.css('top', rwm.topHeight($player) + 0.5 * rwm.y($player) - 0.5 * rwm.y(item));
      item.css('left', rwm.centerLength($player) - 35);
    }
  });
};

rwm.jump = function jump(item) {
  item.animate({
    top: '156px',
    height: '40px',
    width: '30px'
  },{
    complete: function() {
      item.animate({
        top: '306px',
        height: '60px',
        width: '20px'
      }, 150, 'easeInQuad');
    }
  }, {
    duration: 150
  }, 'easeOutQuad');
};

rwm.generateBottomObstacleOne = function generateBottomObstacleOne(){
  setTimeout(function(){
    console.log('bottom obstacle generated');
    const $obstacle = $('<div class="obstacle bottomObstacle"></div>');
    $('body').append($obstacle).bind(this);
    const $pit = $('<div class="obstacle pit"></div>');
    $('body').append($pit).bind(this);
    $pit.css('background-color', rwm.rgb(rwm.musicBarCount, 255, 255 - rwm.musicBarCount));
    rwm.flowDetect($obstacle);
    rwm.flow($pit);
  },100);
};

rwm.generateBottomObstacleTwo = function generateBottomObstacleTwo(){
  setTimeout(function(){
    console.log('tall bottom obstacle generated');
    const $obstacle = $('<div class="obstacle bottomObstacleTwo"></div>');
    $('body').append($obstacle).bind(this);
    rwm.flowDetect($obstacle);
  },100);
};

rwm.generateTopObstacle = function generateTopObstacle(){
  setTimeout(function(){
    console.log('top obstacle generated');
    const $obstacle = $('<div class="obstacle topObstacle"></div>');
    $('body').append($obstacle).bind(this);
    rwm.flowDetect($obstacle);
  },1);
};

rwm.generateProjectile = function generateProjectile(){
  console.log('projectile generated');
  const $projectile = $('<div class="obstacle projectile"></div>');
  $('body').append($projectile).bind(this);
  this.projectDetect($projectile);
};

rwm.generateShield = function generateShield() {
  rwm.shield = $('<div class="playerShield"></div>');
  $('body').append(rwm.shield).bind(this);
  this.shieldFollow(this.shield);
  this.generateShieldArray();
  console.log(rwm.shieldCounter);
};

rwm.generateShieldArray = function generateShieldArray(){
  for (var i = 0; i < 0.6; i+=0.2) {
    this.shieldCounter.push(i);
    console.log(this.shieldCounter);
  }
};

rwm.musicBarCount = 0;

rwm.generateMusicBar = function generateMusicBar(){
  setInterval(function(){
    rwm.musicBarCount += 1;
    console.log('music bar', rwm.musicBarCount, 'generated');
    const $obstacle = $('<div class="musicBar"></div>');
    document.getElementById('counter').innerHTML = rwm.musicBarCount;
    $('body').append($obstacle);
    rwm.flow($obstacle);
  } ,465);
};

rwm.generate = function generate(e){
  if (e.keyCode === 49) {//pressed key[1]
    this.generateBottomObstacleOne();
  } else if (e.keyCode === 50) {//pressed key[2]
    this.generateBottomObstacleTwo();
  } else if (e.keyCode === 51) {//pressed key[3]
    this.generateTopObstacle();
  } else if (e.keyCode === 52) {//pressed key[4]
    this.generateProjectile();
  } else if (e.keyCode === 56) {//pressed key[8]
    this.generateShield();
  } else if (e.keyCode === 57) {//pressed key[9]
    this.generateMusicBar();
  }
};

rwm.playerInputDown = function playerInputDown(e){//pressed key[up]
  if (!this.pressed) {
    this.pressed = true;
    if (e.keyCode === 87 || e.keyCode === 38 || e.keyCode === 32) {//pressed key[up]...
      this.jumpKey = true;
      $player.stop();
      $player.clearQueue();
      this.jump($player);
    } else if (e.keyCode === 83 || e.keyCode === 40) {//pressed key[down]...
      $player.stop();
      $player.clearQueue();
      $player.animate({
        top: '346px',
        height: '20px',
        width: '40px'
      }, 100);
    } else if (e.keyCode === 79 || e.keyCode === 80) {//pressed key[o]...
      rwm.attackRadius.remove();
      console.log('player attacked');
      this.attackRadius = $('<div class="playerAttackRadius"></div>');
      $('body').append(this.attackRadius);
      $player.animate({
        left: '70px'
      }, 50, 'linear');
      $player.animate({
        left: '50px'
      }, 50, 'linear');
      setTimeout(function(){
        rwm.attackRadius.remove();
      }, 100);
    } else if (e.keyCode === 67) {//pressed key[c]
      rwm.toggleSong();
      alert('Game Control:\n - jump: [w] or [up] or [space]\n - sneak: [s] or [down]\n - attack: [o] or [p]\n - generate obstacles: [1] ~ [3]\n - generate projectiles: [4]');
    }
  }
};

rwm.playerInputUp = function playerInputUp(e){
  this.pressed = false;
  if (e.keyCode === 83 || e.keyCode === 40) {
    $player.animate({
      top: '306px',
      height: '60px',
      width: '20px'
    }, 200);
  }
};

rwm.setup = function setup() {
  $(document).keydown(this.playerInputDown.bind(this));
  $(document).keydown(this.generate.bind(this));
  $(document).keyup(this.playerInputUp.bind(this));
  rwm.shieldCounter = [];
};

$(rwm.setup.bind(rwm));

rwm.attackRadius = $('<div class="playerAttackRadius"></div>');
$('body').append(rwm.attackRadius);
setTimeout(function(){
  rwm.attackRadius.remove();
}, 200);

rwm.obstaclesGenerator = function obstaclesGenerator() {
  if (!this.generated) {
    this.generated = true;
    if (this.vol >= 0.36 && this.vol < 0.38 ) {
      this.generateTopObstacle();
    }
    if (this.vol >= 0.38 && this.vol < 0.40 ) {
      this.generateBottomObstacleTwo();
    }
    if (this.vol > 0.40 && this.vol < 0.42 ) {
      this.generateBottomObstacleOne();
    }
    if (this.vol >= 0.42 && this.vol < 0.44 ) {
      this.generateProjectile();
    }
    if (this.vol > 0.44 && this.vol < 0.46 ) {
      this.generateBottomObstacleOne();
    }
    if (this.vol >= 0.46 && this.vol < 0.47 ) {
      this.generateTopObstacle();
    }
    if (this.vol >= 0.47 && this.vol < 0.49 ) {
      this.generateBottomObstacleTwo();
    }
    if (this.vol > 0.49 && this.vol < 0.50 ) {
      this.generateBottomObstacleOne();
    }
    if (this.vol >= 0.50 && this.vol < 0.57 ) {
      this.generateProjectile();
    }
    if (this.vol >= 0.57 && this.vol < 0.63 ) {
      this.generateTopObstacle();
    }
    if (this.vol >= 0.63 && this.vol < 0.70 ) {
      this.generateBottomObstacleTwo();
    }
  }
  if (!this.generatedMusicBar) {
    this.generatedMusicBar = true;
    this.generateShield();
    this.generateMusicBar();
  }
  setTimeout(function(){
    rwm.generated = false;
  }, 100);
};

//AUDIO ANALYSIS:

var song;
var amp;

var volHistory = [];

rwm.toggleSong = function toggleSong() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
};

function preload() {
  song = loadSound('music/bgm.mp3');
}

function setup() {
  createCanvas(1366, 366);
  song.play();
  amp = new p5.Amplitude();
  window.addEventListener('keydown', function(e) {
    if(e.keyCode == 32 && e.target == document.body) {
      e.preventDefault();
    }
    if(e.keyCode == 83 && e.target == document.body) {
      e.preventDefault();
    }
  });
}

// $('.simulation').on('click', function(){
//   console.log('simulation');
// })
//
// $('.microphone').on('click', function(){
//   console.log(microphone);
// })

function draw() {
  background(rwm.musicBarCount, 255, 255 - rwm.musicBarCount);
  rwm.vol = amp.getLevel();
  volHistory.push(rwm.vol);
  if (rwm.vol > 0.44) {
    console.log(rwm.vol);
    rwm.obstaclesGenerator();
  };
  var volIndex = 1 - rwm.vol/2;
  stroke(200 * (volIndex), 200 * (volIndex), 200 * (volIndex));
  fill(200 * (volIndex), 200 * (volIndex), 200 * (volIndex));
  beginShape();
  for (var i = 0; i < volHistory.length; i++) {
    var y = map(volHistory[i], 0, 0.7, height, 0);
    rect(6 * i, 0, 5, y);
  }
  endShape();

  if (volHistory.length > 1/6 * width) {
    volHistory.splice(0, 1);
  }

}
