var DARK_SQUARE = "rgb(179, 86, 0)"; // #b35600
var LIGHT_SQUARE = "rgb(255, 202, 153)"; // #ffca99
//var OVERLAY_DARK_SQUARE = "rgb(128, 62, 0)"; // #803e00
//var OVERLAY_LIGHT_SQUARE = "rgb(255, 215, 179)"; // #ffb066
var OVERLAY_DARK_SQUARE = "rgb(0, 0, 0)"; // #803e00
var OVERLAY_LIGHT_SQUARE = "rgb(255, 255, 255)"; // #ffb066

var Mug = {
  x: null,
  y: null
};
var Dropped = false;
var Board = new Array(8);

for (i = 0; i < 8; i++) {
  Board[i] = new Array(8);
}

/* Initialize Board */
for (i = 0; i < 8; i++) {
  for (j = 0; j < 8; j++) {
    Board[i][j] = 0;
  }
}

/* Highlights/unhighlights a coordinate (x, y) */
function highlightCoord(x, y) {
  var coords = String(x+1) + "-" + String(y+1);
  var ele = document.querySelectorAll("[data-value='" + coords + "']")[0];
  var eleBgColor = getComputedStyle(ele, null).getPropertyValue("background-color");
  if (Board[x][y] == 1) {
    ele.style.backgroundColor = "rgb(255, 0, 0)";
  } else {
    if ((x + y) % 2 === 0) {
      ele.style.backgroundColor = OVERLAY_LIGHT_SQUARE;
    } else {
      ele.style.backgroundColor = OVERLAY_DARK_SQUARE;
    }
  }
}

function unhighlightCoord(x, y) {
  var coords = String(x+1) + "-" + String(y+1);
  var ele = document.querySelectorAll("[data-value='" + coords + "']")[0];
  var eleBgColor = getComputedStyle(ele, null).getPropertyValue("background-color");
  if ((x + y) % 2 === 0) {
    ele.style.backgroundColor = LIGHT_SQUARE;
  } else {
    ele.style.backgroundColor = DARK_SQUARE;
  }
}

/* Highlights/Unhighlights all squares threatened by
 * a Queen at (i, j)
 */
function highlightSquares(i, j) {
  /* Highlight Row */
  for (p = 0; p < 8; p++) {
    if (p != j) {
      highlightCoord(i, p);
    } else {console.log(i, p);}
  }
  /* Highlight Column */
  for (p = 0; p < 8; p++) {
    if (p != i) {
      highlightCoord(p, j);
    } else {console.log(p, j);}
  }
  /* Highlight Forward Diagonal */
  var x, y;
  var sum = i + j;
  if (sum < 7) {
    x = 0; y = sum;
  } else if (sum > 7) {
    x = sum - 7; y = 7;
  } else {
    x = 0; y = 7;
  }
  var a = x, b = y;
  while (x <= b) {
    if (x != i && y != j) {
      highlightCoord(x, y);
    }  else {console.log(x, y);}
    x += 1;
    y -= 1;
  }
  /* Highlight Backward Diagonal */
  if (i < j) {
    x = 0; y = j - i;
  } else if (i > j) {
    x = i - j; y = 0;
  } else {
    x = 0; y = 0;
  }
  while (x < 8 && y < 8) {
    if (x != i && y != j) {
      highlightCoord(x, y);
    }  else {console.log(x, y);}
    x += 1;
    y += 1;
  }
}

function unhighlightBoard() {
  for (i = 0; i < 8; i++) {
    for (j = 0; j < 8; j++) {
      unhighlightCoord(i, j);
    }
  }
}

function loopOverBoard() {
  for (i = 0; i < 8; i++) {
    for (j = 0; j < 8; j++) {
      if (Board[i][j] == 1) {
        highlightSquares(i, j);
      }
    }
  }
}

var dragStart = function (event) {
  event.dataTransfer.setData("text", event.target.id);

  /* If queen wasn't dropped before, set Mug
   * values to null.
   */
  if (!Dropped) {
    Mug.x = null;
    Mug.y = null;
  }

  /* Store data-value of square if queen is being dragged
   * from a square.
   */
  var parentEle = event.target.parentElement;
  if (parentEle.className == "square") {
    var coords = parentEle.dataset.value.split("-");
    var x = parseInt(coords[0]) - 1;
    var y = parseInt(coords[1]) - 1;
    Mug.x = x;
    Mug.y = y;
  }
};

var drag = function(event) {
  console.log("dragging");
};

var dragOver = function (event) {
  event.preventDefault();
};

var drop = function (event) {
  event.preventDefault();

  /* Calculate coordinates of drop square */
  var coords = event.target.dataset.value.split("-");
  var x = parseInt(coords[0]) - 1;
  var y = parseInt(coords[1]) - 1;

  /* If square is already taken */
  if (Board[x][y] == 1) {
    return false;
  }

  var data = event.dataTransfer.getData("text");
  var ele = document.getElementById(data);
  event.target.appendChild(ele);

  /* Set Dropped equals true */
  Dropped = true;
  /* Set value in Board for the current square */
  Board[x][y] = 1;
  /* Unset value in Board for the dragStart square */
  if (Mug.x !== null && Mug.y !== null) {
    Board[Mug.x][Mug.y] = 0;
    unhighlightBoard();
    Mug.x = null;
    Mug.y = null;
  }
  loopOverBoard();
};

/* Add Event Listeners to Queens */
var queenList = document.getElementsByClassName("queen");

for (i = 0; i < queenList.length; i++) {
  queenList[i].addEventListener("dragstart", dragStart, false);
}

/* Add Event Listeners to Squares */
var squareList = document.getElementsByClassName("square");

for (i = 0; i < squareList.length; i++) {
  squareList[i].addEventListener("dragover", dragOver, false);
  squareList[i].addEventListener("drop", drop, false);
}