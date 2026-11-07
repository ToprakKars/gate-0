// Game engine – pure functions over plain state objects, so it can be tested without a browser.

export function newGame(start) {
  return { scene: start, items: [], history: [start] };
}

export function visibleChoices(scene, state) {
  return (scene.choices || []).filter(c =>
    (!c.requires || state.items.includes(c.requires)) &&
    (!c.unless || !state.items.includes(c.unless))
  );
}

export function choose(scenes, state, choice) {
  const scene = scenes[state.scene];
  if (!visibleChoices(scene, state).includes(choice)) {
    throw new Error("This choice is not available right now");
  }
  let items = state.items;
  if (choice.give && !items.includes(choice.give)) items = [...items, choice.give];
  if (choice.take) items = items.filter(i => i !== choice.take);
  return { scene: choice.to, items, history: [...state.history, choice.to] };
}

/** Explore every reachable (scene, items) state – used to check the story for mistakes. */
export function explore(scenes, start) {
  const seen = new Set();
  const reachedScenes = new Set();
  const deadEnds = [];
  const queue = [newGame(start)];

  while (queue.length) {
    const state = queue.shift();
    const key = state.scene + "|" + [...state.items].sort().join(",");
    if (seen.has(key)) continue;
    seen.add(key);
    reachedScenes.add(state.scene);

    const scene = scenes[state.scene];
    if (scene.ending) continue;
    const choices = visibleChoices(scene, state);
    if (!choices.length) deadEnds.push(key);
    for (const choice of choices) queue.push(choose(scenes, state, choice));
  }
  return { reachedScenes, deadEnds, states: seen.size };
}

/** Problems in the story data: missing targets, unreachable scenes, dead ends. */
export function validateStory(scenes, start) {
  const problems = [];
  if (!scenes[start]) problems.push(`start scene "${start}" is missing`);

  for (const [id, scene] of Object.entries(scenes)) {
    if (!scene.text) problems.push(`${id}: no text`);
    if (scene.ending && scene.choices) problems.push(`${id}: endings cannot have choices`);
    if (!scene.ending && !scene.choices?.length) problems.push(`${id}: no choices and not an ending`);
    for (const c of scene.choices || []) {
      if (!scenes[c.to]) problems.push(`${id}: choice "${c.label}" points to missing scene "${c.to}"`);
    }
  }
  if (problems.length) return problems;

  const { reachedScenes, deadEnds } = explore(scenes, start);
  for (const id of Object.keys(scenes)) {
    if (!reachedScenes.has(id)) problems.push(`${id}: can never be reached`);
  }
  for (const d of deadEnds) problems.push(`dead end: ${d}`);
  return problems;
}
