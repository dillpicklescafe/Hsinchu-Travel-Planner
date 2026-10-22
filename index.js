// Hsinchu Adventure Planner
// All route values are estimated demo data, not live transit information.

"use strict";

const DESTS = [
  {
    id: "mall",
    emoji: "🛍️",
    name: "Big City Mall",
    zh: "大遠百",
    routes: [
      { name: "Walk", steps: ["🚶"], minutes: 8, price: 0, co2: 0.0 },
      { name: "YouBike", steps: ["🚲"], minutes: 4, price: 10, co2: 0.0 },
      { name: "City bus", steps: ["🚶", "🚌", "🚶"], minutes: 10, price: 15, co2: 0.1 },
      { name: "Taxi", steps: ["🚕"], minutes: 8, price: 85, co2: 0.4 }
    ]
  },
  {
    id: "zoo",
    emoji: "🦁",
    name: "Hsinchu Zoo",
    zh: "新竹動物園",
    routes: [
      { name: "Walk", steps: ["🚶"], minutes: 30, price: 0, co2: 0.0 },
      { name: "YouBike", steps: ["🚲"], minutes: 12, price: 10, co2: 0.0 },
      { name: "City bus", steps: ["🚶", "🚌", "🚶"], minutes: 20, price: 15, co2: 0.1 },
      { name: "Taxi", steps: ["🚕"], minutes: 10, price: 100, co2: 0.5 }
    ]
  },
  {
    id: "east",
    emoji: "🏯",
    name: "East Gate",
    zh: "東門城",
    routes: [
      { name: "Walk", steps: ["🚶"], minutes: 12, price: 0, co2: 0.0 },
      { name: "YouBike", steps: ["🚲"], minutes: 5, price: 10, co2: 0.0 },
      { name: "City bus", steps: ["🚶", "🚌", "🚶"], minutes: 10, price: 15, co2: 0.1 },
      { name: "Taxi", steps: ["🚕"], minutes: 5, price: 85, co2: 0.4 }
    ]
  },
  {
    id: "temple",
    emoji: "🛕",
    name: "City God Temple",
    zh: "城隍廟",
    routes: [
      { name: "Walk", steps: ["🚶"], minutes: 15, price: 0, co2: 0.0 },
      { name: "YouBike", steps: ["🚲"], minutes: 6, price: 10, co2: 0.0 },
      { name: "City bus", steps: ["🚶", "🚌", "🚶"], minutes: 12, price: 15, co2: 0.1 },
      { name: "Taxi", steps: ["🚕"], minutes: 7, price: 85, co2: 0.4 }
    ]
  },
  {
    id: "glass",
    emoji: "🔮",
    name: "Hsinchu Glass Museum",
    zh: "玻璃工藝博物館",
    routes: [
      { name: "Walk", steps: ["🚶"], minutes: 20, price: 0, co2: 0.0 },
      { name: "YouBike", steps: ["🚲"], minutes: 8, price: 10, co2: 0.0 },
      { name: "City bus", steps: ["🚶", "🚌", "🚶"], minutes: 15, price: 15, co2: 0.1 },
      { name: "Taxi", steps: ["🚕"], minutes: 8, price: 85, co2: 0.4 }
    ]
  },
  {
    id: "image",
    emoji: "📷",
    name: "Image Museum",
    zh: "新竹影像博物館",
    routes: [
      { name: "Walk", steps: ["🚶"], minutes: 13, price: 0, co2: 0.0 },
      { name: "YouBike", steps: ["🚲"], minutes: 6, price: 10, co2: 0.0 },
      { name: "City bus", steps: ["🚶", "🚌", "🚶"], minutes: 10, price: 15, co2: 0.1 },
      { name: "Taxi", steps: ["🚕"], minutes: 6, price: 85, co2: 0.4 }
    ]
  }
];

const GOALS = [
  {
    id: "fast",
    emoji: "⚡️",
    name: "Fast",
    key: "minutes",
    explanation: () => "is the quickest, so you get there sooner and have more time to play!"
  },
  {
    id: "cheap",
    emoji: "💰",
    name: "Cheap",
    key: "price",
    explanation: () => "costs the least, so you keep more coins in your pocket!"
  },
  {
    id: "green",
    emoji: "🌱",
    name: "Green",
    key: "co2",
    explanation: route =>
      route.co2 === 0
        ? "makes no pollution at all in this demo, so the air stays clean and fresh!"
        : "has the lowest estimated emissions among these options, so the air stays cleaner for everyone!"
  }
];

const state = { destinationId: null, goalId: null };

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = text;
  return element;
}

function makeJourney(steps) {
  const journey = document.createElement("div");
  journey.className = "journey";
  journey.setAttribute("aria-label", "Journey steps");

  steps.forEach((step, index) => {
    if (index > 0) {
      const arrow = createElement("span", "ar", "➜");
      arrow.setAttribute("aria-hidden", "true");
      journey.appendChild(arrow);
    }
    journey.appendChild(createElement("span", null, step));
  });

  const endArrow = createElement("span", "ar", "➜");
  endArrow.setAttribute("aria-hidden", "true");
  journey.appendChild(endArrow);
  journey.appendChild(createElement("span", null, "📍"));

  return journey;
}

function makeStats(route) {
  const stats = document.createElement("div");
  stats.className = "stats";

  const values = [
    `⏱ ${route.minutes} min`,
    `💵 NT$${route.price}`,
    `🌍 ${route.co2.toFixed(1)} kg CO₂`
  ];

  values.forEach(value => stats.appendChild(createElement("span", "stat", value)));
  return stats;
}

function renderChoices() {
  const destinationContainer = document.getElementById("dest");
  const goalContainer = document.getElementById("goal");

  destinationContainer.replaceChildren();
  goalContainer.replaceChildren();

  DESTS.forEach(destination => {
    const button = createElement("button", "opt");
    button.type = "button";
    button.setAttribute("aria-pressed", String(state.destinationId === destination.id));

    const emoji = createElement("span", "e", destination.emoji);
    const name = createElement("span", null, destination.name);
    const chineseName = createElement("small", null, destination.zh);

    button.append(emoji, name, chineseName);
    button.addEventListener("click", () => {
      state.destinationId = destination.id;
      update();
    });

    destinationContainer.appendChild(button);
  });

  GOALS.forEach(goal => {
    const button = createElement("button", "opt");
    button.type = "button";
    button.setAttribute("aria-pressed", String(state.goalId === goal.id));
    button.append(
      createElement("span", "e", goal.emoji),
      createElement("span", null, goal.name)
    );

    button.addEventListener("click", () => {
      state.goalId = goal.id;
      update();
    });

    goalContainer.appendChild(button);
  });
}

function renderResults() {
  const resultContainer = document.getElementById("result");
  resultContainer.replaceChildren();

  if (!state.destinationId || !state.goalId) {
    let prompt;

    if (!state.destinationId && !state.goalId) {
      prompt = "👆 Pick a place and a goal to see your best route.";
    } else if (!state.destinationId) {
      prompt = "👆 Pick a place to see your best route.";
    } else {
      prompt = "👆 Pick a goal to see your best route.";
    }

    resultContainer.appendChild(createElement("div", "empty", prompt));
    return;
  }

  const destination = DESTS.find(item => item.id === state.destinationId);
  const goal = GOALS.find(item => item.id === state.goalId);

  // Defensive check in case the selected IDs no longer match the data.
  if (!destination || !goal) {
    resultContainer.appendChild(
      createElement("div", "empty", "Something went wrong. Please start again.")
    );
    return;
  }

  // Sort by the selected goal, then by travel time to break ties.
  const sortedRoutes = [...destination.routes].sort(
    (a, b) => a[goal.key] - b[goal.key] || a.minutes - b.minutes
  );
  const bestRoute = sortedRoutes[0];

  const bestSection = document.createElement("section");
  bestSection.className = "best";

  bestSection.appendChild(createElement("div", "badge", "🏆 YOUR BEST MATCH"));

  const title = document.createElement("div");
  const routeName = document.createElement("strong");
  routeName.textContent = bestRoute.name;
  title.append(routeName, document.createTextNode(` to ${destination.name} ${destination.emoji}`));
  bestSection.appendChild(title);

  bestSection.appendChild(makeJourney(bestRoute.steps));
  bestSection.appendChild(makeStats(bestRoute));
  bestSection.appendChild(
    createElement("p", "why", `🤖 I picked this route because it ${goal.explanation(bestRoute)}`)
  );

  resultContainer.appendChild(bestSection);
  resultContainer.appendChild(createElement("h2", null, "Other possible routes"));

  sortedRoutes.slice(1).forEach(route => {
    const alternative = document.createElement("article");
    alternative.className = "alt";

    alternative.appendChild(createElement("strong", null, route.name));
    alternative.appendChild(makeJourney(route.steps));
    alternative.appendChild(makeStats(route));

    resultContainer.appendChild(alternative);
  });
}

function update() {
  renderChoices();
  renderResults();
}

function resetPlanner() {
  state.destinationId = null;
  state.goalId = null;
  update();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// `defer` in index.html makes sure this runs after the HTML has been parsed.
function initializePlanner() {
  const resetButton = document.getElementById("reset");

  if (!resetButton) {
    console.error('Hsinchu Adventure Planner: could not find the element with id="reset".');
    return;
  }

  resetButton.addEventListener("click", resetPlanner);
  update();
}

document.addEventListener("DOMContentLoaded", initializePlanner);
