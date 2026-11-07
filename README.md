# Gate 0 – an interactive airport night story

A short choose-your-path **rule-horror** game that runs in the browser.
Your flight is cancelled, the terminal is empty, and a note on the seat says *AIRPORT NIGHT RULES*.
Follow them – or don't. There are **5 endings**.

🎮 **Play:** https://toprakkars.github.io/gate-0/

![Gate 0 – opening scene](https://raw.githubusercontent.com/ToprakKars/ToprakKars/main/assets/gate-0.jpg)

Based on "Gate 0", the first story series on my short-video channel **Two Paths** (Instagram / TikTok / YouTube), where viewers decide what happens next.

## Features

- Typewriter text (click or press any key to skip), number keys 1–3 to choose
- Items that unlock or hide choices (rules note, coffee, staff key card)
- The rules note opens as a paper-style dialog once you've picked it up
- Endings collection saved in your browser (good / bad / secret)
- Departure-board look, scanline flicker, respects `prefers-reduced-motion`
- No framework, no build step – plain HTML, CSS and JavaScript modules

## How it's built

The story and the engine are separate:

- `story.js` – only data: scenes, choices, rules, endings
- `engine.js` – pure functions: which choices are visible, what happens when you choose
- `app.js` – the browser UI

Because the engine has no DOM code, the **whole story can be checked automatically**.
`validateStory()` walks through every reachable combination of scene + items (breadth-first search) and reports:

- choices that point to a scene that doesn't exist
- scenes that can never be reached
- dead ends (no visible choice and not an ending)

So adding a new branch can't silently break the game.

## Tests

```bash
npm test
```

```
# tests 7
# pass 7
# fail 0
```

Tests run on every push with GitHub Actions.

## Run locally

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Writing a new scene

```js
my_scene: {
  text: "Something happens.",
  choices: [
    { label: "Do this", to: "next_scene" },
    { label: "Only if you have the key card", to: "secret_room", requires: "keycard" },
    { label: "Pick up the map", to: "next_scene", give: "map" }
  ]
}
```
