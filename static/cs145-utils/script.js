var show_values = true;

var root = "";

var children = {};
var parent = {};

var name = "";

function nx(s) {
  if (s == "") return "a";
  if (s.charAt(s.length - 1) == "z") return nx(s.substring(0, s.length - 1)) + "a";
  return s.substring(0, s.length - 1) + String.fromCharCode(s.codePointAt(s.length - 1) + 1);
}

function nextname() {
  return (name = nx(name));
}

function readint(message) {
  var tried = false;
  while (true) {
    var value = parseInt(prompt((tried ? "Not an integer! " : "") + message));
    if (!isNaN(value)) {
      return value;
    }
    if (value === null) throw Error();
  }
}

function readnode(message) {
  var rm = prompt(message);
  while (!children.hasOwnProperty(rm)) {
    if (rm === null) throw Error();
    rm = prompt("Node " + rm + " not found. " + message);
  }
  return rm;
}

function readlr(message) {
  var m = prompt(message);
  while (m != "left" && m != "right" && m != "l" && m != "r") {
    if (m === null) throw Error();
    m = prompt("Not 'left' or 'right' (or 'l'/'r')! " + message);
  }
  return m == "right" || m == "r";
}

function isEmpty(obj) {
  for (var x in obj) return false;
  return true;
}

function toggle() {
  document.getElementById("toggle").innerHTML = ((show_values = !show_values) ? "Hide" : "Show") + " node values";
  update();
}

function delnode(n) {
  if (children[n][0] !== null) delnode(children[n][0]);
  if (children[n][1] !== null) delnode(children[n][1]);
  if (parent.hasOwnProperty(n)) {
    children[parent[n][0]][parent[n][1]] = null;
    delete parent[n];
  }
  delete children[n];
  update();
}

function remove() {
  if (isEmpty(children)) {
    alert("No nodes to remove!");
  } else {
    delnode(readnode("Please enter the ID of the node to remove:"));
  }
}

function insert() {
  var nm = nextname();
  var p, s;
  if (!isEmpty(children)) {
    children[p = readnode("Please enter the ID of the node to place this node under (will overwrite if the slot is occupied):")][s = readlr("Please enter 'left' or 'right' (or 'l'/'r') for which slot to place this node in:") ? 1 : 0] = nm;
    parent[nm] = [p, s];
  } else {
    root = nm;
  }
  children[nm] = [null, null, show_values ? readint("Please enter a value for the node:") : 0];
  update();
}

function modify() {
  if (isEmpty(children)) {
    alert("No nodes to modify!");
  } else {
    children[readnode("Please enter the ID of the node to modify:")][2] = readint("Please enter the new value:");
  }
  update();
}

function notate(node) {
  if (node === undefined) node = root;
  if (isEmpty(children)) {
    return "The racket notation of the tree will appear here.";
  } else if (node === null) {
    return "'()";
  } else {
    return "(make-node " + notate(children[node][0]) + " " + notate(children[node][1]) + (show_values ? " " + children[node][2] : "") + ")";
  }
}

function depth(node) {
  if (node === undefined) node = root;
  if (node === null) {
    return 0;
  } else {
    return 1 + Math.max(depth(children[node][0]), depth(children[node][1]));
  }
}

function visualize(node, rows, d) {
  if (node === undefined) node = root;
  if (rows === undefined) rows = Array(depth()).fill("");
  if (d === undefined) d = 0;
  if (node !== null) {
    rows = visualize(children[node][0], rows, d + 1);
    var s = node + (show_values ? "(" + children[node][2] + ")" : "");
    for (var x in rows) {
      if (x == d) {
        rows[x] += s;
      } else {
        rows[x] += "&nbsp;".repeat(s.length);
      }
    }
    rows = visualize(children[node][1], rows, d + 1);
  }
  return rows;
}

function parse(notation, n, s, children, parent, r) {
  console.log(notation, n, s);
  notation = notation.trim();
  if (children === undefined) children = {};
  if (parent === undefined) parent = {};
  if (notation.startsWith("(make-node")) {
    var nm = nextname();
    if (r === undefined) r = nm;
    children[nm] = [null, null, 0];
    [notation, children, parent, r] = parse(notation.substring(10), nm, 0, children, parent, r);
    [notation, children, parent, r] = parse(notation, nm, 1, children, parent, r);
    notation = notation.trim();
    if (!notation.startsWith(")")) {
      var x = "";
      while (notation.codePointAt(0) >= 48 && notation.codePointAt(0) < 58) {
        x += notation.charAt(0);
        notation = notation.substring(1);
      }
      notation = notation.substring(1);
      children[nm][2] = parseInt(x);
    } else {
      notation = notation.substring(1);
      children[nm][2] = 0;
    }
    if (n !== undefined && s !== undefined) {
      parent[nm] = [n, s];
      children[n][s] = nm;
    }
    return [notation, children, parent, r];
  } else if (notation.startsWith("'()")) {
    return [notation.substring(3), children, parent, r];
  } else {
    console.log(notation);
    throw Error();
  }
}

function racketimport() {
  var tried = false;
  while (true) {
    var notation = prompt(tried ? "Invalid notation! Please check that you copy-pasted the whole thing:" : "Please enter the racket output/encoding:");
    if (notation === null) break;
    tried = true;
    try {
      var result = parse(notation);
      [_, c, p, r] = result;
      children = c;
      parent = p;
      root = r;
      update();
      break;
    } catch (e) {
      console.log(e);
    }
  }
}

function update() {
  document.getElementById("main").innerHTML = visualize().join("<br />");
  document.getElementById("notation").innerHTML = notate();
}