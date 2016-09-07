/* If set, (x, y) is the coordinate square the Queen
 * was dragged from.
 */
var Mug = {
  x: null,
  y: null,
  isSet: function() {
    return this.x !== null && this.y !== null;
  }
};
var threatened = false;
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

function highlightSquare(x, y) {
  var coords = String(x+1) + "-" + String(y+1);
  var ele = document.querySelectorAll("[data-value='" + coords + "']")[0];
  /* If Queen at (x, y), mark it as threatened square */
  if (Board[x][y] == 1) {
    threatened = true;
    ele.className = "square threatened-square";
  } else {
    if ((x + y) % 2 === 0) {
      ele.className = "square overlay-light-square";
    } else {
      ele.className = "square overlay-dark-square";
    }
  }
}

function unhighlightSquare(x, y) {
  var coords = String(x+1) + "-" + String(y+1);
  var ele = document.querySelectorAll("[data-value='" + coords + "']")[0];
  ele.className = "square";
}

/* Highlights all squares threatened by a Queen at (i, j) on `Board` */
function highlightSquares(i, j) {
  /* Highlight Row */
  for (p = 0; p < 8; p++) {
    if (p != j) {
      highlightSquare(i, p);
    }
  }
  /* Highlight Column */
  for (p = 0; p < 8; p++) {
    if (p != i) {
      highlightSquare(p, j);
    }
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
      highlightSquare(x, y);
    }
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
      highlightSquare(x, y);
    }
    x += 1;
    y += 1;
  }
}

function unhighlightBoard() {
  for (i = 0; i < 8; i++) {
    for (j = 0; j < 8; j++) {
      unhighlightSquare(i, j);
    }
  }
}

/* Highlight squares threatened by all the Queens on board */
function highlightBoard() {
  var queenCount = 0;
  for (i = 0; i < 8; i++) {
    for (j = 0; j < 8; j++) {
      if (Board[i][j] == 1) {
        highlightSquares(i, j);
        queenCount += 1;
      }
    }
  }

  if (queenCount == 8 && !threatened) {
    alert("Voila! You did it!");
  }
}

function corvoAttano() {
  /* Transfer Data to another element */
  var data = event.dataTransfer.getData("text");
  var ele = document.getElementById(data);
  event.target.appendChild(ele);

  /* Unset value in Board for the dragStart square */
  if (Mug.isSet()) {
    Board[Mug.x][Mug.y] = 0;
    unhighlightBoard();
    Mug.x = null;
    Mug.y = null;
  }
  highlightBoard();
}

var dragStart = function (event) {
  event.dataTransfer.setData("text", event.target.id);

  var parentEle = event.target.parentElement;

  /* Store data-value of `square` if queen is being dragged from a square */
  if (parentEle.className.includes("square")) {
    var coords = parentEle.dataset.value.split("-");
    var x = parseInt(coords[0]) - 1;
    var y = parseInt(coords[1]) - 1;
    Mug.x = x;
    Mug.y = y;
  } else {
    Mug.x = null;
    Mug.y = null;
  }
};

var drag = function(event) {
  console.log("dragging");
};

var dragOver = function (event) {
  event.preventDefault();
};

var squareDrop = function (event) {
  event.preventDefault();
  threatened = false;

  /* Calculate coordinates of drop square */
  var coords = event.target.dataset.value.split("-");
  var x = parseInt(coords[0]) - 1;
  var y = parseInt(coords[1]) - 1;

  /* If square is already taken */
  if (Board[x][y] == 1) {
    return false;
  }

  /* Set value in Board for the current square */
  Board[x][y] = 1;

  corvoAttano();
};

var throneDrop = function(event) {
  event.preventDefault();
  corvoAttano();
};

/* Add Event Listeners to Thrones */
var throneList = document.getElementsByClassName("throne");

for (i = 0; i < throneList.length; i++) {
  throneList[i].addEventListener("dragover", dragOver, false);
  throneList[i].addEventListener("drop", throneDrop, false);
}

/* Add Event Listeners to Queens */
var queenList = document.getElementsByClassName("queen");

for (i = 0; i < queenList.length; i++) {
  queenList[i].addEventListener("dragstart", dragStart, false);
}

/* Add Event Listeners to Squares */
var squareList = document.getElementsByClassName("square");

for (i = 0; i < squareList.length; i++) {
  squareList[i].addEventListener("dragover", dragOver, false);
  squareList[i].addEventListener("drop", squareDrop, false);
}