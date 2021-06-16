window.onload = function() {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");

  let width = 40;
  let height = 25;

  let rw = 20;
  let rh = 20;

  var ql = 0;

  var snake = [[Math.floor(Math.random() * width), Math.floor(Math.random() * height)]];

  var apple;

  var running = true;

  var done = false;

  function genapple() {
    while (true) {
      apple = [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];
      var valid = true;
      for (var cell of snake) {
        if (apple[0] == cell[0] && apple[1] == cell[1]) {
          valid = false;
          break;
        }
      }
      if (valid) break;
    }
  }

  genapple();

  var dx = 0;
  var dy = 0;

  var nx = 0;
  var ny = 0;

  var qx = 0;
  var qy = 0;

  var score = 0;

  document.addEventListener("keydown", function(event) {
    var cx = 0, cy = 0;
    switch (event.keyCode) {
      case 32:
        running = !running;
        break;
      case 37:
        cx = -1;
        cy = 0;
        break;
      case 38:
        cx = 0;
        cy = -1;
        break;
      case 39:
        cx = 1;
        cy = 0;
        break;
      case 40:
        cx = 0;
        cy = 1;
        break;
      default:
        return;
    }

    if (cx == 0 && cy == 0) return;
    if (!running) return;

    if (dx == 0 && dy == 0) {
      dx = cx;
      dy = cy;
    } else if (nx == 0 && ny == 0) {
      if ((dx == 0) ^ (cx == 0)) {
        nx = cx;
        ny = cy;
      }
    } else if (qx == 0 && qy == 0) {
      if ((nx == 0) ^ (cx == 0)) {
        qx = cx;
        qy = cy;
      }
    }
  });

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function animate() {
    clear();

    if (running) {
      // update snake

      var le = snake[snake.length - 1];

      if (nx != 0 || ny != 0) {
        dx = nx;
        dy = ny;
        nx = qx;
        ny = qy;
        qx = 0;
        qy = 0;
      }

      var nh = [le[0] + dx, le[1] + dy];

      if (nh[0] < 0 || nh[0] >= width || nh[1] < 0 || nh[1] >= height) {
        done = true;
      }

      if (snake.length != 1) {
        for (var cell of snake) {
          if (cell[0] == nh[0] && cell[1] == nh[1]) {
            done = true;
            break;
          }
        }
      }

      if (nh[0] == apple[0] && nh[1] == apple[1]) {
        ql = 3;
        score++;
        genapple();
      }

      snake.push(nh);

      if (ql > 0) {
        ql--;
      } else {
        snake.splice(0, 1);
      }
    }

    ctx.fillStyle = "#00aa00";
    for (var cell of snake) {
      ctx.fillRect(cell[0] * rw + 1, cell[1] * rh + 1, rw - 2, rh - 2);
    }

    ctx.fillStyle = "#aa0000";
    ctx.fillRect(apple[0] * rw + 1, apple[1] * rh + 1, rw - 2, rh - 2);

    if (!done) {
      setTimeout(animate, 75);
    } else {
      alert("You died! Your score was " + score + "!");
    }
  }

  requestAnimationFrame(animate);
}