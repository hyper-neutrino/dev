window.onload = function() {
  var m1 = document.getElementById("m1");
  var m2 = document.getElementById("m2");
  
  var paused = true;
  var started = false;
  
  var time = 0;
  
  document.addEventListener("keydown", function(event) {
    if (event.keyCode == 32) {
      if (!started) {
        started = true;
        window.setInterval(function() {
          if (paused) {
            m1.innerHTML = "Paused";
            m2.innerHTML = Math.floor(time / 60000) + ":" + (Math.floor(time % 60000 / 1000) + "").padStart(2, "0");
          } else {
            if (time <= 315000) time += 100;

            m1.innerHTML = Math.floor(time / 60000) + ":" + (Math.floor(time % 60000 / 1000) + "").padStart(2, "0");

            if (time <= 30000) {
              m2.innerHTML = "Protected Time";
            } else if (time <= 270000) {
              m2.innerHTML = "";
            } else if (time <= 300000) {
              m2.innerHTML = "Protected Time";
            } else if (time < 315000) {
              m2.innerHTML = "Grace Period";
            } else {
              m1.innerHTML = "Time's Up!";
              m2.innerHTML = "";
            }
          }
        }, 100);
      }
      paused = !paused;
    }
  });
}