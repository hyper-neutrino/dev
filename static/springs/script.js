window.onload = function() {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.font = "15px monospace";

  var objects = [];
  var springs = [];

  var sim = true;
  var grav = false;
  var bounce = true;

  var odx = 0;
  var sdx = 0;

  // 0: sx, 1: sy, 2: vx, 3: vy, 4: mx, 5: my, 6: f

  function selectnum(message, f) {
    var cv;
    do {
      var t = prompt(message);
      if (t === null) return null;
      cv = parseInt(t);
    } while (isNaN(cv) || !f(cv));
    return cv;
  }

  function fixodx(dir = 1) {
    var ogx = odx;
    while (objects[odx] === undefined) {
      odx = (odx + objects.length + dir) % objects.length;
      if (odx == ogx) break;
    }
  }

  function fixsdx(dir = 1) {
    var sgx = sdx;
    while (springs[sdx] === undefined) {
      sdx = (sdx + springs.length + dir) % springs.length;
      if (sdx == sgx) break;
    }
  }

  document.addEventListener("keydown", function(event) {
    console.log(event.keyCode);
    switch (event.keyCode) {
      case 8:
        delete objects[odx];
        var t = [];
        for (var i in springs) {
          var spr = springs[i];
          if (odx == spr[0] || odx == spr[1]) {
            delete springs[i];
          }
        }
        fixodx(1);
        fixsdx(1);
        break;
      case 37:
        objects[odx][4] = -5;
        break;
      case 38:
        objects[odx][5] = -5;
        break;
      case 39:
        objects[odx][4] = 5;
        break;
      case 40:
        objects[odx][5] = 5;
        break;
      case 66:
        bounce = !bounce;
        break;
      case 68:
        delete springs[sdx];
        break;
      case 70:
        sim = !sim;
        break;
      case 71:
        grav = !grav;
        break;
      case 72:
        if (springs.length === 0) break;
        sdx = (sdx + springs.length - 1) % springs.length;
        fixsdx(-1);
        break;
      case 74:
        if (objects.length === 0) break;
        odx = (odx + objects.length - 1) % objects.length;
        fixodx(-1);
        break;
      case 75:
        if (objects.length === 0) break;
        odx = (odx + 1) % objects.length;
        fixodx(1);
        break;
      case 76:
        if (springs.length === 0) break;
        sdx = (sdx + 1) % springs.length;
        fixsdx(1);
        break;
      case 78:
        var x = selectnum("x-coordinate (10 to 790)", a => (a >= 10) && (a <= 790));
        if (x === null) break;
        var y = selectnum("y-coordinate (10 to 490)", a => (a >= 10) && (a <= 490));
        if (y === null) break;
        objects.push([x, y, 0, 0, 0, 0, 1]);
        break;
      case 82:
        springs[sdx][2] = Math.hypot(objects[springs[sdx][0]][0] - objects[springs[sdx][1]][0], objects[springs[sdx][0]][1] - objects[springs[sdx][1]][1]);
        break;
      case 83:
        var s1 = selectnum("first object (0 to " + (objects.length - 1) + ")", a => (a >= 0) && (a < objects.length) && (objects[a] !== undefined));
        if (s1 === null) break;
        var s2 = selectnum("second (different) object (0 to " + (objects.length - 1) + ")", a => (a >= 0) && (a < objects.length) && (a != s1) && (objects[a] !== undefined));
        if (s2 === null) break;
        var sl = selectnum("length of spring (defaults to the distance between the two objects (press ESC))", a => (a >= 0));
        springs.push([s1, s2, sl === null ? Math.hypot(objects[s1][0] - objects[s2][0], objects[s1][1] - objects[s2][1]) : sl]);
        break;
      case 90:
        objects[odx][6] = 1 - objects[odx][6];
    }
  });

  document.addEventListener("keyup", function(event) {
    switch (event.keyCode) {
      case 37:
        objects[odx][4] = 0;
        break;
      case 38:
        objects[odx][5] = 0;
        break;
      case 39:
        objects[odx][4] = 0;
        break;
      case 40:
        objects[odx][5] = 0;
        break;
    }
  });

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function animate() {
    if (sim) {
      for (var spr of springs) {
        if (spr === undefined) continue;
        var dx = objects[spr[0]][0] - objects[spr[1]][0];
        var dy = objects[spr[0]][1] - objects[spr[1]][1];
        var d = Math.hypot(dx, dy);
        var ddr = (spr[2] - d) / d * 0.01;
        objects[spr[0]][2] += ddr * dx;
        objects[spr[0]][3] += ddr * dy;
        objects[spr[1]][2] -= ddr * dx;
        objects[spr[1]][3] -= ddr * dy;
      }

      for (var obj of objects) {
        if (obj === undefined) continue;
        if (grav) obj[3] += 1;
        obj[2] *= 0.97;
        obj[3] *= 0.97;

        if (obj[6] === 0) obj[2] = obj[3] = 0;

        obj[0] += obj[2];
        obj[1] += obj[3];

        if (bounce) {
          if (obj[0] < 10) {
            obj[0] = 10;
            obj[2] *= -1;
          } else if (obj[0] > 790) {
            obj[0] = 790;
            obj[2] *= -1;
          }

          if (obj[1] < 10) {
            obj[1] = 10;
            obj[3] *= -1;
          } else if (obj[1] > 490) {
            obj[1] = 490;
            obj[3] *= -1;
          }
        }
      }
    }

    for (var obj of objects) {
      if (obj === undefined) continue;
      obj[0] += obj[4];
      obj[1] += obj[5];
    }

    clear();

    for (var i in springs) {
      var spr = springs[i];
      if (spr === undefined) continue;
      ctx.strokeStyle = (i == sdx) ? "#00c0c0" : "#000000";
      ctx.beginPath();
      ctx.moveTo(objects[spr[0]][0], objects[spr[0]][1]);
      ctx.lineTo(objects[spr[1]][0], objects[spr[1]][1]);
      ctx.stroke();
      ctx.closePath();
    }

    for (var i in objects) {
      var obj = objects[i];
      if (obj === undefined) continue;
      ctx.fillStyle = (i == odx) ? "#c0c000" : "#000000";
      ctx.beginPath();
      ctx.arc(obj[0], obj[1], 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
      ctx.fillText("" + i, obj[0] + 25, obj[1]);
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}