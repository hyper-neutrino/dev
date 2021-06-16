window.onload = function() {
  var win_audio = new Audio("/static/2048/media/fairy-tail-wow.mp3");
  
  var grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

  var won = false;
  var lost = false;

  function copy(matrix) {
    var n = [];
    for (var row of matrix) {
      n.push([...row]);
    }
    return n;
  }

  function gencell() {
    var filled = true;

    for (var x = 0; x < 4; x++) {
      for (var y = 0; y < 4; y++) {
        if (grid[x][y] == 0) filled = false;
      }
    }

    if (filled) return;

    var value = Math.random() > 0.9 ? 4 : 2;

    while (true) {
      var x = Math.floor(Math.random() * 4);
      var y = Math.floor(Math.random() * 4);
      if (grid[x][y] == 0) {
        grid[x][y] = value;
        return;
      }
    }
  }

  function update() {
    for (x = 0; x < 4; x++) {
      for (y = 0; y < 4; y++) {
        var element = document.getElementById("c" + (x + 1) + (y + 1));
        element.innerHTML = grid[x][y] == 0 ? "" : grid[x][y] + "";
        if (grid[x][y] < 16384) {
          element.className = "v" + grid[x][y];
        } else {
          element.className = "large";
        }
      }
    }

    for (x = 0; x < 4; x++) {
      for (y = 0; y < 4; y++) {
        if (!won && grid[x][y] == 2048) {
          setTimeout(() => {
            win_audio.play();
            alert("Congratulations!");
          }, 100);
          won = true;
        }
      }
    }
  }

  function pull() {
    var oldgrid = copy(grid);

    for (var x = 0; x < 4; x++) {
      var nze = [];
      var q = 0;
      for (var e of grid[x]) {
        if (e != 0) {
          if (e == q) {
            nze.push(e * 2);
            q = 0;
          } else {
            if (q != 0) nze.push(q);
            q = e;
          }
        }
      }
      if (q != 0) nze.push(q);
      for (var y = 0; y < 4; y++) {
        grid[x][y] = 0;
      }

      for (var i in nze) {
        grid[x][i] = nze[i];
      }
    }

    for (var x = 0; x < 4; x++) {
      for (var y = 0; y < 4; y++) {
        if (grid[x][y] != oldgrid[x][y]) return true;
      }
    }
    return false;
  }

  function checkdeath() {
    var dead = true;
    for (var x = 0; x < 2; x++) {
      rotate();
      for (var row of grid) {
        if (row[0] == row[1] || row[1] == row[2] || row[2] == row[3]) {
          dead = false;
        }
        for (var e of row) {
          if (e == 0) dead = false;
        }
      }
    }
    rotate();
    rotate();
    if (dead) {
      setTimeout(() => alert("You lost!"), 100);
      lost = true;
    }
  }

  function rotate() {
    var ng = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

    for (var x = 0; x < 4; x++) {
      for (var y = 0; y < 4; y++) {
        ng[x][y] = grid[3 - y][x];
      }
    }

    grid = ng;
  }

  gencell();
  update();

  document.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
      case 37:
        if (pull()) gencell();
        update();
        break;
      case 38:
        rotate(); rotate(); rotate();
        if (pull()) gencell();
        rotate();
        update();
        break;
      case 39:
        rotate(); rotate();
        if (pull()) gencell();
        rotate(); rotate();
        update();
        break;
      case 40:
        rotate();
        if (pull()) gencell();
        rotate(); rotate(); rotate();
        update();
        break;
    }
    if (!lost) checkdeath();
  });
}