// Headless known-answer / structural tests. Run: node test.js
var data = require("./data.js");
var fs = require("fs");

var failures = 0;

function assert(cond, label) {
  if (!cond) {
    failures++;
    console.log("FAIL " + label);
  } else {
    console.log("PASS " + label);
  }
}

var EXPECTED_CLASSES = ["Assault", "Heavy", "Sniper", "Technician", "Berserker", "Priest", "Infiltrator"];

assert(data.CLASSES.length === 7, "exactly 7 classes");
assert(EXPECTED_CLASSES.every(function (n) { return data.CLASSES.some(function (c) { return c.name === n; }); }), "all 7 named classes present");

data.CLASSES.forEach(function (cls) {
  assert(cls.perks.length === 7, cls.name + " has exactly 7 perks");
  assert(typeof cls.weaponProficiency === "string" && cls.weaponProficiency.length > 0, cls.name + " has a non-empty weaponProficiency string");
  assert(cls.perks.some(function (p) { return p.name === "New Class" && p.level === 4; }), cls.name + " has New Class at level 4");
  cls.perks.forEach(function (perk) {
    assert(typeof perk.name === "string" && perk.name.length > 0, cls.name + "/" + (perk.name || "?") + " has a non-empty name");
    assert(typeof perk.effect === "string" && perk.effect.length > 0, cls.name + "/" + perk.name + " has a non-empty effect string (no blank cell)");
    assert(typeof perk.level === "number", cls.name + "/" + perk.name + " has a numeric level (no blank cell)");
  });
});

// Every one of the 21 unordered class pairs must render two non-empty panels — simulate what the
// page does by just confirming getClass resolves both sides for every combination.
(function allPairsResolve() {
  var names = data.CLASSES.map(function (c) { return c.name; });
  var pairCount = 0;
  for (var i = 0; i < names.length; i++) {
    for (var j = i + 1; j < names.length; j++) {
      pairCount++;
      var a = data.getClass(names[i]);
      var b = data.getClass(names[j]);
      assert(a && b && a.perks.length === 7 && b.perks.length === 7, names[i] + "+" + names[j] + " both resolve with full perk lists");
    }
  }
  assert(pairCount === 21, "21 unordered pairs checked (7 choose 2)");
})();

// Community notes: only ship for pairs explicitly corroborated across independent sources, and
// never with verdict language.
var BANNED_WORDS = ["best", "optimal", "strongest", "guaranteed", "approved", "certified", "compliant", "safe", "recommended"];

Object.keys(data.COMMUNITY_NOTES).forEach(function (key) {
  var note = data.COMMUNITY_NOTES[key].toLowerCase();
  BANNED_WORDS.forEach(function (w) {
    assert(note.indexOf(w) === -1, "community note '" + key + "' does not contain banned word '" + w + "'");
  });
});

assert(typeof data.EXCLUSION_NOTE === "string" && data.EXCLUSION_NOTE.length > 0, "EXCLUSION_NOTE is present");

// Grep the rendered copy only. index.html's own <script> legitimately spells out the banned
// words as its own checker list (that list never reaches the rendered page) — strip every
// <script>...</script> block before checking, so this test checks what a reader actually sees.
(function checkIndexHtmlVisibleCopy() {
  var raw = fs.readFileSync(__dirname + "/index.html", "utf8");
  var visible = raw.replace(/<script[\s\S]*?<\/script>/gi, "").toLowerCase();
  BANNED_WORDS.forEach(function (w) {
    assert(visible.indexOf(w) === -1, "index.html rendered copy (scripts stripped) does not contain banned word '" + w + "'");
  });
})();

data.CLASSES.forEach(function (cls) {
  cls.perks.forEach(function (perk) {
    var text = (perk.name + " " + perk.effect).toLowerCase();
    BANNED_WORDS.forEach(function (w) {
      assert(text.indexOf(w) === -1, cls.name + "/" + perk.name + " perk text does not contain banned word '" + w + "'");
    });
  });
});

if (failures > 0) {
  console.log(failures + " test(s) failed.");
  process.exit(1);
} else {
  console.log("All tests passed.");
}
