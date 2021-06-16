var rows = [];
var held = [];

document.addEventListener("keydown", function(event) {
  var key = "[" + event.keyCode + "]&nbsp;" + event.key + "&nbsp;";
  rows.push(key + "down");
  held[event.keyCode] = key;
  while (rows.length > 50) {
    rows = rows.slice(1);
  }
  document.getElementById("left").innerHTML = held.filter(x => x).join("<br />");
  document.getElementById("right").innerHTML = rows.join("<br />");
  event.preventDefault(true);
});

document.addEventListener("keyup", function(event) {
  var key = "[" + event.keyCode + "]&nbsp;" + event.key + "&nbsp;";
  rows.push(key + "up");
  delete held[event.keyCode];
  while (rows.length > 50) {
    rows = rows.slice(1);
  }
  document.getElementById("left").innerHTML = held.filter(x => x).join("<br />");
  document.getElementById("right").innerHTML = rows.join("<br />");
  event.preventDefault(true);
});