// Phoenix Point class/perk data. Isomorphic: runs in the browser (window.PPDATA) and under Node
// for the headless tests (module.exports).
//
// Primary source for all 7 classes' weapon proficiency and Level 1-3 + Level 5-7 skill
// name/SP-cost/effect text: phoenixpoint.wiki.fextralife.com (class pages + the dedicated
// "Infiltrator Skills" subpage), fetched 2026-10-20. Level 4 is always "New Class" (choose a
// secondary class) on every class page.
//
// KNOWN GAP: a search pass turned up a second mirror (Fandom — out of scope for this lane; its
// charter bans crawling *.fandom.com) describing a DIFFERENT Assault skill tree (different Dash
// numbers, "Onslaught" instead of "Rally the Troops"). That is consistent with the two mirrors
// documenting different game patches, not with one of them being simply wrong. Fextralife's
// Classes page itself was last edited April 2020. The data below is shown as fextralife documents
// it today, with that caveat surfaced on the page — not silently merged or "corrected" against an
// unreachable second source.
//
// INFILTRATOR GAP: the main Infiltrator class page's skill table has no skill names (it appears to
// be copy-pasted from the Heavy page). The names/effects below come from the separate
// "Infiltrator Skills" subpage, which does not label levels or SP costs for any skill except
// "New Class" (Level 4). Levels 1,2,3,5,6,7 below are POSITION-INFERRED to match the universal
// 1-7 pattern every other class follows on this wiki, not stated outright by the source — flagged
// per-perk with levelInferred:true. SP costs for Infiltrator are not available from any source
// found and are left null rather than guessed.
//
// EXCLUSION CLAIM: a single Steam Community thread (see EXCLUSION_NOTE below) claims a secondary
// class's Level 5-7 ("third-row") perks are unavailable when that class is taken second rather
// than first. A second poster in the SAME thread disagrees. No second independent source was found
// corroborating either side. Per this build's charter, that claim does NOT ship as a stated rule.
(function (root) {
  "use strict";

  var FEXTRALIFE_CLASSES_URL = "https://phoenixpoint.wiki.fextralife.com/Classes";

  var CLASSES = [
    {
      name: "Assault",
      weaponProficiency: "Assault Rifles and Shotguns",
      sourceUrl: "https://phoenixpoint.wiki.fextralife.com/Assault",
      perks: [
        { level: 1, spCost: 0, name: "Assault Training", effect: "Proficiency with Assault Rifles and Shotguns." },
        { level: 2, spCost: 10, name: "Dash", effect: "Move to a target position within 75% of the normal movement range." },
        { level: 3, spCost: 15, name: "Return Fire", effect: "Shoot back at an enemy when it attacks, if the soldier is using a direct-fire projectile weapon with proficiency and the enemy is within half perception range." },
        { level: 4, spCost: 50, name: "New Class", effect: "Choose a secondary class to train in." },
        { level: 5, spCost: 20, name: "Ready For Action", effect: "Reloading and inventory actions do not cost an Action Point." },
        { level: 6, spCost: 25, name: "Rally the Troops", effect: "Each ally recovers 1 Action Point. Limited to one use per turn." },
        { level: 7, spCost: 30, name: "Rapid Clearance", effect: "Recover 2 Action Points for each enemy killed, until the end of the turn." }
      ]
    },
    {
      name: "Heavy",
      weaponProficiency: "Heavy Weapons, Mounted Weapons and Jet Packs",
      sourceUrl: "https://phoenixpoint.wiki.fextralife.com/Heavy",
      perks: [
        { level: 1, spCost: 0, name: "Heavy Training", effect: "Proficiency with Heavy Weapons, Mounted Weapons, and Jet Pack." },
        { level: 2, spCost: 10, name: "Brawler", effect: "Bash and Melee attacks deal 50% more damage." },
        { level: 3, spCost: 15, name: "War Cry", effect: "All enemies within 10 tiles have their Action Points reduced to 2 for the next turn." },
        { level: 4, spCost: 50, name: "New Class", effect: "Choose a secondary class to train in." },
        { level: 5, spCost: 20, name: "Boom Blast", effect: "The Action Point cost of Grenades, and other explosive weapons, is reduced by 1; their range is increased by 50% until the end of the turn." },
        { level: 6, spCost: 25, name: "Inspire", effect: "Killing an enemy grants allies 1 additional Will Point." },
        { level: 7, spCost: 30, name: "Rage Burst", effect: "Shoot 5 times with 50% accuracy using a proficient, direct-fire weapon." }
      ]
    },
    {
      name: "Sniper",
      weaponProficiency: "Sniper Rifles and Handguns",
      sourceUrl: "https://phoenixpoint.wiki.fextralife.com/Sniper",
      perks: [
        { level: 1, spCost: 0, name: "Sniper Training", effect: "Proficiency with Sniper Rifles and Handguns." },
        { level: 2, spCost: 10, name: "Extreme Focus", effect: "Overwatch cost is reduced by 1 Action Point." },
        { level: 3, spCost: 15, name: "Quick Aim", effect: "The Action Point cost of the next shot with a proficient weapon is reduced by 1." },
        { level: 4, spCost: 50, name: "New Class", effect: "Choose a secondary class to train in." },
        { level: 5, spCost: 20, name: "Master Marksman", effect: "Accuracy with a proficient weapon is increased by 30% while there are no spotted enemies within 10 tiles." },
        { level: 6, spCost: 25, name: "Weak Spot", effect: "Disabling a body part also removes that body part's armor." },
        { level: 7, spCost: 30, name: "Mark For Death", effect: "Mark an enemy target. Until the end of the turn, all damage to that target is increased by 50%." }
      ]
    },
    {
      name: "Technician",
      weaponProficiency: "PDWs, robotic arms, and turret deployment",
      sourceUrl: "https://phoenixpoint.wiki.fextralife.com/Technician",
      perks: [
        { level: 1, spCost: 0, name: "Technician Training", effect: "Proficiency with PDWs, robotic arms, and turret deployment." },
        { level: 2, spCost: 10, name: "Fast Use", effect: "The Action Point cost of Medkits, Stimpacks and Robotic Arm abilities is reduced by 1." },
        { level: 3, spCost: 15, name: "Manual Control", effect: "Take manual control of a turret or vehicle weapon and shoot at a target." },
        { level: 4, spCost: 50, name: "New Class", effect: "Choose a secondary class to train in." },
        { level: 5, spCost: 20, name: "Field Medic", effect: "Restore 10 HP and 10 Armor to all body parts of the selected target. Disabled body parts are restored.", sourceTypo: "Source page reads \"10 pont\" — transcribed here as \"10 HP.\"" },
        { level: 6, spCost: 25, name: "Remote Deployment", effect: "Turrets can be thrown and deployed for 1 Action Point." },
        { level: 7, spCost: 30, name: "Electric Reinforcement", effect: "All allies gain 20 temporary Armor for 1 turn." }
      ]
    },
    {
      name: "Berserker",
      weaponProficiency: "Melee Weapons and Handguns",
      sourceUrl: "https://phoenixpoint.wiki.fextralife.com/Berserker",
      perks: [
        { level: 1, spCost: 0, name: "Berserker Training", effect: "Proficiency with Melee Weapons and Handguns." },
        { level: 2, spCost: 10, name: "Armor Break", effect: "The next attack deals 50 additional Shred Damage." },
        { level: 3, spCost: 15, name: "Close Quarters Evade", effect: "Attacks from enemies within 10 tiles deal 25% less damage." },
        { level: 4, spCost: 50, name: "New Class", effect: "Choose a secondary class to train in." },
        { level: 5, spCost: 20, name: "Bloodlust", effect: "Damage and Speed are increased proportional to the health lost (up to +50%)." },
        { level: 6, spCost: 25, name: "Ignore Pain", effect: "Disabled body parts remain functional. Cannot Panic or be Mind Controlled." },
        { level: 7, spCost: 30, name: "Adrenaline Rush", effect: "All abilities cost 1 Action Point until the end of the turn, with accuracy reduced to 50%. Also costs Will Points.", sourceTypo: "Source page's wording for the Will Point cost was garbled/ambiguous; effect text above is this builder's closest-faith reading, not a verbatim quote." }
      ]
    },
    {
      name: "Priest",
      weaponProficiency: "Viral Weapons",
      sourceUrl: "https://phoenixpoint.wiki.fextralife.com/Priest",
      perks: [
        { level: 1, spCost: 0, name: "Priest Training", effect: "Proficiency with Viral Weapons." },
        { level: 2, spCost: 10, name: "Mind Control", effect: "Gain control of an enemy with Will Point cost equal to the enemy's current Will Points. Costs 2 Will Points per turn to maintain control." },
        { level: 3, spCost: 15, name: "Induce Panic", effect: "Cause a target to panic if its current Will Points are less than the Priest's.", sourceTypo: "Source page reads \"pain\" — transcribed here as \"panic,\" matching the skill's own name." },
        { level: 4, spCost: 50, name: "New Class", effect: "Choose a secondary class to train in." },
        { level: 5, spCost: 20, name: "Mind Sense", effect: "All organic enemies within 15 tiles are automatically revealed.", sourceTypo: "Source page reads \"reveled\" — transcribed here as \"revealed.\"" },
        { level: 6, spCost: 25, name: "Psychic Ward", effect: "Allies within 10 tiles are immune to Panic and Psychic damage attacks." },
        { level: 7, spCost: 30, name: "Mind Crush", effect: "Deal 100 damage to all enemy entities within 10 tiles." }
      ]
    },
    {
      name: "Infiltrator",
      weaponProficiency: "Crossbows and Spider Drone deployment",
      sourceUrl: "https://phoenixpoint.wiki.fextralife.com/Infiltrator+Skills",
      perks: [
        { level: 1, levelInferred: true, spCost: null, name: "Infiltrator Training", effect: "Proficiency with Crossbows and Spider Drone deployment. Base stealth factor of 25%, as long as the character isn't revealed." },
        { level: 2, levelInferred: true, spCost: null, name: "Surprise Attack", effect: "Attacks from behind gain shock value equal to 3 times the damage dealt." },
        { level: 3, levelInferred: true, spCost: null, name: "Deploy Decoy", effect: "Deploy a holographic decoy at the chosen location. The decoy counts as a real target for all enemies. Costs 3 Willpower." },
        { level: 4, spCost: null, name: "New Class", effect: "Choose a secondary class to train in." },
        { level: 5, levelInferred: true, spCost: null, name: "Spider Drone Pack", effect: "Deploy 3 Spider Drones with one action." },
        { level: 6, levelInferred: true, spCost: null, name: "Vanish", effect: "Move within 5 tiles and disappear from view until the next turn or until spotted. Costs 4 Willpower." },
        { level: 7, levelInferred: true, spCost: null, name: "Sneak Attack", effect: "Damage dealt while not spotted is increased by 50%." }
      ]
    }
  ];

  var EXCLUSION_NOTE = "A single Steam Community thread claims a secondary class's Level 5-7 " +
    "skills are unavailable when that class is taken as your SECOND class rather than your first " +
    "(the thread's own posters disagree with each other about this). No second independent source " +
    "was found either confirming or denying it, so this page does not state it as a rule and shows " +
    "every skill above for both classes in a pair. Some players report this restriction exists in " +
    "their own games; verify against your own skill-pick screen before respeccing around it.";

  // Community notes: only pairs with 2+ independently-posted Steam Community threads describing
  // the same playstyle pattern. Keyed "ClassA|ClassB" with classes alphabetised. Reported
  // observation only, never a verdict — no "best/optimal/strongest/recommended" language.
  var COMMUNITY_NOTES = {
    "Heavy|Sniper": "Reported pattern, multiple independent Steam Community threads: pairing the " +
      "Sniper's accuracy and Overwatch-cost skills with the Heavy's jetpack mobility and " +
      "explosive-weapon kit, often built around a grenade launcher. Shown as a reported pattern " +
      "for reference, not a verdict on what to pick.",
    "Berserker|Heavy": "Reported pattern, multiple independent Steam Community threads: pairing " +
      "the Heavy's jetpack mobility and War Cry with the Berserker's melee-focused kit. Shown as " +
      "a reported pattern for reference, not a verdict on what to pick."
  };

  function pairKey(nameA, nameB) {
    var names = [nameA, nameB].sort();
    return names[0] + "|" + names[1];
  }

  function getClass(name) {
    for (var i = 0; i < CLASSES.length; i++) {
      if (CLASSES[i].name === name) return CLASSES[i];
    }
    return null;
  }

  function getCommunityNote(nameA, nameB) {
    return COMMUNITY_NOTES[pairKey(nameA, nameB)] || null;
  }

  var api = {
    CLASSES: CLASSES,
    EXCLUSION_NOTE: EXCLUSION_NOTE,
    COMMUNITY_NOTES: COMMUNITY_NOTES,
    FEXTRALIFE_CLASSES_URL: FEXTRALIFE_CLASSES_URL,
    pairKey: pairKey,
    getClass: getClass,
    getCommunityNote: getCommunityNote
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.PPDATA = api;
  }
})(typeof window !== "undefined" ? window : this);
