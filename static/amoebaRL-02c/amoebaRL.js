// amoebaRL by starinfidel@gmail.com

// IE
if (document.all)
  document.onkeypress = handleKeyPress;
else
  document.onkeyup = handleKeyPress;


// virtual screen size in characters
var screenSizeX = 30;
var screenSizeY = 19;

// player and game parameters
var playerX = 14, playerY = 9;
var playerLevel = 1;
var playerAte = 0;
var playerGrown = 0;
var playerTurns = 0;
var gamesTotal = 0;
var gamesWon = 0;
var gamesLost = 0;

// 0: ingame, 1: player lost, 2: player won
var gameState = 0;

// array of painted cells - used for smart screen repaint
var paintedCells = new Array();

// array of amoebas
var amoebas = new Array();

// array of corpses
var corpses = new Array();

// array of stones
var stones = new Array();


// init everything

function init()
{
  gameState = 0;
  playerTurns = 0;
  playerLevel = 1;
  playerX = 14;
  playerY = 9;
  amoebas = new Array();
  corpses = new Array();
  stones = new Array();

  // init virtual screen
  initScreen();

  // init stones
  initStones();

  // init amoebas
  initAmoebas();

  repaintScreen();
  
  window.focus();
}


// inits amoebas

function initAmoebas()
{
  for (var i = 0; i < 10; i++)
    spawnAmoeba();
}


// inits stones

function initStones()
{
  for (var i = 0; i < 10; i++)
    {
      var s = new Object();

      s.x = parseInt(Math.random() * screenSizeX);
      s.y = parseInt(Math.random() * screenSizeY);
      
      stones.push(s);
    }
}


// init cell divs for virtual screen

function initScreen()
{
  var screen = document.getElementById("divScreen");

  var s = '';
  var cellW = 20;
  var cellH = 20;

  for (var y = 0; y < screenSizeY; y++)
    for (var x = 0; x < screenSizeX; x++)
      {
	var divX = 8 + getPositionX(screen) + x * cellW;
	var divY = 5 + getPositionY(screen) + y * cellH;

        s += '<div id="c' + x + '_' + y +
	  '" style="color:gray;position:absolute; width:' + cellW + 
	  '; height:' + cellH + '; left: ' + 
	  divX + '; top: ' + divY + ';">.</div>';
      }

  screen.innerHTML = s;
}


// paint symbol in a cell

function paint(x, y, sym, col)
{
  var s = 'c' + x + '_' + y;
  var c = document.getElementById(s);
  
  if (c == null)
    window.alert(s + ' is null!');
  c.style.color = col;
  c.innerHTML = sym;

  // add cell to array of painted cells
  paintedCells.push(s);
}


// clear virtual screen

function clearScreen()
{
  for (var y = 0; y < screenSizeY; y++)
    for (var x = 0; x < screenSizeX; x++)
      paint(x, y, '.', 'gray');

  paintedCells = new Array();
}


// clear virtual screen only where needed

function clearScreenSmart()
{
  for (var i = 0; i < paintedCells.length; i++)
    {
      var c = document.getElementById(paintedCells[i]);
      c.innerHTML = '.';
      c.style.color = 'gray';
    }

  paintedCells = new Array();
}


// repaint virtual screen

function repaintScreen()
{
  // paint corpses
  for (var i = 0; i < corpses.length; i++)
    {
      var a = corpses[i];
      paint(a.x, a.y, '~', 'cyan');
    }

  // paint stones
  for (var i = 0; i < stones.length; i++)
    {
      var s = stones[i];
      paint(s.x, s.y, '*', '#707070');
    }

  // paint amoebas
  for (var i = 0; i < amoebas.length; i++)
    {
      var a = amoebas[i];
      
      var col = 'white';
      if (a.level > playerLevel || a.level == 9)
        col = '#ff0000';
      else if (a.level < playerLevel)
        col = '#00ff00';
      paint(a.x, a.y, a.level, col);
    }

  // paint player
  // game continues
  if (gameState == 0)
    {
      var col = 'white';
      
      if (playerAte)
        col = '#ffff00';
      if (playerGrown > 0)
        col = '#00ffff';
      else if (playerGrown < 0)
	col = '#ff0000';
    
      paint(playerX, playerY, '<b>@</b>', col);
    }

  // player dead
  else paint(playerX, playerY, 'X', '#ff0000');

  var colGrown = 'color:white';
  if (playerGrown > 0)
    colGrown = 'color:#00ff00;';
  else if (playerGrown < 0)
    colGrown = 'color:#ff0000;';

  
  var status = document.getElementById('divStatus');
  status.innerHTML =
    '<table width=100%><tr><td halign=left><span style="padding:5;' +
    colGrown + '">Level: ' + playerLevel + '</span>' +
    '<td>' +
    '<p style="color:white; text-align:right;">Turns: ' + playerTurns + '</p>' +
    '<td halign=right>' +
    '<p style="text-align:right; margin-right:5">' + 
    'Games: ' + gamesTotal +
    '&nbsp;&nbsp;Won: ' + gamesWon +
    '&nbsp;&nbsp;Lost: ' + gamesLost + '</span></table>';

  playerAte = 0;
  playerGrown = 0;
}


// handle next key press

function handleKeyPress(e)
{
  var keyCode = 0;
  
  // IE
  if (document.all)
    keyCode = event.keyCode;

  // Opera, FF
  else
    {
      keyCode = e.keyCode;

      // FF Space Key
      if (e.charCode == 32)
        keyCode = 32;

      // FF keyCode unset
      if (e.keyCode == 0)
        keyCode = e.charCode; 
    }
    
  realHandleKeyPress(keyCode);
}


// handle next key press for real

function realHandleKeyPress(keyCode)
{
  // game finished
  if (gameState > 0)
    {
      // space
      if (keyCode != 32) return;
      
      init();

      return;
    }

  var x = playerX, y = playerY;

  // up
//  window.status = 'c:' + e.charCode + ' k:' + e.keyCode;
//  window.alert('c:' + e.charCode + ' k:' + e.keyCode);
  if (keyCode == 38 || keyCode == 56 || keyCode == 75 || keyCode == 104)
    y--;

  // down
  else if (keyCode == 40 || keyCode == 50 || keyCode == 74 || keyCode == 98)
    y++;

  // left
  else if (keyCode == 37 || keyCode == 52 || keyCode == 72 || keyCode == 100)
    x--;

  // right
  else if (keyCode == 39 || keyCode == 54 || keyCode == 76 || keyCode == 102)
    x++;

  // ul
  else if (keyCode == 36 || keyCode == 55 || keyCode == 89 || keyCode == 103)
    {
      x--;
      y--;
    }

  // ur
  else if (keyCode == 33 || keyCode == 57 || keyCode == 85 || keyCode == 105)
    {
      x++;
      y--;
    }

  // dl
  else if (keyCode == 35 || keyCode == 49 || keyCode == 66 || keyCode == 97)
    {
      x--;
      y++;
    }

  // dr
  else if (keyCode == 34 || keyCode == 51 || keyCode == 78 || keyCode == 99)
    {
      x++;
      y++;
    }

  // space
  else if (keyCode == 32)
    {}

  else return;

  // screen bounds check
  if (x < 0 || y < 0 || x >= screenSizeX || y >= screenSizeY)
    return;

  // stone collission check
  if (cellHasStone(x, y))
    return;

  playerX = x;
  playerY = y;
  playerTurns++;

  // check for battle with amoebas
  handlePlayer();

  // clear and repaint screen
  clearScreenSmart();

  if (gameState == 0)
    {
      // amoebas ai
      handleAmoebas();

      // check for battle with amoebas again because of the amoeba movement
      handlePlayer();
    }

  repaintScreen();

  // game finished
  if (gameState > 0)
    gameFinished();
}


// stone collission check

function cellHasStone(x, y)
{
  for (var i = 0; i < stones.length; i++)
    {
      var s = stones[i];

      if (s.x == x && s.y == y) return true;
    }

  return false;
}


// finish game

function gameFinished()
{
  var screen = document.getElementById('divScreen');

  if (gameState == 1)
    screen.innerHTML =
      '<div style="margin-top:180; color:#ff0000"><center><b>You lose. Press SPACE to restart.</b></center></div>';
  else
    {
      var bestTurns = getCookie('amoebaRL.bestTurns');

      // reset record
      if (playerTurns < bestTurns || bestTurns == null)
        setCookie('amoebaRL.bestTurns', playerTurns);

      if (bestTurns == null)
        bestTurns = playerTurns;

      screen.innerHTML =
        '<div style="margin-top:180;"><center>' +
        '<b>You win in ' + playerTurns + ' turns. ' +
	(playerTurns < bestTurns ?
	  "You set a new record!" :
	  "Best record: " + bestTurns + ' turns.') +
        '<br>Press SPACE to restart.</b></center></div>';
    }
}


// check for battle with some amoeba

function handlePlayer()
{
  for (var i = 0; i < amoebas.length; i++)
    {
      var a = amoebas[i];
      
      if (a.x != playerX || a.y != playerY)
        continue;

      // player is higher level, he wins and grows
      // player is same level, 50% chance he wins and grows
      if (a.level <= playerLevel && a.level < 9)
        {
          // kill amoeba
	  amoebas.splice(i, 1);
	  
	  corpses.push(a);

	  // player is same level, 66% chance he grows
	  if (a.level < playerLevel ||
	      (a.level == playerLevel && Math.random() < 0.66))
	    {
	      playerLevel++;
	      playerGrown = 1;
	    }

	  playerAte = 1;

	  // player won
	  if (playerLevel > 9)
	    {
	      gameState = 2;

	      gamesTotal++;
	      gamesWon++;
	    }
	}

      // player is lower level, he dies
      else
        {
	  gameState = 1;

	  gamesTotal++;
	  gamesLost++;
	}

      break;
    }  
}


// handle amoebas movement and attacks

function handleAmoebas()
{
  for (var i = 0; i < amoebas.length; i++)
    {
      var a = amoebas[i];
      var modx = 0, mody = 0;

      // greater level amoeba always sniffs player
      if (a.level > playerLevel || a.level == 9)
        {
	  if (playerX - a.x != 0)
	    modx = (playerX - a.x) / Math.abs(playerX - a.x);
	  if (playerY - a.y != 0)
	    mody = (playerY - a.y) / Math.abs(playerY - a.y);

	  if (cellHasStone(a.x + modx, a.y + mody))
	    continue;
	}

      // random movement
      else
        {
	  modx = - 1 + parseInt(Math.random() * 3);
	  mody = - 1 + parseInt(Math.random() * 3);

	  if (a.x + modx < 0 || a.x + modx >= screenSizeX)
  	    modx = 0;

	  if (a.y + mody < 0 || a.y + mody >= screenSizeY)
  	    mody = 0;

	  if (a.x + modx == playerX && a.y + mody == playerY)
	    continue;
	    
	  if (cellHasStone(a.x + modx, a.y + mody))
	    continue;
	}

      a.x += modx;
      a.y += mody;

      // check for an amoeba on this cell
      for (var j = 0; j < amoebas.length; j++)
	{
	  var aa = amoebas[j];
	  if (i == j || aa.x != a.x || aa.y != a.y)
	    continue;

	  // second one is stronger
	  if (aa.level > a.level)
	    {
	      amoebas.splice(i, 1);
	      aa.level++;

	      corpses.push(a);

	      if (aa.level > 9)
	        aa.level = 9;
	    }

	  // first one is stronger
	  else if (a.level > aa.level)
	    {
	      amoebas.splice(j, 1);
	      a.level++;

	      corpses.push(aa);

	      if (a.level > 9)
	        a.level = 9;
	    }

	  // same level - both die
	  else
	    {
	      amoebas.splice(i, 1);
	      amoebas.splice(j, 1);

	      corpses.push(a);
	      corpses.push(aa);
	    }

	  break;
	}
    }

  // spawn new amoebas
  var len = amoebas.length;
  if (amoebas.length < 9 + playerLevel)
    for (var i = 0; i <= 9 + playerLevel - len; i++)
      spawnAmoeba();
}


// spawn amoeba

function spawnAmoeba()
{
  var a = new Object();

  // spawn everywhere at start
  if (playerLevel == 1)
    {
      a.x = parseInt(Math.random() * screenSizeX);
      a.y = parseInt(Math.random() * screenSizeY);
    }

  // spawn only at screen edges
  else
    {
      if (Math.random() > 0.5)
        {
          a.x = (Math.random() > 0.5 ? 0 : screenSizeX - 1);
	  a.y = parseInt(Math.random() * screenSizeY);
	}
      else
        {
          a.x = parseInt(Math.random() * screenSizeX);
          a.y = (Math.random() > 0.5 ? 0 : screenSizeY - 1);
	}
    }

  var rnd = Math.random();

  // at start of the game
  if (playerLevel == 1)
    {
      if (rnd < 0.1)
	a.level = playerLevel + 1;
      else a.level = playerLevel;
    }

  // at the end of the game
  else if (playerLevel == 9)
    {
      if (rnd < 0.3)
	a.level = 9;
      else a.level = 8;
    }

  // later
  else
    {
      if (rnd < 0.05)
        a.level = playerLevel + 2;
      else if (rnd < 0.15)
        a.level = playerLevel + 1;
      else a.level = playerLevel;
    }

  if (a.level > 9)
    a.level = 9;

  amoebas.push(a);
}
