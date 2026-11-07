import { SCENES, START, RULES } from "./story.js";
import { choose, newGame, visibleChoices } from "./engine.js";

const ITEM_NAMES = { rules: "📄 rules note", coffee: "☕ coffee", keycard: "🔑 staff key card" };
const ENDINGS = Object.keys(SCENES).filter(id => SCENES[id].ending);
const STORAGE_KEY = "gate0-endings";

const $ = id => document.getElementById(id);
let state = newGame(START);
let typing = null;
let found = loadFound();

function loadFound() {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []); } catch { return new Set(); }
}
function saveFound() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...found])); } catch { /* ignore */ }
}

// Text appears letter by letter; click or press a key to skip.
function typeText(text, done) {
  clearInterval(typing);
  const el = $("text");
  let i = 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finish = () => { clearInterval(typing); typing = null; el.textContent = text; done(); };
  if (reduced) return finish();
  typing = setInterval(() => {
    i += 2;
    el.innerHTML = "";
    el.append(text.slice(0, i));
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    cursor.innerHTML = "&nbsp;";
    el.append(cursor);
    if (i >= text.length) finish();
  }, 18);
  el.onclick = finish;
}

function updateClock() {
  // Fixed times for key scenes, otherwise the clock creeps forward with every step (never past 03:31).
  const fixed = SCENES[state.scene].time;
  if (fixed) { $("clock").textContent = fixed; return; }
  const minutes = Math.min(3 * 60 + 31, 2 * 60 + 47 + (state.history.length - 1) * 11);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  $("clock").textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function renderInventory() {
  $("inventory").innerHTML = state.items.map(i => `<span class="item">${ITEM_NAMES[i] || i}</span>`).join("");
  $("rules-btn").hidden = !state.items.includes("rules");
}

function renderFooter() {
  $("found").textContent = found.size;
  $("total").textContent = ENDINGS.length;
  $("dots").innerHTML = ENDINGS.map(id =>
    `<span class="dot ${found.has(id) ? SCENES[id].ending : ""}" title="${found.has(id) ? SCENES[id].title : "???"}"></span>`
  ).join("");
}

function render() {
  const scene = SCENES[state.scene];
  $("choices").innerHTML = "";
  $("ending").hidden = true;
  renderInventory();
  updateClock();

  typeText(scene.text, () => {
    if (scene.ending) {
      found.add(state.scene);
      saveFound();
      renderFooter();
      $("ending-type").textContent = `${scene.ending.toUpperCase()} ENDING`;
      $("ending-type").className = `ending-type ${scene.ending}`;
      $("ending-title").textContent = scene.title;
      $("ending").hidden = false;
      $("again").focus();
      return;
    }
    visibleChoices(scene, state).forEach((choice, n) => {
      const btn = document.createElement("button");
      btn.className = "choice";
      btn.style.animationDelay = `${n * 90}ms`;
      btn.textContent = choice.label;
      btn.onclick = () => { state = choose(SCENES, state, choice); render(); };
      $("choices").append(btn);
    });
    $("choices").querySelector("button")?.focus();
  });
}

function restart() {
  state = newGame(START);
  render();
}

$("restart-btn").onclick = restart;
$("again").onclick = restart;
$("rules-btn").onclick = () => $("rules-dialog").showModal();
$("rules-list").innerHTML = RULES.map(r => `<li>${r}</li>`).join("");

// Number keys pick a choice
document.addEventListener("keydown", e => {
  if (typing) { $("text").onclick(); return; }
  const n = Number(e.key);
  const buttons = $("choices").querySelectorAll("button");
  if (n >= 1 && n <= buttons.length) buttons[n - 1].click();
});

renderFooter();
render();
