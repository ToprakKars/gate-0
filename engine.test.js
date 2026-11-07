import { test } from "node:test";
import assert from "node:assert/strict";
import { choose, explore, newGame, validateStory, visibleChoices } from "./engine.js";
import { SCENES, START } from "./story.js";

test("the real story has no broken links, dead ends or unreachable scenes", () => {
  assert.deepEqual(validateStory(SCENES, START), []);
});

test("every ending can be reached", () => {
  const { reachedScenes } = explore(SCENES, START);
  const endings = Object.keys(SCENES).filter(id => SCENES[id].ending);
  assert.ok(endings.length >= 4);
  for (const e of endings) assert.ok(reachedScenes.has(e), `${e} unreachable`);
});

test("choices that require an item are hidden without it", () => {
  const state = { scene: "seat", items: [], history: [] };
  const labels = visibleChoices(SCENES.seat, state).map(c => c.label);
  assert.ok(!labels.some(l => l.includes("rule 5")));
  assert.ok(!labels.some(l => l.includes("staff door")));
});

test("'unless' choices disappear once you have the item", () => {
  const state = { scene: "corridor", items: ["rules"], history: [] };
  const labels = visibleChoices(SCENES.corridor, state).map(c => c.label);
  assert.ok(labels.includes("Look away (rule 1)"));
  assert.ok(!labels.includes("Look away"));
});

test("items are given and taken", () => {
  let state = newGame(START);
  state = choose(SCENES, state, SCENES.arrival.choices[1]);              // food court
  state = choose(SCENES, state, SCENES.food_court.choices[0]);           // buy coffee
  assert.deepEqual(state.items, ["coffee"]);
  state = choose(SCENES, state, SCENES.coffee.choices[0]);               // give coffee away
  assert.deepEqual(state.items, []);
  state = choose(SCENES, state, SCENES.cleaner_gift.choices[0]);         // get key card
  assert.deepEqual(state.items, ["keycard"]);
});

test("choosing a hidden option throws", () => {
  const state = { scene: "seat", items: [], history: [] };
  const staffDoor = SCENES.seat.choices.find(c => c.requires === "keycard");
  assert.throws(() => choose(SCENES, state, staffDoor), /not available/);
});

test("validator catches a broken story", () => {
  const broken = {
    a: { text: "start", choices: [{ label: "go", to: "missing" }] },
    b: { text: "lonely", ending: "bad" }
  };
  const problems = validateStory(broken, "a");
  assert.ok(problems.some(p => p.includes("missing scene")));
});
