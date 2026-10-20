# Phoenix Point Multiclass & Perk Browser (GCT-021)

Single static page, `index.html`, no build step, no dependencies, no backend, no account/login.

## What it does

Player picks any 2 of Phoenix Point's 7 soldier classes (Assault, Heavy, Sniper, Technician,
Berserker, Priest, Infiltrator) and sees both classes' full weapon proficiency and complete
7-skill perk list side by side — name, level, SP cost, effect. It is a structured browser, not an
advice tool: it never ranks pairs or uses verdict language ("best"/"optimal"/"strongest"/
"recommended" do not appear anywhere in the shipped copy; enforced by a grep assertion in
`test.js` and by `Tools/slop_lint.py`).

## Data source

Primary source for every class's weapon proficiency and perk list: each class's own page at
`phoenixpoint.wiki.fextralife.com` plus the separate "Infiltrator Skills" subpage (the main
Infiltrator class page's skill table has no names — it reads as copy-pasted from the Heavy page).
All fetched and re-read directly 2026-10-20.

**No independent second source was found that lists the same perk names/effects to cross-check
wording against.** Every perk ships as single-sourced, per this lane's own charter ("single-sourced
perk still ships... but the DONE_REPORT must say which ones were only single-sourced" — see
`DONE_REPORT.md`). Three specific gaps are flagged directly on the page and in `data.js`:

1. **Version mismatch risk.** A search pass surfaced a Fandom mirror (out of scope to crawl under
   this lane's charter) describing a *different* Assault skill tree — different Dash numbers,
   "Onslaught" instead of "Rally the Troops." Fextralife's own Classes page was last edited April
   2020. This reads as two mirrors documenting two different game patches, not as one source being
   simply wrong — there was no way to resolve which (if either) matches the player's current
   version without the banned crawl target. Surfaced as a disclosed gap, not silently merged.
2. **Infiltrator levels are position-inferred.** The Infiltrator Skills subpage names/describes 7
   skills but only labels one ("New Class") with a level. Levels 1,2,3,5,6,7 shown on the page are
   inferred from list position matching the universal pattern every other class follows — flagged
   per-row with "position-inferred, not stated by source." SP costs for Infiltrator were not found
   anywhere and are shown as "not listed in source," never guessed.
3. **Two garbled source strings**, corrected with a visible flag rather than silently: Technician's
   Field Medic ("10 pont" → "10 HP"), Priest's Induce Panic/Mind Sense ("pain"/"reveled" →
   "panic"/"revealed" — the corrected words match each skill's own name). Berserker's Adrenaline
   Rush had an ambiguous Will-Point clause; shown as this builder's closest-faith reading with an
   explicit "not a verbatim quote" flag rather than invented certainty.

## The exclusion claim (per charter, NOT shipped as a rule)

The charter flagged a single Steam Community thread claiming a secondary class's Level 5-7
("third-row") perks are unavailable when that class is taken second rather than first. Checked
directly: a **second poster in that same thread disagrees**, and a follow-up search found no
independent corroboration either way (the closest candidate for a second source was the same
single thread resurfacing in a different search snippet, not a genuinely new source). Per the
charter's explicit
fallback, this page shows every perk from both classes for every pair and states the dispute as an
unresolved note above the comparison — it never asserts the exclusion as fact.

## Community notes

Only two of the 21 pairs got a labeled community-note panel: **Heavy+Sniper** and
**Berserker+Heavy**. Both were checked across 3+ independent Steam Community discussion threads
(not just multiple posters in one thread) describing the same playstyle pattern. Every other pair
either had no community discussion found, or had posters disagreeing with each other within the
same thread (Infiltrator/Berserker, Priest/Technician, Assault/Technician all had direct
contradictions and were excluded for that reason). Notes are phrased as reported observation only.

## Known limitations, stated on the page

- Perk text may not match the player's current patch (see version-mismatch gap above).
- Infiltrator's levels are inferred, not sourced; its SP costs are unknown and shown as such.
- No Pro/paywall tier is implemented in this build — the charter's acceptance criteria scope this
  session to the free browser only; monetization wiring is the orchestrator's step, not this
  worker's.

## Tests

`node test.js` — structural + content tests: 7 classes, 7 perks each, New Class at level 4 for
every class, all 21 unordered pairs resolve with complete (non-blank) perk lists, banned-word grep
against the rendered copy (scripts stripped) and against every perk's own text. All passing.

`python3 Tools/slop_lint.py index.html data.js test.js` — clean, 0 findings.

Rendered via headless Chrome (`--dump-dom`) for two pairs — the data-complete default (Heavy +
Sniper) and the sparse-data case (Infiltrator + Technician) — and the dumped DOM read directly to
confirm no blank cells, correct inferred/typo flags, and correct community-note suppression for a
pair with no corroborated note.
