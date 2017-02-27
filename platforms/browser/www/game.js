var canvas;
var intervalId;
var draw;

var point;
var score = 0;
var degradeTicks = 0;
var degradeMax = 50;
var degradeCount = degradeMax;
var degradeMin = 20;

var lastScore = -1;

var effectGoodColor = '200,200,200';
var effectBadColor = '244,67,54';
var effectColor = effectGoodColor;
var effect = 0;

var spaceColor = '#212121';
var spaceColorRgb = '33,33,33';
var starColor = '#9E9E9E';
var textColor = '#E0E0E0';
var textColorRgb = '224,224,224';
var quadOpacity = '0.1';
var tlQuad = 'rgba(244,67,54,' + quadOpacity + ')';
var trQuad = 'rgba(33,150,243,' + quadOpacity + ')';
var blQuad = 'rgba(76,175,80,' + quadOpacity + ')';
var brQuad = 'rgba(255,235,59,' + quadOpacity + ')';

var tapStartFade = 0.2;
var tapStartFadeMin = 0.2;
var tapStartFadeMax = 1;
var tapStartFadeVel = 0.05;

var menuFadeMin = 0.2;
var menuFadeMax = 1;
var menuFade = menuFadeMin;
var menuFadeVel = 0.05;

var starFadeOffsetMin = 0.8;
var starFadeOffsetMax = 1;
var starFadeOffset = starFadeOffsetMax;
var starFadeOffsetVel = 0.01;

var reinitRequested = false;

var stars = [];

function init() {
  canvas = document.getElementById('graphics');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw = drawMenu;
  canvas.addEventListener('touchstart', tap, false);
  nextPoint();
  draw();
  for (var i = 0; i < random(20) + 30; i++) {
    stars.push({x: random(canvas.width), y: random(canvas.height),
        r: random(3) + 2});
  }

  intervalId = window.setInterval(tick, 50);
  alert(canvas.width, canvas.height);
}

function reinit() {
  reinitRequested = false;
  draw = drawMenu;
  lastScore = score;
  degradeCount = degradeMax;
  effectColor = effectGoodColor;
  menuFade = menuFadeMin;
  score = 0;
  nextPoint();
  draw();
}

function tap(e) {
  var p = {x: e.touches[0].clientX, y: e.touches[0].clientY};
  if (draw == drawGame) {
    if (effectColor !== effectBadColor) {
      var tappedQuad = getQuad(p);
      var correctQuad = getQuad(point);
      if (tappedQuad === correctQuad) {
        score++;
        effect = 10;
        nextPoint();
      } else {
        effectColor = effectBadColor;
        effect = 20;
      }
    }
  } else {
    draw = drawGame;
    draw();
  }
}

function tick() {
  if (draw == drawGame) {
    if (effect != 0) {
      effect--;
    }
    if (effectColor != effectBadColor) {
      starFadeOffset += starFadeOffsetVel;
      if (starFadeOffset > starFadeOffsetMax || starFadeOffset < starFadeOffsetMin)
        starFadeOffsetVel = -starFadeOffsetVel;
      degradeTicks++;
      if (degradeTicks > degradeCount) {
        if (score > 0)
          score--;
        if (degradeCount > degradeMin)
          degradeCount--;
        degradeTicks = 0;
      }
    }
    draw();
  } else {
    if (menuFade < menuFadeMax)
      menuFade += menuFadeVel;
    else {
      tapStartFade += tapStartFadeVel;
      if (tapStartFade > tapStartFadeMax || tapStartFade < tapStartFadeMin)
        tapStartFadeVel = -tapStartFadeVel;
    }
    draw();
  }
}

var drawMenu = function() {
  var g = canvas.getContext('2d');
  g.fillStyle = 'rgba(' + spaceColorRgb + ', ' + menuFade + ')';
  g.fillRect(0, 0, canvas.width, canvas.height);

  var ry = canvas.height / 2 - 100;
  g.fillStyle = textColor;
  g.font = '48px Roboto, Arial';
  g.textAlign = 'center';
  g.fillText('Quads', canvas.width / 2, ry += 50);

  g.fillStyle = 'rgba(' + textColorRgb + ', ' + tapStartFade + ')';
  g.font = '28px Roboto, Arial';
  g.fillText('Tap to play!', canvas.width / 2, ry += 50);

  if (lastScore >= 0) {
    g.fillStyle = textColor;
    g.font = '20px Roboto, Arial';
    g.fillText('Last Score: ' + lastScore, canvas.width / 2, ry += 50);
  }
}

var drawGame = function() {
  var g = canvas.getContext('2d');
  g.fillStyle = spaceColor;
  g.fillRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < stars.length; i++) {
    var star = stars[i];
    g.fillStyle = starColor;
    fillCircle(g, star.x, star.y, star.r * starFadeOffset);
  }

  g.fillStyle = tlQuad;
  g.fillRect(0, 0, canvas.width / 2, canvas.height / 2);

  g.fillStyle = trQuad;
  g.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height / 2);

  g.fillStyle = blQuad;
  g.fillRect(0, canvas.height / 2, canvas.width / 2, canvas.height / 2);

  g.fillStyle = brQuad;
  g.fillRect(canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2);

  g.fillStyle = '#FFF';
  fillCircle(g, point.x, point.y, 10);

  g.font = '28px Robot, Arial';
  g.textAlign = 'center';
  g.fillText(score, canvas.width / 4, 30);

  if (effect != 0) {
    g.fillStyle='rgba(' + effectColor + ', ' + (effect / 20) + ')';
    g.fillRect(0, 0, canvas.width, canvas.height)
  } else if (effectColor === effectBadColor && !reinitRequested) {
    window.setTimeout(reinit, 300);
    reinitRequested = true;
  }
}

function nextPoint() {
  point = {x: random(canvas.width), y: random(canvas.height)}
}

function fillCircle(g, x, y, r) {
  g.beginPath();
  g.arc(x, y, r, 0, 2 * Math.PI, false);
  g.fill();
}

function random(max) {
  return Math.floor(Math.random() *  max);
}

function getQuad(p) {
  var quad = (p.x < canvas.width / 2) ? 0 : 1;
  quad += (p.y < canvas.height / 2) ? 0 : 2;
  return quad;
}
