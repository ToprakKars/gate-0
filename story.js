// Gate 0 – story data.
// Each scene has text and choices. A choice can require an item, give an item,
// or be hidden once you have an item (`unless`). `time` sets the clock. Scenes with `ending` finish the game.

export const START = "arrival";

export const RULES = [
  "Gate 0 does not exist. If a screen shows it, look away.",
  "The cleaner never speaks. If he speaks, do not answer.",
  "Announcements end with a chime. If one ends without it, ignore it.",
  "Your boarding pass is your only way out. Do not lose it.",
  "At 03:33 stay seated, whatever you hear."
];

export const SCENES = {
  arrival: {
    text: "Your connecting flight was cancelled. The terminal is empty, lights humming. A crumpled note lies on the seat next to you: AIRPORT NIGHT RULES. Your boarding pass shows: Gate 12, 06:10.",
    choices: [
      { label: "Read the rules carefully", to: "rules", give: "rules" },
      { label: "Ignore the note and find food", to: "food_court" }
    ]
  },
  rules: {
    text: "Five rules, written in shaky handwriting. You fold the note into your pocket. Somewhere far away, a suitcase wheel squeaks.",
    choices: [
      { label: "Walk towards Gate 12", to: "corridor" },
      { label: "Look for something to eat first", to: "food_court" }
    ]
  },
  food_court: {
    text: "The food court is closed, but one vending machine glows. Next to it, a cleaner in a grey uniform mops the same tile over and over.",
    choices: [
      { label: "Buy a coffee", to: "coffee", give: "coffee" },
      { label: "Ask the cleaner where Gate 12 is", to: "cleaner_talk" },
      { label: "Leave quietly", to: "corridor" }
    ]
  },
  coffee: {
    text: "The machine gives you a warm coffee. The cleaner stops mopping. He doesn't look at you, but his head tilts slightly.",
    choices: [
      { label: "Offer him the coffee", to: "cleaner_gift", take: "coffee" },
      { label: "Walk to Gate 12", to: "corridor" }
    ]
  },
  cleaner_talk: {
    text: "He slowly turns. For a second you think his face is too smooth. Then he points down a corridor you hadn't noticed before.",
    choices: [
      { label: "Follow his finger", to: "wrong_corridor" },
      { label: "Ignore him and check the departure board", to: "corridor" }
    ]
  },
  cleaner_gift: {
    text: "He takes the cup without a word and presses a key card into your hand. STAFF ONLY, it says. Then he goes back to mopping.",
    choices: [
      { label: "Keep going to Gate 12", to: "corridor", give: "keycard" }
    ]
  },
  wrong_corridor: {
    text: "The corridor is longer than the building. The gate numbers count down: 4… 3… 2… 1…",
    choices: [
      { label: "Keep walking", to: "gate_zero" },
      { label: "Turn around and run", to: "corridor" }
    ]
  },
  corridor: {
    text: "You reach the departure board. Every line says CANCELLED – except one, flickering at the bottom: GATE 0 · BOARDING NOW.",
    choices: [
      { label: "Look away (rule 1)", to: "announcement", requires: "rules" },
      { label: "Stare at it", to: "gate_zero" },
      { label: "Look away", to: "announcement", unless: "rules" }
    ]
  },
  announcement: {
    text: "Ding-dong. \"Passengers for the 06:10 flight, please proceed to Gate 12.\" Silence. A second announcement starts – the same voice, but slower: \"Passengers… please proceed to Gate 0.\" No chime.",
    choices: [
      { label: "Ignore it – it had no chime (rule 3)", to: "seat", requires: "rules" },
      { label: "Follow the announcement", to: "gate_zero" },
      { label: "Sit down and wait", to: "seat", unless: "rules" }
    ]
  },
  seat: {
    time: "03:33",
    text: "You sit at Gate 12. The clock above you clicks to 03:33. Behind you, someone you love calls your name and asks you to turn around.",
    choices: [
      { label: "Stay seated, eyes forward (rule 5)", to: "dawn", requires: "rules" },
      { label: "Turn around", to: "ending_voice" },
      { label: "Keep looking forward", to: "dawn", unless: "rules" },
      { label: "Use the staff door to hide", to: "staff_room", requires: "keycard" }
    ]
  },
  staff_room: {
    time: "04:10",
    text: "The key card works. Inside: lockers, a radio, and a window showing the runway. The radio whispers flight numbers until the sky turns grey.",
    choices: [
      { label: "Wait for sunrise", to: "ending_staff" }
    ]
  },
  dawn: {
    time: "06:00",
    text: "You don't move. The voice gets closer, then stops. At 06:00 the lights switch to daylight mode. A gate agent appears and smiles: \"Boarding pass, please.\"",
    choices: [
      { label: "Hand over your boarding pass", to: "ending_escape" }
    ]
  },
  gate_zero: {
    text: "Gate 0 has no window and no plane. Just a desk, and an agent with your face. \"You're late,\" she says, holding out her hand for your boarding pass.",
    choices: [
      { label: "Give her the pass", to: "ending_gate_zero" },
      { label: "Hold the pass tight and walk backwards", to: "ending_lost" }
    ]
  },

  ending_escape: {
    time: "06:10",
    ending: "good",
    title: "Morning flight",
    text: "The agent scans your pass. As you walk down the jet bridge, you notice the cleaner waving from the window. You never read the rules again – but you kept them."
  },
  ending_staff: {
    time: "06:05",
    ending: "good",
    title: "Staff only",
    text: "When the first shift arrives, nobody asks why you're there. The cleaner nods at you on your way out. Some rules are older than the airport."
  },
  ending_voice: {
    ending: "bad",
    title: "Someone you know",
    text: "There is nobody behind you. When you turn back, Gate 12 is gone, and the board above you shows only one destination: GATE 0."
  },
  ending_gate_zero: {
    ending: "bad",
    title: "Gate 0",
    text: "She tears the pass in half. \"Welcome aboard.\" The lights go out. In the morning, a traveller finds a crumpled note on a seat: AIRPORT NIGHT RULES."
  },
  ending_lost: {
    ending: "secret",
    title: "Between gates",
    text: "You keep your pass, but the corridor never ends. Sometimes travellers hear wheels squeaking at night. Now you know whose suitcase it is."
  }
};
