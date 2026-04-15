const byId = (id) => document.getElementById(id);

function toRadians(angleDeg) {
  return (angleDeg * Math.PI) / 180;
}

function projectileCalc(v, angleDeg, g) {
  const angle = toRadians(angleDeg);
  const time = (2 * v * Math.sin(angle)) / g;
  const range = (v * v * Math.sin(2 * angle)) / g;
  const maxHeight = (v * v * Math.sin(angle) ** 2) / (2 * g);

  return { time, range, maxHeight };
}

function drawProjectile(range, maxHeight) {
  const canvas = byId("projectileCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const margin = 36;
  const chartWidth = width - margin * 2;
  const chartHeight = height - margin * 2;
  const peakY = Math.max(maxHeight, 1);
  const maxX = Math.max(range, 1);

  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "#0a0a0f";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i += 1) {
    const y = margin + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(margin, y);
    ctx.lineTo(width - margin, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(168,85,247,0.85)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 120; i += 1) {
    const t = i / 120;
    const x = t * maxX;
    const y = 4 * peakY * t * (1 - t);
    const px = margin + (x / maxX) * chartWidth;
    const py = height - margin - (y / peakY) * chartHeight;
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(margin, height - margin);
  ctx.lineTo(width - margin, height - margin);
  ctx.moveTo(margin, margin);
  ctx.lineTo(margin, height - margin);
  ctx.stroke();
}

function setupProjectileSimulator() {
  const form = byId("projectileForm");
  const output = byId("projectileResults");
  if (!form || !output) return;

  const render = () => {
    const v = Number(byId("velocityInput")?.value ?? 0);
    const angle = Number(byId("angleInput")?.value ?? 0);
    const g = Number(byId("gravityInput")?.value ?? 9.8);

    if (v <= 0 || g <= 0 || angle <= 0 || angle >= 90) {
      output.classList.add("error");
      output.textContent = "Use valid values: speed > 0, gravity > 0, and angle between 1 and 89 degrees.";
      return;
    }

    const { time, range, maxHeight } = projectileCalc(v, angle, g);
    output.classList.remove("error");
    output.textContent =
      `Time of flight: ${time.toFixed(2)} s\n` +
      `Range: ${range.toFixed(2)} m\n` +
      `Max height: ${maxHeight.toFixed(2)} m`;
    drawProjectile(range, maxHeight);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    render();
  });

  render();
}

function setupFlashcards() {
  const card = byId("flashcardBody");
  if (!card) return;

  const question = byId("flashcardQuestion");
  const answer = byId("flashcardAnswer");
  const indexPill = byId("flashcardIndex");
  const flipButton = byId("flipCardButton");
  const nextButton = byId("nextCardButton");

  if (!question || !answer || !indexPill || !flipButton || !nextButton) return;

  const deck = [
    { q: "What does Newton's 1st Law describe?", a: "Inertia: an object remains at rest or constant velocity unless acted on by net force." },
    { q: "Write the kinetic energy equation.", a: "KE = 0.5mv^2" },
    { q: "What is the SI unit of momentum?", a: "kg*m/s" },
    { q: "How do you compute average velocity?", a: "v_avg = displacement / time interval" },
    { q: "What equation relates torque and angular acceleration?", a: "tau = I * alpha" }
  ];

  let index = 0;
  let showingAnswer = false;

  const render = () => {
    const item = deck[index];
    question.textContent = item.q;
    answer.textContent = showingAnswer ? item.a : "Click Flip to reveal answer.";
    indexPill.textContent = `Card ${index + 1} / ${deck.length}`;
  };

  flipButton.addEventListener("click", () => {
    showingAnswer = !showingAnswer;
    render();
  });

  nextButton.addEventListener("click", () => {
    index = (index + 1) % deck.length;
    showingAnswer = false;
    render();
  });

  card.addEventListener("click", () => {
    showingAnswer = !showingAnswer;
    render();
  });

  render();
}

function setupUnitConverter() {
  const form = byId("unitConverterForm");
  const output = byId("unitConverterResult");
  if (!form || !output) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = Number(byId("unitValue")?.value ?? 0);
    const mode = String(byId("unitMode")?.value ?? "m-to-cm");

    let result = 0;
    switch (mode) {
      case "m-to-cm":
        result = value * 100;
        output.textContent = `${value} m = ${result.toFixed(3)} cm`;
        break;
      case "cm-to-m":
        result = value / 100;
        output.textContent = `${value} cm = ${result.toFixed(3)} m`;
        break;
      case "kg-to-g":
        result = value * 1000;
        output.textContent = `${value} kg = ${result.toFixed(3)} g`;
        break;
      case "g-to-kg":
        result = value / 1000;
        output.textContent = `${value} g = ${result.toFixed(3)} kg`;
        break;
      case "deg-to-rad":
        result = toRadians(value);
        output.textContent = `${value} deg = ${result.toFixed(4)} rad`;
        break;
      case "rad-to-deg":
        result = (value * 180) / Math.PI;
        output.textContent = `${value} rad = ${result.toFixed(3)} deg`;
        break;
      default:
        output.textContent = "Select a conversion mode.";
    }
  });
}

setupProjectileSimulator();
setupFlashcards();
setupUnitConverter();
