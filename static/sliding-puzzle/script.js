window.onload = function() {
  var size = parseInt(document.getElementById("size").getAttribute("data-size"));
  
  var shuffled = false;
  
  var e = [...document.querySelectorAll("td")];
  
  var blank = size * size - 1;
  
  function swap(target, check) {
    if (target !== undefined && 0 <= target && target < size * size && (Math.floor(target / size) == Math.floor(blank / size) || target % size == blank % size)) {
      var t = e[target].innerHTML;
      e[target].innerHTML = e[blank].innerHTML;
      e[blank].innerHTML = t;
      
      t = target;
      target = blank;
      blank = t;
    } else {
      return;
    }
    
    if (!check) return;
    
    if (blank == size * size - 1 && shuffled) {
      for (var i = 0; i < size * size - 1; i++) {
        if (parseInt(e[i].innerHTML) != i + 1) {
          return;
        }
      }
      window.setTimeout(function() { alert("Congratulations!"); }, 100);
      
      shuffled = false;
    }
    
  }
  
  document.addEventListener("keydown", function(event) {
    var target;
    
    switch(event.keyCode) {
      case 37:
        target = blank + 1;
        break;
      case 38:
        target = blank + size;
        break;
      case 39:
        target = blank - 1;
        break;
      case 40:
        target = blank - size;
        break;
      case 32:
        for (var x = 0; x < 1000; x++) {
          var t;
          var r = Math.random();

          if (r < 0.25) {
            t = blank + 1;
          } else if (r < 0.5) {
            t = blank + size;
          } else if (r < 0.75) {
            t = blank - 1;
          } else {
            t = blank - size;
          }

          swap(t, false);
          
          shuffled = true;
        }
        break;
    }
    
    swap(target, true);
    
    if (target !== undefined) event.preventDefault();
  });
}