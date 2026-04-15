import { flashcards } from './data/flashcards.js'
import { questionBank } from './data/questions.js'
import { formulaSheet, studyTopics } from './data/studyContent.js'

const storageKeys = {
  practiceHistory: 'phys-practice-history',
  checklist: 'phys-study-checklist',
  masteredTopics: 'phys-mastered-topics',
  reviewedFlashcards: 'phys-reviewed-flashcards'
}

const pageSections = [
  { key: 'home', href: 'index.html', label: 'Home', title: 'PHYS 1 Command Center', badge: 'Featured' },
  { key: 'study-guide', href: 'study-guide.html', label: 'Study Guide', title: 'Core Topics', badge: 'Reference' },
  { key: 'formula-sheet', href: 'formula-sheet.html', label: 'Formula Sheet', title: 'Formula Grid', badge: 'Reference' },
  { key: 'practice', href: 'practice.html', label: 'Practice', title: 'Exam Mode', badge: 'Practice' },
  { key: 'simulators', href: 'simulators.html', label: 'Simulators', title: 'Visual Labs', badge: 'Visual' },
  { key: 'flashcards', href: 'flashcards.html', label: 'Flashcards', title: 'Rapid Recall', badge: 'Review' },
  { key: 'tools', href: 'tools.html', label: 'Tools', title: 'Workflow Tools', badge: 'Utility' },
  { key: 'resources', href: 'resources.html', label: 'Resources', title: 'Resources & Team', badge: 'Archive' }
]

const pageSectionsByKey = Object.fromEntries(pageSections.map((section) => [section.key, section]))
const checklistItems = [
  { id: 'draw-diagram', label: 'Draw and label a diagram' },
  { id: 'list-knowns', label: 'List known/unknown variables with units' },
  { id: 'pick-model', label: 'Pick the right model (forces, energy, momentum)' },
  { id: 'solve-symbolic', label: 'Solve symbolically before plugging values' },
  { id: 'check-units', label: 'Check units and signs on the final answer' },
  { id: 'sanity-check', label: 'Sanity-check magnitude and direction' }
]

const conversions = {
  m_to_cm: { label: 'Meters -> Centimeters', convert: (value) => `${(value * 100).toFixed(2)} cm` },
  cm_to_m: { label: 'Centimeters -> Meters', convert: (value) => `${(value / 100).toFixed(4)} m` },
  kmh_to_ms: { label: 'km/h -> m/s', convert: (value) => `${(value / 3.6).toFixed(3)} m/s` },
  ms_to_kmh: { label: 'm/s -> km/h', convert: (value) => `${(value * 3.6).toFixed(3)} km/h` },
  n_to_kn: { label: 'Newtons -> kiloNewtons', convert: (value) => `${(value / 1000).toFixed(5)} kN` },
  j_to_kj: { label: 'Joules -> kiloJoules', convert: (value) => `${(value / 1000).toFixed(5)} kJ` }
}

const formulaFinderOptions = [
  { label: 'Known mass + acceleration, need net force', result: 'Use Sigma F = ma.' },
  { label: 'Known initial/final speed + displacement, need acceleration', result: 'Use v^2 = v0^2 + 2aDelta x.' },
  { label: 'Known mass + height, need gravitational potential energy', result: 'Use Ug = mgh.' },
  { label: 'Known masses/velocities before collision, need final values', result: 'Use momentum conservation: m1u1 + m2u2 = m1v1 + m2v2.' },
  { label: 'Known spring constant and mass, need SHM period', result: 'Use T = 2pi*sqrt(m/k).' },
  { label: 'Known force and lever arm, need torque', result: 'Use tau = rF sin(phi).' }
]

function getCurrentPageBase() {
  const path = window.location.pathname
  const file = path.substring(path.lastIndexOf('/') + 1) || 'index.html'
  const base = file.split('.')[0]
  return base === 'index' || base === '' ? 'home' : base
}

function buildPageTemplate(base) {
  const uniqueFormulaTopics = new Set(formulaSheet.map((item) => item.topic)).size

  const modeCards = pageSections
    .filter((section) => section.key !== 'home')
    .map(
      (section) => `
      <a class="bento-card mode-card" href="${section.href}">
        <p class="card-eyebrow">${section.badge}</p>
        <h3>${section.label}</h3>
        <p>${section.title}</p>
        <span class="badge-pill">OPEN</span>
      </a>
    `
    )
    .join('')

  const templates = {
    home: `
      <section class="bento-grid">
        <article class="bento-card featured-card">
          <p class="card-eyebrow">Control Room</p>
          <h2>Physics 1 Study System</h2>
          <p>Multi-page workflow built for Mechanics prep: textbook review, formula references, visual labs, timed exams, and spaced retrieval.</p>
          <div class="card-actions">
            <a class="button button-primary" href="study-guide.html">Start Study Guide</a>
            <a class="button button-ghost" href="simulators.html">Open Visual Labs</a>
          </div>
          <div class="gradient-line" role="presentation"></div>
          <div class="metric-strip">
            <div><span>Topics</span><strong>${studyTopics.length}</strong></div>
            <div><span>Questions</span><strong>${questionBank.length}</strong></div>
            <div><span>Flashcards</span><strong>${flashcards.length}</strong></div>
          </div>
        </article>

        <article class="bento-card tall-card">
          <p class="card-eyebrow">Status</p>
          <h3>Progress Snapshot</h3>
          <span class="badge-pill">LOCAL SAVE</span>
          <div id="home-progress-summary" class="stack"></div>
        </article>

        <article class="bento-card wide-card">
          <p class="card-eyebrow">Workflow</p>
          <h3>Recommended Sequence</h3>
          <ol class="tight-list">
            <li>Read study chapters and formula cards.</li>
            <li>Run visual simulators to build intuition.</li>
            <li>Take timed mixed practice.</li>
            <li>Lock in recall with flashcards and trackers.</li>
          </ol>
        </article>

        ${modeCards}
      </section>
    `,
    'study-guide': `
      <section class="bento-grid">
        <article class="bento-card featured-card">
          <p class="card-eyebrow">Reference</p>
          <h2>Core Physics 1 Study Guide</h2>
          <p>Each module includes summary, formulas, mistakes, worked example, and a checkpoint reveal.</p>
          <span class="badge-pill">TOPIC CARDS</span>
        </article>
        <article class="bento-card tall-card">
          <p class="card-eyebrow">Map</p>
          <h3>Topic Index</h3>
          <nav class="chapter-nav">
            ${studyTopics.map((topic) => `<a href="#topic-${topic.id}">${topic.title}</a>`).join('')}
          </nav>
        </article>
        <article class="bento-card wide-card">
          <p class="card-eyebrow">Method</p>
          <h3>How to use this page</h3>
          <p>Read one card at a time, commit to checkpoint answer, then reveal and compare reasoning.</p>
        </article>
        <div id="study-guide-list" class="topic-grid"></div>
      </section>
    `,
    'formula-sheet': `
      <section class="bento-grid">
        <article class="bento-card featured-card">
          <p class="card-eyebrow">Reference</p>
          <h2>Formula Sheet by Topic</h2>
          <p>Fast scan cards grouped by concept so you can jump directly to the equation family you need.</p>
          <div class="metric-strip">
            <div><span>Groups</span><strong>${uniqueFormulaTopics}</strong></div>
            <div><span>Entries</span><strong>${formulaSheet.length}</strong></div>
          </div>
        </article>
        <article class="bento-card tall-card">
          <p class="card-eyebrow">Tip</p>
          <h3>Exam use</h3>
          <ul class="tight-list">
            <li>Write knowns with units first.</li>
            <li>Pick equation by unknown count.</li>
            <li>Check vector signs before final value.</li>
          </ul>
        </article>
        <article class="bento-card wide-card">
          <p class="card-eyebrow">Legend</p>
          <h3>Monospace equations, muted notes</h3>
          <p>Use equation lines for setup and note lines for assumptions or limitations.</p>
        </article>
        <div id="formula-sheet-list" class="formula-grid"></div>
      </section>
    `,
    practice: `
      <section class="bento-grid">
        <article class="bento-card featured-card">
          <p class="card-eyebrow">Practice</p>
          <h2>Timed / Untimed Exam Builder</h2>
          <p>Choose mixed or single topic, set question count, and get a detailed answer review at the end.</p>
        </article>
        <article class="bento-card tall-card">
          <p class="card-eyebrow">Protocol</p>
          <h3>Session Rules</h3>
          <ul class="tight-list">
            <li>Run mixed mode for broad coverage.</li>
            <li>Use topic mode to isolate weak units.</li>
            <li>Review every explanation, not just score.</li>
          </ul>
        </article>
        <article class="bento-card wide-card form-card">
          <p class="card-eyebrow">Controls</p>
          <h3>Start a run</h3>
          <form id="exam-controls" class="control-grid">
            <label>Mode
              <select id="exam-mode">
                <option value="mixed">Mixed review</option>
                <option value="topic">Single topic</option>
              </select>
            </label>
            <label>Topic
              <select id="exam-topic"></select>
            </label>
            <label>Question count
              <input id="exam-count" type="number" min="5" max="30" value="10" />
            </label>
            <label>Timed
              <select id="exam-timed">
                <option value="no">Untimed</option>
                <option value="yes">Timed</option>
              </select>
            </label>
            <label>Minutes
              <input id="exam-minutes" type="number" min="5" max="60" value="15" />
            </label>
            <button id="start-exam" type="button" class="button button-primary">Start</button>
          </form>
          <p id="exam-status" class="status" aria-live="polite"></p>
        </article>
        <article class="bento-card wide-card" id="exam-area" aria-live="polite"></article>
        <article class="bento-card wide-card" id="history-area" aria-live="polite"></article>
      </section>
    `,
    simulators: `
      <section class="bento-grid">
        <article class="bento-card featured-card">
          <p class="card-eyebrow">Visual Labs</p>
          <h2>Interactive Simulators with Visualizers</h2>
          <p>Each simulator now includes a visual output panel so you can see behavior, not just read numbers.</p>
          <span class="badge-pill">GRAPHIC OUTPUT ENABLED</span>
        </article>

        <article class="bento-card tall-card">
          <p class="card-eyebrow">Read this first</p>
          <h3>Lab Method</h3>
          <ul class="tight-list">
            <li>Change one variable at a time.</li>
            <li>Use visuals to detect trends.</li>
            <li>Confirm with equation outputs.</li>
          </ul>
        </article>

        <article class="bento-card wide-card sim-card">
          <p class="card-eyebrow">Projectile</p>
          <h3>Trajectory Plotter</h3>
          <div class="sim-controls">
            <label>v0 (m/s)<input id="proj-speed" type="number" value="20" step="0.1" /></label>
            <label>angle (deg)<input id="proj-angle" type="number" value="35" step="0.1" /></label>
            <label>g (m/s^2)<input id="proj-g" type="number" value="9.8" step="0.1" /></label>
            <button id="proj-run" type="button" class="button button-primary">Run</button>
          </div>
          <svg id="proj-plot" viewBox="0 0 400 180" class="viz-box" role="img" aria-label="Projectile path visualizer"></svg>
          <p id="proj-output" class="status mono-text" aria-live="polite"></p>
        </article>

        <article class="bento-card wide-card sim-card">
          <p class="card-eyebrow">Forces</p>
          <h3>Force Balance Bars</h3>
          <div class="sim-controls">
            <label>mass (kg)<input id="force-mass" type="number" value="5" step="0.1" /></label>
            <label>applied (N)<input id="force-applied" type="number" value="25" step="0.1" /></label>
            <label>mu_k<input id="force-mu" type="number" value="0.2" step="0.01" /></label>
            <button id="force-run" type="button" class="button button-primary">Run</button>
          </div>
          <div class="bar-stack">
            <div><span>Applied</span><div class="bar-shell"><div id="force-applied-bar" class="bar-fill"></div></div></div>
            <div><span>Friction</span><div class="bar-shell"><div id="force-friction-bar" class="bar-fill"></div></div></div>
            <div><span>Net</span><div class="bar-shell"><div id="force-net-bar" class="bar-fill"></div></div></div>
          </div>
          <p id="force-output" class="status mono-text" aria-live="polite"></p>
        </article>

        <article class="bento-card wide-card sim-card">
          <p class="card-eyebrow">Energy</p>
          <h3>Energy Composition</h3>
          <div class="sim-controls">
            <label>mass (kg)<input id="energy-mass" type="number" value="1" step="0.1" /></label>
            <label>height (m)<input id="energy-height" type="number" value="2" step="0.1" /></label>
            <label>speed (m/s)<input id="energy-speed" type="number" value="3" step="0.1" /></label>
            <label>k (N/m)<input id="energy-k" type="number" value="80" step="1" /></label>
            <label>x (m)<input id="energy-x" type="number" value="0.2" step="0.01" /></label>
            <button id="energy-run" type="button" class="button button-primary">Run</button>
          </div>
          <div class="bar-stack">
            <div><span>KE</span><div class="bar-shell"><div id="energy-ke-bar" class="bar-fill"></div></div></div>
            <div><span>Ug</span><div class="bar-shell"><div id="energy-ug-bar" class="bar-fill"></div></div></div>
            <div><span>Us</span><div class="bar-shell"><div id="energy-us-bar" class="bar-fill"></div></div></div>
          </div>
          <p id="energy-output" class="status mono-text" aria-live="polite"></p>
        </article>

        <article class="bento-card wide-card sim-card">
          <p class="card-eyebrow">Momentum</p>
          <h3>Collision Visualizer</h3>
          <div class="sim-controls">
            <label>m1 (kg)<input id="mom-m1" type="number" value="1" step="0.1" /></label>
            <label>u1 (m/s)<input id="mom-u1" type="number" value="4" step="0.1" /></label>
            <label>m2 (kg)<input id="mom-m2" type="number" value="2" step="0.1" /></label>
            <label>u2 (m/s)<input id="mom-u2" type="number" value="0" step="0.1" /></label>
            <label>type
              <select id="mom-type">
                <option value="elastic">Elastic</option>
                <option value="inelastic">Perfectly inelastic</option>
              </select>
            </label>
            <button id="mom-run" type="button" class="button button-primary">Run</button>
          </div>
          <svg id="mom-viz" viewBox="0 0 400 120" class="viz-box" role="img" aria-label="Collision visualizer"></svg>
          <p id="mom-output" class="status mono-text" aria-live="polite"></p>
        </article>

        <article class="bento-card wide-card sim-card">
          <p class="card-eyebrow">Oscillation / Rotation</p>
          <h3>Wave + Dial Visualizer</h3>
          <div class="sim-controls">
            <label>mode
              <select id="osc-mode">
                <option value="shm">SHM</option>
                <option value="rotation">Rotation</option>
              </select>
            </label>
            <div id="osc-shm-inputs" class="sim-inline-group">
              <label>m (kg)<input id="shm-mass" type="number" value="0.4" step="0.1" /></label>
              <label>k (N/m)<input id="shm-k" type="number" value="64" step="1" /></label>
              <label>A (m)<input id="shm-a" type="number" value="0.15" step="0.01" /></label>
            </div>
            <div id="osc-rot-inputs" class="sim-inline-group hidden">
              <label>F (N)<input id="rot-force" type="number" value="2" step="0.1" /></label>
              <label>r (m)<input id="rot-radius" type="number" value="0.3" step="0.01" /></label>
              <label>I (kg*m^2)<input id="rot-i" type="number" value="0.18" step="0.01" /></label>
            </div>
            <button id="osc-run" type="button" class="button button-primary">Run</button>
          </div>
          <svg id="osc-viz" viewBox="0 0 400 140" class="viz-box" role="img" aria-label="SHM or rotation visualizer"></svg>
          <p id="osc-output" class="status mono-text" aria-live="polite"></p>
        </article>
      </section>
    `,
    flashcards: `
      <section class="bento-grid">
        <article class="bento-card featured-card">
          <p class="card-eyebrow">Review</p>
          <h2>Flashcards</h2>
          <p>Use quick retrieval cycles with topic filtering to improve exam-speed recall.</p>
        </article>
        <article class="bento-card tall-card">
          <p class="card-eyebrow">Rule</p>
          <h3>Active Recall</h3>
          <p>Attempt the front from memory first. Reveal only after committing to an answer.</p>
          <span class="badge-pill">SPACED RETRIEVAL</span>
        </article>
        <article class="bento-card wide-card form-card">
          <p class="card-eyebrow">Controls</p>
          <h3>Deck controls</h3>
          <div class="control-row">
            <label>Topic
              <select id="flash-topic"></select>
            </label>
            <button id="flash-prev" type="button" class="button button-ghost">Prev</button>
            <button id="flash-reveal" type="button" class="button button-primary">Reveal</button>
            <button id="flash-next" type="button" class="button button-ghost">Next</button>
            <button id="flash-random" type="button" class="button button-ghost">Random</button>
          </div>
          <article id="flash-card" class="flash-card"></article>
          <p id="flash-meta" class="status" aria-live="polite"></p>
        </article>
      </section>
    `,
    tools: `
      <section class="bento-grid">
        <article class="bento-card featured-card">
          <p class="card-eyebrow">Utility</p>
          <h2>Study Tools Dashboard</h2>
          <p>Checklist, converter, formula finder, and progress tracking in one modular workspace.</p>
          <div id="progress-summary" class="stack"></div>
        </article>
        <article class="bento-card tall-card">
          <p class="card-eyebrow">Checklist</p>
          <h3>Problem-Solving Routine</h3>
          <div id="checklist-box" class="stack"></div>
        </article>
        <article class="bento-card wide-card form-card">
          <p class="card-eyebrow">Converter</p>
          <h3>Unit Conversion Helper</h3>
          <div class="control-grid two-col-mini">
            <label>Conversion
              <select id="convert-type"></select>
            </label>
            <label>Value
              <input id="convert-value" type="number" value="1" step="any" />
            </label>
          </div>
          <p id="convert-output" class="status mono-text" aria-live="polite"></p>
          <div class="gradient-line" role="presentation"></div>
          <label>Formula finder
            <select id="finder-select"></select>
          </label>
          <p id="finder-output" class="status" aria-live="polite"></p>
        </article>
        <article class="bento-card wide-card">
          <p class="card-eyebrow">Tracker</p>
          <h3>Topic Mastery</h3>
          <div id="topic-progress" class="stack"></div>
        </article>
      </section>
    `,
    resources: `
      <section class="bento-grid">
        <article class="bento-card featured-card">
          <p class="card-eyebrow">Archive</p>
          <h2>Resources & Team</h2>
          <p>Essential study links plus project credits.</p>
        </article>
        <article class="bento-card tall-card">
          <p class="card-eyebrow">Team</p>
          <h3>Project Contributors</h3>
          <ul class="tight-list">
            <li>Tyler Abell</li>
            <li>Andrew Garza</li>
            <li>David Peine</li>
            <li>Xavier Robles</li>
          </ul>
        </article>
        <article class="bento-card wide-card">
          <p class="card-eyebrow">Study Links</p>
          <h3>Recommended References</h3>
          <ul class="tight-list">
            <li><a href="https://openstax.org/details/books/university-physics-volume-1" target="_blank" rel="noreferrer">OpenStax University Physics Vol. 1</a></li>
            <li><a href="https://phet.colorado.edu" target="_blank" rel="noreferrer">PhET Interactive Simulations</a></li>
            <li><a href="https://www.khanacademy.org/science/physics" target="_blank" rel="noreferrer">Khan Academy Physics</a></li>
            <li><a href="https://www.desmos.com/scientific" target="_blank" rel="noreferrer">Desmos Scientific Calculator</a></li>
          </ul>
        </article>
      </section>
    `
  }

  return templates[base] || templates.home
}

function renderPage() {
  const app = document.querySelector('#app')
  if (!app) {
    throw new Error('App container missing.')
  }

  const base = getCurrentPageBase()
  const page = pageSectionsByKey[base] || pageSectionsByKey.home
  const navLinks = pageSections
    .map(
      (section) =>
        `<a href="${section.href}"${section.key === base ? ' class="active" aria-current="page"' : ''}>${section.label}</a>`
    )
    .join('')

  document.title = `${page.title} · PHYS Extra Credit`

  app.innerHTML = `
    <div class="site-shell">
      <header class="site-header">
        <div class="site-brand">
          <p class="app-kicker">PHYS EXTRA CREDIT</p>
          <h1>${page.title}</h1>
          <p class="muted">Built by Tyler Abell, Andrew Garza, David Peine, and Xavier Robles</p>
        </div>
        <span class="badge-pill">MIDNIGHT MODE</span>
      </header>
      <nav class="site-nav" id="site-nav" aria-label="Main navigation">${navLinks}</nav>
      <main>${buildPageTemplate(base)}</main>
    </div>
  `

  setupByPage(base)
  updateProgressSummary()
}

function setupByPage(base) {
  switch (base) {
    case 'study-guide':
      renderStudyGuide()
      break
    case 'formula-sheet':
      renderFormulaSheet()
      break
    case 'practice':
      setupPracticeExam()
      break
    case 'simulators':
      setupSimulators()
      break
    case 'flashcards':
      setupFlashcards()
      break
    case 'tools':
      setupTools()
      break
    default:
      break
  }
}

function renderStudyGuide() {
  const container = getById('study-guide-list')
  container.innerHTML = studyTopics
    .map(
      (topic) => `
      <article class="bento-card topic-card" id="topic-${topic.id}">
        <p class="card-eyebrow">Topic</p>
        <h3>${topic.title}</h3>
        <p>${topic.summary}</p>
        <div class="topic-columns">
          <div>
            <h4>Formulas</h4>
            <ul>${topic.formulas.map((formula) => `<li class="mono-text">${formula}</li>`).join('')}</ul>
          </div>
          <div>
            <h4>Common mistakes</h4>
            <ul>${topic.mistakes.map((mistake) => `<li>${mistake}</li>`).join('')}</ul>
          </div>
        </div>
        <h4>Worked example</h4>
        <p><strong>Prompt:</strong> ${topic.example.prompt}</p>
        <ol>${topic.example.steps.map((step) => `<li>${step}</li>`).join('')}</ol>
        <p><strong>Answer:</strong> ${topic.example.answer}</p>
        <div class="checkpoint">
          <p><strong>Checkpoint:</strong> ${topic.checkpoint.question}</p>
          <ul>${topic.checkpoint.options.map((choice, index) => `<li>${String.fromCharCode(65 + index)}. ${choice}</li>`).join('')}</ul>
          <button type="button" class="button button-ghost" data-checkpoint="${topic.id}">Reveal checkpoint answer</button>
          <p id="checkpoint-${topic.id}" class="hidden"><strong>Answer:</strong> ${String.fromCharCode(65 + topic.checkpoint.answerIndex)}. ${topic.checkpoint.options[topic.checkpoint.answerIndex]} - ${topic.checkpoint.explanation}</p>
        </div>
      </article>
    `
    )
    .join('')

  container.querySelectorAll('button[data-checkpoint]').forEach((button) => {
    button.addEventListener('click', () => {
      const topicId = button.dataset.checkpoint
      if (!topicId) {
        return
      }
      getById(`checkpoint-${topicId}`).classList.toggle('hidden')
    })
  })
}

function renderFormulaSheet() {
  const container = getById('formula-sheet-list')
  const groups = groupBy(formulaSheet, (item) => item.topic)
  container.innerHTML = Object.entries(groups)
    .map(
      ([topic, formulas]) => `
      <article class="bento-card formula-card">
        <p class="card-eyebrow">Formula Group</p>
        <h3>${topic}</h3>
        <ul>
          ${formulas
            .map(
              (formula) => `
            <li>
              <strong>${formula.name}</strong>
              <p class="mono-text">${formula.expression}</p>
              <p class="muted">${formula.note}</p>
            </li>
          `
            )
            .join('')}
        </ul>
      </article>
    `
    )
    .join('')
}

function setupPracticeExam() {
  const modeSelect = getById('exam-mode')
  const topicSelect = getById('exam-topic')
  const countInput = getById('exam-count')
  const timedSelect = getById('exam-timed')
  const minutesInput = getById('exam-minutes')
  const startButton = getById('start-exam')
  const status = getById('exam-status')
  const examArea = getById('exam-area')
  const historyArea = getById('history-area')
  const topics = Array.from(new Set(questionBank.map((question) => question.topic)))

  topicSelect.innerHTML = topics.map((topic) => `<option value="${topic}">${topic}</option>`).join('')

  let activeExam = null

  const clearTimer = () => {
    if (activeExam && activeExam.timerId !== null) {
      window.clearInterval(activeExam.timerId)
      activeExam.timerId = null
    }
  }

  const renderHistory = () => {
    const history = loadJson(storageKeys.practiceHistory, [])
    if (history.length === 0) {
      historyArea.innerHTML = '<p class="card-eyebrow">History</p><h3>No attempts yet</h3><p>Start your first practice run.</p>'
      return
    }
    const best = history.reduce((max, attempt) => Math.max(max, attempt.percent), 0)
    historyArea.innerHTML = `
      <p class="card-eyebrow">History</p>
      <h3>Recent attempts</h3>
      <p><strong>Best score:</strong> ${best.toFixed(1)}%</p>
      <ul class="tight-list">
        ${history
          .slice(0, 8)
          .map(
            (attempt) =>
              `<li>${new Date(attempt.date).toLocaleString()} - ${attempt.mode === 'mixed' ? 'Mixed' : attempt.topic} ${attempt.timed ? '(Timed)' : '(Untimed)'}: ${attempt.score}/${attempt.total} (${attempt.percent.toFixed(1)}%)</li>`
          )
          .join('')}
      </ul>
    `
  }

  const finishExam = () => {
    if (!activeExam) {
      return
    }

    clearTimer()
    const score = activeExam.questions.reduce(
      (sum, question, index) => sum + Number(activeExam.answers[index] === question.correctIndex),
      0
    )
    const percent = (score / activeExam.questions.length) * 100
    const attempt = {
      date: new Date().toISOString(),
      topic: activeExam.topic,
      timed: activeExam.timed,
      mode: activeExam.mode,
      score,
      total: activeExam.questions.length,
      percent
    }

    const history = loadJson(storageKeys.practiceHistory, [])
    history.unshift(attempt)
    saveJson(storageKeys.practiceHistory, history.slice(0, 20))

    status.textContent = `Finished: ${score}/${activeExam.questions.length} (${percent.toFixed(1)}%).`
    examArea.innerHTML = `
      <p class="card-eyebrow">Review</p>
      <h3>Answer Review</h3>
      ${activeExam.questions
        .map((question, index) => {
          const selected = activeExam.answers[index]
          const isCorrect = selected === question.correctIndex
          const userText = selected === null ? 'No answer' : question.choices[selected]
          return `
            <article class="review-item ${isCorrect ? 'correct' : 'incorrect'}">
              <p><strong>Q${index + 1}:</strong> ${question.prompt}</p>
              <p><strong>Your answer:</strong> ${userText}</p>
              <p><strong>Correct answer:</strong> ${question.choices[question.correctIndex]}</p>
              <p><strong>Why:</strong> ${question.explanation}</p>
            </article>
          `
        })
        .join('')}
    `

    activeExam = null
    renderHistory()
    updateProgressSummary()
  }

  const renderQuestion = () => {
    if (!activeExam) {
      return
    }

    const question = activeExam.questions[activeExam.currentIndex]
    const selected = activeExam.answers[activeExam.currentIndex]

    examArea.innerHTML = `
      <p class="card-eyebrow">Question ${activeExam.currentIndex + 1} / ${activeExam.questions.length}</p>
      <h3>${question.prompt}</h3>
      <div class="stack">
        ${question.choices
          .map(
            (choice, index) => `
            <label class="choice-option">
              <input type="radio" name="answer" value="${index}" ${selected === index ? 'checked' : ''} />
              ${String.fromCharCode(65 + index)}. ${choice}
            </label>
          `
          )
          .join('')}
      </div>
      <div class="control-row">
        <button id="exam-prev" type="button" class="button button-ghost" ${activeExam.currentIndex === 0 ? 'disabled' : ''}>Previous</button>
        <button id="exam-next" type="button" class="button button-primary">${activeExam.currentIndex === activeExam.questions.length - 1 ? 'Finish' : 'Next'}</button>
      </div>
    `

    examArea.querySelectorAll('input[name="answer"]').forEach((input) => {
      input.addEventListener('change', () => {
        if (!activeExam) {
          return
        }
        activeExam.answers[activeExam.currentIndex] = Number(input.value)
      })
    })

    getById('exam-prev').addEventListener('click', () => {
      if (!activeExam) {
        return
      }
      activeExam.currentIndex -= 1
      renderQuestion()
    })

    getById('exam-next').addEventListener('click', () => {
      if (!activeExam) {
        return
      }
      if (activeExam.currentIndex === activeExam.questions.length - 1) {
        finishExam()
        return
      }
      activeExam.currentIndex += 1
      renderQuestion()
    })
  }

  startButton.addEventListener('click', () => {
    clearTimer()
    const mode = modeSelect.value === 'topic' ? 'topic' : 'mixed'
    const timed = timedSelect.value === 'yes'
    const requestedCount = clamp(Math.round(Number(countInput.value)), 5, 30)
    const topic = topicSelect.value
    const pool = mode === 'mixed' ? questionBank : questionBank.filter((question) => question.topic === topic)
    const questions = shuffle([...pool]).slice(0, Math.min(requestedCount, pool.length))

    if (questions.length === 0) {
      status.textContent = 'No questions available for this selection.'
      return
    }

    const minutes = clamp(Math.round(Number(minutesInput.value)), 5, 60)
    activeExam = {
      questions,
      answers: Array.from({ length: questions.length }).fill(null),
      currentIndex: 0,
      timed,
      remainingSeconds: minutes * 60,
      timerId: null,
      topic,
      mode
    }

    const modeLabel = mode === 'mixed' ? 'Mixed review' : topic
    status.textContent = timed
      ? `${modeLabel} started. Time left: ${formatTime(activeExam.remainingSeconds)}.`
      : `${modeLabel} started (untimed).`

    if (timed) {
      activeExam.timerId = window.setInterval(() => {
        if (!activeExam) {
          return
        }
        activeExam.remainingSeconds -= 1
        status.textContent = `${modeLabel} in progress. Time left: ${formatTime(activeExam.remainingSeconds)}.`
        if (activeExam.remainingSeconds <= 0) {
          finishExam()
        }
      }, 1000)
    }

    renderQuestion()
  })

  modeSelect.addEventListener('change', () => {
    topicSelect.disabled = modeSelect.value !== 'topic'
  })
  topicSelect.disabled = modeSelect.value !== 'topic'
  renderHistory()
}

function setupSimulators() {
  const projOutput = getById('proj-output')
  const projPlot = getById('proj-plot')
  getById('proj-run').addEventListener('click', () => {
    const v0 = getNumber('proj-speed')
    const angle = degToRad(getNumber('proj-angle'))
    const gravity = getNumber('proj-g')
    const v0y = v0 * Math.sin(angle)
    const time = (2 * v0y) / gravity
    const range = (v0 ** 2 * Math.sin(2 * angle)) / gravity
    const maxHeight = v0y ** 2 / (2 * gravity)
    projOutput.textContent = `time=${time.toFixed(2)} s | range=${range.toFixed(2)} m | maxH=${maxHeight.toFixed(2)} m`
    drawProjectilePath(projPlot, range, maxHeight)
  })

  const forceOutput = getById('force-output')
  getById('force-run').addEventListener('click', () => {
    const mass = getNumber('force-mass')
    const applied = getNumber('force-applied')
    const mu = getNumber('force-mu')
    const normal = mass * 9.8
    const friction = mu * normal
    const net = applied - friction
    const accel = net / mass
    forceOutput.textContent = `N=${normal.toFixed(2)} N | Ff=${friction.toFixed(2)} N | Fnet=${net.toFixed(2)} N | a=${accel.toFixed(2)} m/s^2`
    const max = Math.max(Math.abs(applied), Math.abs(friction), Math.abs(net), 1)
    setBarWidth('force-applied-bar', (Math.abs(applied) / max) * 100)
    setBarWidth('force-friction-bar', (Math.abs(friction) / max) * 100)
    setBarWidth('force-net-bar', (Math.abs(net) / max) * 100)
  })

  const energyOutput = getById('energy-output')
  getById('energy-run').addEventListener('click', () => {
    const mass = getNumber('energy-mass')
    const height = getNumber('energy-height')
    const speed = getNumber('energy-speed')
    const springK = getNumber('energy-k')
    const compression = getNumber('energy-x')
    const kinetic = 0.5 * mass * speed ** 2
    const grav = mass * 9.8 * height
    const spring = 0.5 * springK * compression ** 2
    const total = kinetic + grav + spring
    energyOutput.textContent = `KE=${kinetic.toFixed(2)} J | Ug=${grav.toFixed(2)} J | Us=${spring.toFixed(2)} J | total=${total.toFixed(2)} J`
    const max = Math.max(kinetic, grav, spring, 1)
    setBarWidth('energy-ke-bar', (kinetic / max) * 100)
    setBarWidth('energy-ug-bar', (grav / max) * 100)
    setBarWidth('energy-us-bar', (spring / max) * 100)
  })

  const momentumOutput = getById('mom-output')
  const momentumViz = getById('mom-viz')
  getById('mom-run').addEventListener('click', () => {
    const m1 = getNumber('mom-m1')
    const u1 = getNumber('mom-u1')
    const m2 = getNumber('mom-m2')
    const u2 = getNumber('mom-u2')
    const type = getById('mom-type').value
    let v1 = 0
    let v2 = 0
    if (type === 'inelastic') {
      v1 = (m1 * u1 + m2 * u2) / (m1 + m2)
      v2 = v1
      momentumOutput.textContent = `inelastic: v=${v1.toFixed(2)} m/s (both masses)`
    } else {
      v1 = ((m1 - m2) / (m1 + m2)) * u1 + ((2 * m2) / (m1 + m2)) * u2
      v2 = ((2 * m1) / (m1 + m2)) * u1 + ((m2 - m1) / (m1 + m2)) * u2
      momentumOutput.textContent = `elastic: v1=${v1.toFixed(2)} m/s, v2=${v2.toFixed(2)} m/s`
    }
    drawCollisionViz(momentumViz, { m1, m2, u1, u2, v1, v2 })
  })

  const modeSelect = getById('osc-mode')
  const shmInputs = getById('osc-shm-inputs')
  const rotInputs = getById('osc-rot-inputs')
  const oscOutput = getById('osc-output')
  const oscViz = getById('osc-viz')

  modeSelect.addEventListener('change', () => {
    const shmMode = modeSelect.value === 'shm'
    shmInputs.classList.toggle('hidden', !shmMode)
    rotInputs.classList.toggle('hidden', shmMode)
  })

  getById('osc-run').addEventListener('click', () => {
    if (modeSelect.value === 'shm') {
      const mass = getNumber('shm-mass')
      const springK = getNumber('shm-k')
      const amplitude = getNumber('shm-a')
      const omega = Math.sqrt(springK / mass)
      const period = (2 * Math.PI) / omega
      const vmax = omega * amplitude
      const energy = 0.5 * springK * amplitude ** 2
      oscOutput.textContent = `SHM: omega=${omega.toFixed(2)} rad/s | T=${period.toFixed(2)} s | vmax=${vmax.toFixed(2)} m/s | E=${energy.toFixed(2)} J`
      drawWaveViz(oscViz, amplitude, omega)
      return
    }
    const force = getNumber('rot-force')
    const radius = getNumber('rot-radius')
    const inertia = getNumber('rot-i')
    const torque = force * radius
    const alpha = torque / inertia
    const theta2s = 0.5 * alpha * 4
    oscOutput.textContent = `Rotation: tau=${torque.toFixed(2)} N*m | alpha=${alpha.toFixed(2)} rad/s^2 | theta(2s)=${theta2s.toFixed(2)} rad`
    drawRotationViz(oscViz, theta2s)
  })

  getById('proj-run').click()
  getById('force-run').click()
  getById('energy-run').click()
  getById('mom-run').click()
  getById('osc-run').click()
}

function setupFlashcards() {
  const topicSelect = getById('flash-topic')
  const cardBox = getById('flash-card')
  const meta = getById('flash-meta')
  const reviewedSet = new Set(loadJson(storageKeys.reviewedFlashcards, []))

  topicSelect.innerHTML = ['All', ...Array.from(new Set(flashcards.map((card) => card.topic)))]
    .map((topic) => `<option value="${topic}">${topic}</option>`)
    .join('')

  let filtered = [...flashcards]
  let index = 0
  let revealed = false

  const render = () => {
    if (filtered.length === 0) {
      cardBox.innerHTML = '<p>No flashcards in this filter.</p>'
      meta.textContent = ''
      return
    }
    const card = filtered[index]
    cardBox.innerHTML = `
      <p class="card-eyebrow">${card.topic}</p>
      <h3>${card.front}</h3>
      <p class="${revealed ? '' : 'hidden'}"><strong>Answer:</strong> ${card.back}</p>
    `
    meta.textContent = `Card ${index + 1} of ${filtered.length} - Reviewed ${reviewedSet.size}/${flashcards.length}`
  }

  topicSelect.addEventListener('change', () => {
    filtered = topicSelect.value === 'All' ? [...flashcards] : flashcards.filter((card) => card.topic === topicSelect.value)
    index = 0
    revealed = false
    render()
  })

  getById('flash-prev').addEventListener('click', () => {
    if (filtered.length === 0) {
      return
    }
    index = (index - 1 + filtered.length) % filtered.length
    revealed = false
    render()
  })

  getById('flash-next').addEventListener('click', () => {
    if (filtered.length === 0) {
      return
    }
    index = (index + 1) % filtered.length
    revealed = false
    render()
  })

  getById('flash-random').addEventListener('click', () => {
    if (filtered.length === 0) {
      return
    }
    index = Math.floor(Math.random() * filtered.length)
    revealed = false
    render()
  })

  getById('flash-reveal').addEventListener('click', () => {
    if (filtered.length === 0) {
      return
    }
    revealed = !revealed
    if (revealed) {
      reviewedSet.add(filtered[index].id)
      saveJson(storageKeys.reviewedFlashcards, [...reviewedSet])
      updateProgressSummary()
    }
    render()
  })

  render()
}

function setupTools() {
  setupChecklist()
  setupConverter()
  setupFormulaFinder()
  setupTopicTracker()
}

function setupChecklist() {
  const box = getById('checklist-box')
  const completed = new Set(loadJson(storageKeys.checklist, []))
  box.innerHTML = checklistItems
    .map((item) => `<label><input type="checkbox" data-checklist="${item.id}" ${completed.has(item.id) ? 'checked' : ''} /> ${item.label}</label>`)
    .join('')

  box.querySelectorAll('input[data-checklist]').forEach((input) => {
    input.addEventListener('change', () => {
      const itemId = input.dataset.checklist
      if (!itemId) {
        return
      }
      if (input.checked) {
        completed.add(itemId)
      } else {
        completed.delete(itemId)
      }
      saveJson(storageKeys.checklist, [...completed])
      updateProgressSummary()
    })
  })
}

function setupConverter() {
  const typeSelect = getById('convert-type')
  const valueInput = getById('convert-value')
  const output = getById('convert-output')
  typeSelect.innerHTML = Object.entries(conversions).map(([key, conversion]) => `<option value="${key}">${conversion.label}</option>`).join('')

  const update = () => {
    const conversion = conversions[typeSelect.value]
    const value = Number(valueInput.value)
    output.textContent = Number.isFinite(value) ? conversion.convert(value) : 'Enter a valid number.'
  }

  typeSelect.addEventListener('change', update)
  valueInput.addEventListener('input', update)
  update()
}

function setupFormulaFinder() {
  const select = getById('finder-select')
  const output = getById('finder-output')
  select.innerHTML = formulaFinderOptions.map((option, index) => `<option value="${index}">${option.label}</option>`).join('')

  const update = () => {
    output.textContent = formulaFinderOptions[Number(select.value)].result
  }

  select.addEventListener('change', update)
  update()
}

function setupTopicTracker() {
  const box = getById('topic-progress')
  const completed = new Set(loadJson(storageKeys.masteredTopics, []))
  box.innerHTML = studyTopics
    .map((topic) => `<label><input type="checkbox" data-topic-track="${topic.id}" ${completed.has(topic.id) ? 'checked' : ''} /> ${topic.title}</label>`)
    .join('')

  box.querySelectorAll('input[data-topic-track]').forEach((input) => {
    input.addEventListener('change', () => {
      const topicId = input.dataset.topicTrack
      if (!topicId) {
        return
      }
      if (input.checked) {
        completed.add(topicId)
      } else {
        completed.delete(topicId)
      }
      saveJson(storageKeys.masteredTopics, [...completed])
      updateProgressSummary()
    })
  })
}

function updateProgressSummary() {
  const checklistDone = loadJson(storageKeys.checklist, []).length
  const topicsDone = loadJson(storageKeys.masteredTopics, []).length
  const cardsReviewed = loadJson(storageKeys.reviewedFlashcards, []).length
  const attempts = loadJson(storageKeys.practiceHistory, [])
  const best = attempts.reduce((max, attempt) => Math.max(max, attempt.percent), 0)

  const summaryHtml = `
    <p>Checklist: <strong>${checklistDone}/${checklistItems.length}</strong></p>
    <p>Topics mastered: <strong>${topicsDone}/${studyTopics.length}</strong></p>
    <p>Flashcards reviewed: <strong>${cardsReviewed}/${flashcards.length}</strong></p>
    <p>Practice attempts: <strong>${attempts.length}</strong></p>
    <p>Best score: <strong>${best.toFixed(1)}%</strong></p>
  `

  ;['progress-summary', 'home-progress-summary'].forEach((id) => {
    const container = document.getElementById(id)
    if (container) {
      container.innerHTML = summaryHtml
    }
  })
}

function drawProjectilePath(svg, range, maxHeight) {
  const width = 400
  const height = 180
  const samples = 40
  const pathPoints = []
  for (let i = 0; i <= samples; i += 1) {
    const x = (i / samples) * Math.max(range, 0.1)
    const y = -4 * maxHeight * (x / Math.max(range, 0.1)) * (1 - x / Math.max(range, 0.1))
    const px = 20 + (x / Math.max(range, 0.1)) * (width - 40)
    const py = height - 20 + (y / Math.max(maxHeight, 0.1)) * (height - 40)
    pathPoints.push(`${px.toFixed(1)},${py.toFixed(1)}`)
  }

  svg.innerHTML = `
    <defs>
      <linearGradient id="projGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#a855f7"/>
        <stop offset="100%" stop-color="#7c3aed"/>
      </linearGradient>
    </defs>
    <line x1="20" y1="${height - 20}" x2="${width - 20}" y2="${height - 20}" stroke="#3f3f46" stroke-width="2" />
    <polyline points="${pathPoints.join(' ')}" fill="none" stroke="url(#projGrad)" stroke-width="3" />
  `
}

function drawCollisionViz(svg, values) {
  const speedScale = 22
  const x1 = 90
  const x2 = 280
  const yBefore = 40
  const yAfter = 92
  svg.innerHTML = `
    <line x1="20" y1="${yBefore + 14}" x2="380" y2="${yBefore + 14}" stroke="#3f3f46" stroke-width="2"/>
    <line x1="20" y1="${yAfter + 14}" x2="380" y2="${yAfter + 14}" stroke="#3f3f46" stroke-width="2"/>
    <rect x="${x1}" y="${yBefore}" width="${18 + values.m1 * 10}" height="24" rx="6" fill="#a855f7"/>
    <rect x="${x2}" y="${yBefore}" width="${18 + values.m2 * 10}" height="24" rx="6" fill="#7c3aed"/>
    <line x1="${x1 + 8}" y1="${yBefore - 6}" x2="${x1 + 8 + values.u1 * speedScale}" y2="${yBefore - 6}" stroke="#a855f7" stroke-width="3"/>
    <line x1="${x2 + 8}" y1="${yBefore - 6}" x2="${x2 + 8 + values.u2 * speedScale}" y2="${yBefore - 6}" stroke="#7c3aed" stroke-width="3"/>
    <rect x="${x1}" y="${yAfter}" width="${18 + values.m1 * 10}" height="24" rx="6" fill="#a855f7"/>
    <rect x="${x2}" y="${yAfter}" width="${18 + values.m2 * 10}" height="24" rx="6" fill="#7c3aed"/>
    <line x1="${x1 + 8}" y1="${yAfter + 32}" x2="${x1 + 8 + values.v1 * speedScale}" y2="${yAfter + 32}" stroke="#a855f7" stroke-width="3"/>
    <line x1="${x2 + 8}" y1="${yAfter + 32}" x2="${x2 + 8 + values.v2 * speedScale}" y2="${yAfter + 32}" stroke="#7c3aed" stroke-width="3"/>
    <text x="24" y="24" fill="#a1a1aa" font-size="10">Before</text>
    <text x="24" y="77" fill="#a1a1aa" font-size="10">After</text>
  `
}

function drawWaveViz(svg, amplitude, omega) {
  const points = []
  const width = 400
  const height = 140
  for (let x = 0; x <= width; x += 8) {
    const t = (x / width) * (2 * Math.PI)
    const y = height / 2 - Math.sin(t * omega * 0.25) * clamp(amplitude * 120, 8, 48)
    points.push(`${x},${y.toFixed(2)}`)
  }
  svg.innerHTML = `
    <line x1="0" y1="${height / 2}" x2="${width}" y2="${height / 2}" stroke="#3f3f46" stroke-dasharray="5 5"/>
    <polyline points="${points.join(' ')}" fill="none" stroke="#a855f7" stroke-width="3"/>
  `
}

function drawRotationViz(svg, theta) {
  const cx = 200
  const cy = 70
  const radius = 44
  const angle = theta % (2 * Math.PI)
  const x2 = cx + radius * Math.cos(angle - Math.PI / 2)
  const y2 = cy + radius * Math.sin(angle - Math.PI / 2)
  svg.innerHTML = `
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#3f3f46" stroke-width="2" stroke-dasharray="6 4"/>
    <line x1="${cx}" y1="${cy}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="#a855f7" stroke-width="4" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="4" fill="#a855f7"/>
  `
}

function setBarWidth(id, percentage) {
  const el = getById(id)
  el.style.width = `${clamp(percentage, 0, 100).toFixed(1)}%`
}

function getById(id) {
  const element = document.getElementById(id)
  if (!element) {
    throw new Error(`Missing element: ${id}`)
  }
  return element
}

function getNumber(id) {
  const element = getById(id)
  const value = Number(element.value)
  return Number.isFinite(value) ? value : 0
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function loadJson(key, fallback) {
  const raw = localStorage.getItem(key)
  if (!raw) {
    return fallback
  }
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function groupBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item)
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(item)
    return acc
  }, {})
}

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[items[index], items[randomIndex]] = [items[randomIndex], items[index]]
  }
  return items
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function degToRad(degrees) {
  return (degrees * Math.PI) / 180
}

function formatTime(seconds) {
  const safe = Math.max(0, seconds)
  const mins = Math.floor(safe / 60).toString().padStart(2, '0')
  const secs = Math.floor(safe % 60).toString().padStart(2, '0')
  return `${mins}:${secs}`
}

renderPage()
