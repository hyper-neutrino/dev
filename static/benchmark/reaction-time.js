window.onload = function() {
  var total = 0;
  var runs = 0;
  
  var m1 = document.getElementById("m1");
  var m2 = document.getElementById("m2");
  
  var ts = -1;
  
  var timeout;
  
  var trigger1 = function() {
    m1.innerHTML = "";
    m2.innerHTML = "";
    
    document.body.style.backgroundColor = "#f44";
    
    trigger = trigger2;
    
    timeout = window.setTimeout(() => {
      trigger = trigger3;
      ts = Date.now();
      document.body.style.backgroundColor = "#4f4";
    }, Math.random() * 5000 + 2000);
  };
    
  var trigger2 = function() {
    m1.innerHTML = "You clicked too early!";
    m2.innerHTML = "Click anywhere or press any key to try again.";
    
    window.clearTimeout(timeout);
    
    trigger = trigger1;
  }
  
  var trigger3 = function() {
    var td = Date.now() - ts;
    m1.innerHTML = td + " ms";
    total += td;
    runs++;
    m2.innerHTML = "Average of " + (total / runs).toFixed(2) + " ms over " + runs + " runs. Click anywhere or press any key to continue.";
    
    trigger = trigger1;
  }
  
  var trigger = trigger1;
  
  document.addEventListener("keydown", function(event) {
    trigger();
  })
  
  document.addEventListener("click", function(event) {
    trigger();
  });
};