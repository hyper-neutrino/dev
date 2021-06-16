window.onload = function() {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");

  let ph = 10;
  let py = 450;
  let pv = 10;

  var pw = 200;
  var px = 350;

  var pl = false;
  var pr = false;

  let br = 6;

  var bs = 8;

  var hits = 0;

  var ball = [350, 250, 0, bs];

  var running = true;

  var score = 0;
  var finished = false;

  var halved = false;

  var blocks = [];

  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 14; j++) {
      blocks.push([j, i, 7 - 2 * Math.floor(i / 2)]);
    }
  }

  document.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
      case 32:
        running = !running;
        break;
      case 37:
        pl = true;
        break;
      case 39:
        pr = true;
        break;
    }
  });

  document.addEventListener("keyup", function(event) {
    switch (event.keyCode) {
      case 37:
        pl = false;
        break;
      case 39:
        pr = false;
        break;
    }
  });

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function ybounce(yd) {
    ball[2] = Math.max(Math.min(ball[2] + (Math.random() - 0.5) * 6, 5), -5);
    ball[3] = yd * Math.sqrt(Math.pow(bs, 2) - Math.pow(ball[2], 2));
  }

  function xbounce(xd) {
    ball[3] = Math.max(Math.min(ball[3] + (Math.random() - 0.5) * 6, 5), -5);
    ball[2] = xd * Math.sqrt(Math.pow(bs, 2) - Math.pow(ball[3], 2));
  }

  function animate() {
    clear();

    if (running) {
      px += (pl ? -pv : 0) + (pr ? pv : 0);
      px = Math.max(Math.min(px, canvas.width - pw / 2), pw / 2);
      ball[0] += ball[2];
      ball[1] += ball[3];

      if (ball[0] > px - pw / 2 && ball[0] < px + pw / 2 && ball[1] + br > py && ball[1] + br < py + ph) {
        ball[1] = py - br;
        hits += 1;

        ybounce(-1);
      }

      if (ball[0] - br < 0) {
        ball[0] = br;
        ball[2] = -ball[2];
      } else if (ball[0] + br > canvas.width) {
        ball[0] = canvas.width - br;
        ball[2] = -ball[2];
      }

      if (ball[1] - br < 0) {
        ball[1] = br;
        ball[3] = -ball[3];
        if (!halved) {
          pw /= 2;
          halved = true;
        }
      }

      if (ball[1] + br > canvas.height) {
        running = false;
      }

      var allgone = true;

      for (var i = 0; i < 112; i++) {
        if (blocks[i] === undefined) continue;

        allgone = false;
        var sd = 0;
        if (ball[0] > blocks[i][0] * 50 && ball[0] < blocks[i][0] * 50 + 50 && ball[1] + br > blocks[i][1] * 15 && ball[1] + br < blocks[i][1] * 15 + 9) {
          ball[1] = blocks[i][1] * 15 - br;
          ybounce(-1);
          sd = blocks[i][2];
          delete blocks[i];
        } else if (ball[0] > blocks[i][0] * 50 && ball[0] < blocks[i][0] * 50 + 50 && ball[1] - br < blocks[i][1] * 15 + 15 && ball[1] - br > blocks[i][1] * 15 + 6) {
          ball[1] = blocks[i][1] * 15 + 15 + br;
          ybounce(1);
          sd = blocks[i][2];
          delete blocks[i];
        } else if (ball[1] > blocks[i][1] * 15 && ball[1] < blocks[i][1] * 15 + 15 && ball[0] + br > blocks[i][0] * 50 && ball[0] + br < blocks[i][0] * 50 + 9) {
          ball[0] = blocks[i][0] * 50 - br;
          xbounce(-1);
          sd = blocks[i][2];
          delete blocks[i];
        } else if (ball[1] > blocks[i][1] * 15 && ball[1] < blocks[i][1] * 15 + 15 && ball[0] - br < blocks[i][0] * 50 + 50 && ball[0] - br > blocks[i][0] * 50 + 41) {
          ball[0] = blocks[i][0] * 50 + 50 + br;
          xbounce(1);
          sd = blocks[i][2];
          delete blocks[i];
        }

        score += sd;
      }

      if (allgone) {
        blocks = [];

        for (var i = 0; i < 8; i++) {
          for (var j = 0; j < 14; j++) {
            blocks.push([j, i, 7 - 2 * Math.floor(i / 2)]);
          }
        }
      }
    }

    ctx.font = "50px monospace";
    ctx.fillStyle = "#333333";
    ctx.fillText(score + "", 300, 300);

    ctx.fillStyle = "#000000";
    ctx.fillRect(px - pw / 2, py, pw, ph);
    ctx.beginPath();
    ctx.arc(ball[0], ball[1], br, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    for (var block of blocks) {
      if (block === undefined) continue;
      ctx.fillStyle = ["", "#ddbb00", "", "#008800", "", "#dd8800", "", "#aa0000"][block[2]];
      ctx.fillRect(block[0] * 50 + 1, block[1] * 15 + 1, 48, 13);
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}