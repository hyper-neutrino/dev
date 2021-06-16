window.onload = function() {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  // Ball will start at the center, always
  // Ball will go to the left initially (at P1)
  // Ball will go towards the losing player starting at the last place it crossed mid with the same velocity before death (meaning the losing player gets a second chance at the shot they missed)

  // Ball will reflect its x-velocity perfectly on hit
  // Ball will reflect its y-velocity perfectly on top/bottom hit
  // Ball will add y-velocity based on paddle movement

  let br = 6;
  let pw = 10;
  let ph = 100;
  let pd = 50;
  let pv = 15;

  // [sx, sy, vx, vy]
  var ball = [canvas.width / 2, canvas.height / 2, 0, Math.random() * 14 - 7];
  ball[2] = -Math.sqrt(100 - Math.pow(ball[3], 2));

  var shadow = ball;

  // Paddle positions (y-value only)
  var p1 = canvas.height / 2;
  var p2 = canvas.height / 2;

  // Paddle movements
  var d1d = false;
  var d1u = false;
  var d2d = false;
  var d2u = false;

  // Scores
  var s1 = 0;
  var s2 = 0;

  var running = true;
  var paused = false;

  document.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
      case 87: // W
        d1u = true;
        break;
      case 83: // S
        d1d = true;
        break;
      case 38: // UP
        d2u = true;
        break;
      case 40: // DOWN
        d2d = true;
        break;
      case 32: // SPACE
        paused = !paused;
        break;
    }
  });

  document.addEventListener("keyup", function(event) {
    switch (event.keyCode) {
      case 87: // W
        d1u = false;
        break;
      case 83: // S
        d1d = false;
        break;
      case 38: // UP
        d2u = false;
        break;
      case 40: // DOWN
        d2d = false;
        break;
    }
  });

  function clearcanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function reset() {
    ball = [...shadow];
  }

  function animate() {
    if (paused) { requestAnimationFrame(animate); return; }

    clearcanvas();
    ctx.fillStyle = "#000000";

    p1 = Math.min(Math.max(p1 + (d1u ? -pv : 0) + (d1d ? pv : 0), ph / 2), canvas.height - ph / 2);
    p2 = Math.min(Math.max(p2 + (d2u ? -pv : 0) + (d2d ? pv : 0), ph / 2), canvas.height - ph / 2);

    if (running) {
      ball[0] += ball[2];
      ball[1] += ball[3];

      if (ball[1] < br) {
        ball[1] = br;
        ball[3] = -ball[3];
      } else if (ball[1] > canvas.height - br) {
        ball[1] = canvas.height - br;
        ball[3] = -ball[3];
      }

      if (ball[0] - br < pd && ball[0] - br > pd - pw && ball[1] + br > p1 - ph / 2 && ball[1] - br < p1 + ph / 2) {
        ball[0] = pd + br;
        ball[3] = Math.max(Math.min(ball[3] + ((d1u ? -1 : 0) + (d1d ? 1 : 0)) * Math.random() * 5, 7), -7);
        ball[2] = Math.sqrt(100 - Math.pow(ball[3], 2));
      }

      if (ball[0] + br > canvas.width - pd && ball[0] + br < canvas.width - pd + pw && ball[1] + br > p2 - ph / 2 && ball[1] - br < p2 + ph / 2) {
        ball[0] = canvas.width - pd - br;
        ball[3] = Math.max(Math.min(ball[3] + ((d2u ? -1 : 0) + (d2d ? 1 : 0)) * Math.random() * 5, 7), -7);
        ball[2] = -Math.sqrt(100 - Math.pow(ball[3], 2));
      }

      if (Math.abs(ball[0] - canvas.width / 2) < 10) {
        shadow = [...ball];
      }

      if (ball[0] < 0) {
        s2++;
        reset();
        running = false;
        setTimeout(() => running = true, 1000);
      }

      if (ball[0] > canvas.width) {
        s1++;
        reset();
        running = false;
        setTimeout(() => running = true, 1000);
      }
    }

    ctx.font = "50px monospace";
    ctx.fillText("" + s1, 200, 100);
    ctx.fillText("" + s2, 550, 100);

    // Animate ball
    ctx.fillRect(ball[0] - br, ball[1] - br, br * 2, br * 2);

    // Animate paddles
    ctx.fillRect(pd - pw, p1 - ph / 2, pw, ph);
    ctx.fillRect(canvas.width - pd, p2 - ph / 2, pw, ph);

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}