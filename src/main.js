import { flashcards } from './data/flashcards.js';
import { questionBank } from './data/questions.js';
import { formulaSheet, studyTopics } from './data/studyContent.js';
const storageKeys = {
    practiceHistory: 'phys-practice-history',
    checklist: 'phys-study-checklist',
    masteredTopics: 'phys-mastered-topics',
    reviewedFlashcards: 'phys-reviewed-flashcards'
};
const app = document.querySelector('#app');
if (!app) {
    throw new Error('App container missing.');
}
const pageConfig = [
    { id: 'study-guide', file: 'study-guide.html', label: 'Study Guide' },
    { id: 'formula-sheet', file: 'formula-sheet.html', label: 'Formula Sheet' },
    { id: 'practice', file: 'practice.html', label: 'Practice Exam' },
    { id: 'simulators', file: 'simulators.html', label: 'Simulators' },
    { id: 'flashcards', file: 'flashcards.html', label: 'Flashcards' },
    { id: 'tools', file: 'tools.html', label: 'Study Tools' },
    { id: 'resources', file: 'resources.html', label: 'Resources & Team' }
];
function resolveCurrentPage(pathname) {
    const lastSegment = pathname.split('/').filter(Boolean).pop() ?? '';
    if (!lastSegment || lastSegment === 'index.html') {
        return 'study-guide';
    }
    const pageId = lastSegment.replace(/\.html$/u, '');
    return pageConfig.some((page) => page.id === pageId) ? pageId : 'study-guide';
}
const currentPage = resolveCurrentPage(window.location.pathname);
const currentPageConfig = pageConfig.find((page) => page.id === currentPage) ?? pageConfig[0];
const pageMarkup = {
    'study-guide': `
    <section id="study-guide" class="panel">
      <h2>Core Physics 1 Study Guide</h2>
      <div id="study-guide-list" class="stack"></div>
    </section>
  `,
    'formula-sheet': `
    <section id="formula-sheet" class="panel">
      <h2>Formula Sheet by Topic</h2>
      <div id="formula-sheet-list" class="formula-grid"></div>
    </section>
  `,
    practice: `
    <section id="practice" class="panel">
      <h2>Practice Exam</h2>
      <p>Choose topic or mixed mode, timed or untimed, then review explanations after submission.</p>
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
        <label>Timed?
          <select id="exam-timed">
            <option value="no">Untimed</option>
            <option value="yes">Timed</option>
          </select>
        </label>
        <label>Minutes (if timed)
          <input id="exam-minutes" type="number" min="5" max="60" value="15" />
        </label>
        <button id="start-exam" type="button">Start Exam</button>
      </form>
      <p id="exam-status" class="status" aria-live="polite"></p>
      <div id="exam-area" aria-live="polite"></div>
      <div id="history-area" class="history-box" aria-live="polite"></div>
    </section>
  `,
    simulators: `
    <section id="simulators" class="panel">
      <h2>Interactive Simulators</h2>
      <div class="sim-grid">
        <article class="sim-card">
          <h3>Projectile Motion</h3>
          <label>Initial speed (m/s)<input id="proj-speed" type="number" value="20" step="0.1" /></label>
          <label>Launch angle (deg)<input id="proj-angle" type="number" value="35" step="0.1" /></label>
          <label>g (m/s²)<input id="proj-g" type="number" value="9.8" step="0.1" /></label>
          <button id="proj-run" type="button">Calculate</button>
          <p id="proj-output" class="sim-output" aria-live="polite"></p>
        </article>

        <article class="sim-card">
          <h3>Forces / Newton’s 2nd Law</h3>
          <label>Mass (kg)<input id="force-mass" type="number" value="5" step="0.1" /></label>
          <label>Applied force (N)<input id="force-applied" type="number" value="25" step="0.1" /></label>
          <label>μ<sub>k</sub><input id="force-mu" type="number" value="0.2" step="0.01" /></label>
          <button id="force-run" type="button">Calculate</button>
          <p id="force-output" class="sim-output" aria-live="polite"></p>
        </article>

        <article class="sim-card">
          <h3>Energy Breakdown</h3>
          <label>Mass (kg)<input id="energy-mass" type="number" value="1" step="0.1" /></label>
          <label>Height (m)<input id="energy-height" type="number" value="2" step="0.1" /></label>
          <label>Speed (m/s)<input id="energy-speed" type="number" value="3" step="0.1" /></label>
          <label>Spring k (N/m)<input id="energy-k" type="number" value="80" step="1" /></label>
          <label>Compression x (m)<input id="energy-x" type="number" value="0.2" step="0.01" /></label>
          <button id="energy-run" type="button">Calculate</button>
          <p id="energy-output" class="sim-output" aria-live="polite"></p>
        </article>

        <article class="sim-card">
          <h3>Momentum / Collisions</h3>
          <label>m₁ (kg)<input id="mom-m1" type="number" value="1" step="0.1" /></label>
          <label>u₁ (m/s)<input id="mom-u1" type="number" value="4" step="0.1" /></label>
          <label>m₂ (kg)<input id="mom-m2" type="number" value="2" step="0.1" /></label>
          <label>u₂ (m/s)<input id="mom-u2" type="number" value="0" step="0.1" /></label>
          <label>Collision type
            <select id="mom-type">
              <option value="elastic">Elastic</option>
              <option value="inelastic">Perfectly inelastic</option>
            </select>
          </label>
          <button id="mom-run" type="button">Calculate</button>
          <p id="mom-output" class="sim-output" aria-live="polite"></p>
        </article>

        <article class="sim-card">
          <h3>SHM / Rotation Dynamics</h3>
          <label>Mode
            <select id="osc-mode">
              <option value="shm">Simple Harmonic Motion</option>
              <option value="rotation">Rotation Dynamics</option>
            </select>
          </label>
          <div id="osc-shm-inputs">
            <label>Mass m (kg)<input id="shm-mass" type="number" value="0.4" step="0.1" /></label>
            <label>Spring k (N/m)<input id="shm-k" type="number" value="64" step="1" /></label>
            <label>Amplitude A (m)<input id="shm-a" type="number" value="0.15" step="0.01" /></label>
          </div>
          <div id="osc-rot-inputs" class="hidden">
            <label>Force F (N)<input id="rot-force" type="number" value="2" step="0.1" /></label>
            <label>Radius r (m)<input id="rot-radius" type="number" value="0.3" step="0.01" /></label>
            <label>Moment of inertia I (kg·m²)<input id="rot-i" type="number" value="0.18" step="0.01" /></label>
          </div>
          <button id="osc-run" type="button">Calculate</button>
          <p id="osc-output" class="sim-output" aria-live="polite"></p>
        </article>
      </div>
    </section>
  `,
    flashcards: `
    <section id="flashcards" class="panel">
      <h2>Flashcards</h2>
      <div class="control-row">
        <label>Topic filter
          <select id="flash-topic"></select>
        </label>
        <button id="flash-prev" type="button">Previous</button>
        <button id="flash-reveal" type="button">Reveal</button>
        <button id="flash-next" type="button">Next</button>
        <button id="flash-random" type="button">Random</button>
      </div>
      <article id="flash-card" class="flash-card"></article>
      <p id="flash-meta" class="status" aria-live="polite"></p>
    </section>
  `,
    tools: `
    <section id="tools" class="panel">
      <h2>Study Tools</h2>
      <div class="tools-grid">
        <article class="tool-card">
          <h3>Problem-Solving Checklist</h3>
          <div id="checklist-box" class="stack"></div>
        </article>

        <article class="tool-card">
          <h3>Unit Conversion Helper</h3>
          <label>Conversion
          <select id="convert-type"></select>
        </label>
        <label>Value<input id="convert-value" type="number" value="1" step="any" /></label>
          <p id="convert-output" class="status" aria-live="polite"></p>
        </article>

        <article class="tool-card">
          <h3>Formula Finder Decision Guide</h3>
          <label>What are you solving?
          <select id="finder-select"></select>
        </label>
        <p id="finder-output" class="status" aria-live="polite"></p>
        </article>

        <article class="tool-card">
          <h3>Exam-Day Strategy</h3>
          <ul>
            <li>Start with problems you can finish in 90 seconds or less.</li>
            <li>Write knowns with units before equations.</li>
            <li>Check signs and directions before final answer.</li>
            <li>If stuck, box equation setup and move on.</li>
            <li>Use final 10 minutes to check units and reasonableness.</li>
          </ul>
        </article>

        <article class="tool-card">
          <h3>Topic Progress Tracker</h3>
          <div id="topic-progress" class="stack"></div>
        </article>

        <article class="tool-card">
          <h3>Overall Progress</h3>
          <div id="progress-summary" class="stack" aria-live="polite"></div>
        </article>
      </div>
    </section>
  `,
    resources: `
    <section id="resources" class="panel">
      <h2>Resources & Team</h2>
      <div class="two-col">
        <div>
          <h3>Recommended Resources</h3>
          <ul>
            <li><a href="https://openstax.org/details/books/university-physics-volume-1" target="_blank" rel="noreferrer">OpenStax University Physics Vol. 1</a></li>
            <li><a href="https://phet.colorado.edu" target="_blank" rel="noreferrer">PhET Interactive Simulations</a></li>
            <li><a href="https://www.khanacademy.org/science/physics" target="_blank" rel="noreferrer">Khan Academy Physics</a></li>
            <li><a href="https://www.desmos.com/scientific" target="_blank" rel="noreferrer">Scientific Calculator (Desmos)</a></li>
          </ul>
        </div>
        <div>
          <h3>Project Team</h3>
          <ul>
            <li>Tyler Abell</li>
            <li>Andrew Garza</li>
            <li>David Peine</li>
            <li>Xavier Robles</li>
          </ul>
          <p>This site is static, browser-only, and designed for GitHub Pages hosting.</p>
        </div>
      </div>
    </section>
  `
};
document.title = `${currentPageConfig.label} | PHYS Extra Credit Study Guide`;
app.innerHTML = `
  <header class="site-header" id="top">
    <div class="header-inner">
      <div>
        <h1>PHYS 1 Study</h1>
        <p>Built by Tyler Abell, Andrew Garza, David Peine, and Xavier Robles</p>
      </div>
      <button class="menu-toggle" aria-label="Toggle navigation" id="menu-toggle">☰</button>
    </div>
  </header>
  
  <aside class="site-nav" id="site-nav">
    <nav aria-label="Main navigation">
      ${pageConfig
    .map((page) => `<a href="./${page.file}"${page.id === currentPage ? ' class="active" aria-current="page"' : ''}>${page.label}</a>`)
    .join('')}
    </nav>
  </aside>
  
  <main id="page-main">
    ${pageMarkup[currentPage]}
  </main>
`;
setupNavigation();
if (currentPage === 'study-guide') {
    renderStudyGuide();
}
if (currentPage === 'formula-sheet') {
    renderFormulaSheet();
}
if (currentPage === 'practice') {
    setupPracticeExam();
}
if (currentPage === 'simulators') {
    setupSimulators();
}
if (currentPage === 'flashcards') {
    setupFlashcards();
}
if (currentPage === 'tools') {
    setupTools();
}
function renderStudyGuide() {
    const container = getById('study-guide-list');
    container.innerHTML = studyTopics
        .map((topic) => `
      <article class="topic-card" id="topic-${topic.id}">
        <h3>${topic.title}</h3>
        <p>${topic.summary}</p>
        <h4>Key Formulas</h4>
        <ul>${topic.formulas.map((formula) => `<li><code>${formula}</code></li>`).join('')}</ul>
        <h4>Common Mistakes</h4>
        <ul>${topic.mistakes.map((mistake) => `<li>${mistake}</li>`).join('')}</ul>
        <h4>Worked Example</h4>
        <p><strong>Prompt:</strong> ${topic.example.prompt}</p>
        <ol>${topic.example.steps.map((step) => `<li>${step}</li>`).join('')}</ol>
        <p><strong>Answer:</strong> ${topic.example.answer}</p>
        <div class="checkpoint">
          <p><strong>Checkpoint:</strong> ${topic.checkpoint.question}</p>
          <ul>${topic.checkpoint.options.map((choice, index) => `<li>${String.fromCharCode(65 + index)}. ${choice}</li>`).join('')}</ul>
          <button type="button" data-checkpoint="${topic.id}">Reveal checkpoint answer</button>
          <p id="checkpoint-${topic.id}" class="hidden"><strong>Answer:</strong> ${String.fromCharCode(65 + topic.checkpoint.answerIndex)}. ${topic.checkpoint.options[topic.checkpoint.answerIndex]} — ${topic.checkpoint.explanation}</p>
        </div>
      </article>
    `)
        .join('');
    container.querySelectorAll('button[data-checkpoint]').forEach((button) => {
        button.addEventListener('click', () => {
            const topicId = button.dataset.checkpoint;
            if (!topicId) {
                return;
            }
            const answer = getById(`checkpoint-${topicId}`);
            answer.classList.toggle('hidden');
        });
    });
}
function renderFormulaSheet() {
    const container = getById('formula-sheet-list');
    const groups = groupBy(formulaSheet, (item) => item.topic);
    container.innerHTML = Object.entries(groups)
        .map(([topic, formulas]) => `
      <article class="formula-card">
        <h3>${topic}</h3>
        <ul>
          ${formulas
        .map((formula) => `<li><strong>${formula.name}</strong><br /><code>${formula.expression}</code><br /><span>${formula.note}</span></li>`)
        .join('')}
        </ul>
      </article>
    `)
        .join('');
}
function setupPracticeExam() {
    const modeSelect = getById('exam-mode');
    const topicSelect = getById('exam-topic');
    const countInput = getById('exam-count');
    const timedSelect = getById('exam-timed');
    const minutesInput = getById('exam-minutes');
    const startButton = getById('start-exam');
    const status = getById('exam-status');
    const examArea = getById('exam-area');
    const topics = Array.from(new Set(questionBank.map((question) => question.topic)));
    topicSelect.innerHTML = topics.map((topic) => `<option value="${topic}">${topic}</option>`).join('');
    let activeExam = null;
    const clearTimer = () => {
        const exam = activeExam;
        if (exam && exam.timerId !== null) {
            window.clearInterval(exam.timerId);
            exam.timerId = null;
        }
    };
    const renderQuestion = () => {
        if (!activeExam) {
            return;
        }
        const currentQuestion = activeExam.questions[activeExam.currentIndex];
        const selectedAnswer = activeExam.answers[activeExam.currentIndex];
        examArea.innerHTML = `
      <article class="exam-card">
        <h3>Question ${activeExam.currentIndex + 1} / ${activeExam.questions.length}</h3>
        <p>${currentQuestion.prompt}</p>
        <div class="stack">
          ${currentQuestion.choices
            .map((choice, index) => `
                <label class="choice-option">
                  <input type="radio" name="answer" value="${index}" ${selectedAnswer === index ? 'checked' : ''} />
                  ${String.fromCharCode(65 + index)}. ${choice}
                </label>
              `)
            .join('')}
        </div>
        <div class="control-row">
          <button id="exam-prev" type="button" ${activeExam.currentIndex === 0 ? 'disabled' : ''}>Previous</button>
          <button id="exam-next" type="button">${activeExam.currentIndex === activeExam.questions.length - 1 ? 'Finish' : 'Next'}</button>
        </div>
      </article>
    `;
        examArea.querySelectorAll('input[name="answer"]').forEach((input) => {
            input.addEventListener('change', () => {
                if (!activeExam) {
                    return;
                }
                activeExam.answers[activeExam.currentIndex] = Number(input.value);
            });
        });
        getById('exam-prev').addEventListener('click', () => {
            if (!activeExam) {
                return;
            }
            activeExam.currentIndex -= 1;
            renderQuestion();
        });
        getById('exam-next').addEventListener('click', () => {
            if (!activeExam) {
                return;
            }
            if (activeExam.currentIndex === activeExam.questions.length - 1) {
                finishExam();
                return;
            }
            activeExam.currentIndex += 1;
            renderQuestion();
        });
    };
    const renderHistory = () => {
        const historyArea = getById('history-area');
        const history = loadJson(storageKeys.practiceHistory, []);
        if (history.length === 0) {
            historyArea.innerHTML = '<h3>Attempt History</h3><p>No attempts yet.</p>';
            return;
        }
        const best = history.reduce((max, attempt) => Math.max(max, attempt.percent), 0);
        historyArea.innerHTML = `
      <h3>Attempt History</h3>
      <p><strong>Best score:</strong> ${best.toFixed(1)}%</p>
      <ul>
        ${history
            .slice(0, 8)
            .map((attempt) => `<li>${new Date(attempt.date).toLocaleString()} — ${attempt.mode === 'mixed' ? 'Mixed' : attempt.topic} ${attempt.timed ? '(Timed)' : '(Untimed)'}: ${attempt.score}/${attempt.total} (${attempt.percent.toFixed(1)}%)</li>`)
            .join('')}
      </ul>
    `;
    };
    const finishExam = () => {
        const exam = activeExam;
        if (!exam) {
            return;
        }
        clearTimer();
        const score = exam.questions.reduce((sum, question, index) => {
            return sum + Number(exam.answers[index] === question.correctIndex);
        }, 0);
        const percent = (score / exam.questions.length) * 100;
        const attempt = {
            date: new Date().toISOString(),
            topic: exam.topic,
            timed: exam.timed,
            mode: exam.mode,
            score,
            total: exam.questions.length,
            percent
        };
        const history = loadJson(storageKeys.practiceHistory, []);
        history.unshift(attempt);
        saveJson(storageKeys.practiceHistory, history.slice(0, 20));
        status.textContent = `Finished! Score: ${score}/${exam.questions.length} (${percent.toFixed(1)}%).`;
        examArea.innerHTML = `
      <article class="exam-card">
        <h3>Answer Review</h3>
        ${exam.questions
            .map((question, index) => {
            const selected = exam.answers[index];
            const isCorrect = selected === question.correctIndex;
            const userText = selected === null ? 'No answer' : question.choices[selected];
            return `
              <div class="review-item ${isCorrect ? 'correct' : 'incorrect'}">
                <p><strong>Q${index + 1}:</strong> ${question.prompt}</p>
                <p><strong>Your answer:</strong> ${userText}</p>
                <p><strong>Correct answer:</strong> ${question.choices[question.correctIndex]}</p>
                <p><strong>Why:</strong> ${question.explanation}</p>
              </div>
            `;
        })
            .join('')}
      </article>
    `;
        activeExam = null;
        renderHistory();
        updateProgressSummary();
    };
    startButton.addEventListener('click', () => {
        clearTimer();
        const mode = modeSelect.value === 'topic' ? 'topic' : 'mixed';
        const timed = timedSelect.value === 'yes';
        const requestedCount = clamp(Math.round(Number(countInput.value)), 5, 30);
        const topic = topicSelect.value;
        const pool = mode === 'mixed' ? questionBank : questionBank.filter((question) => question.topic === topic);
        const questions = shuffle([...pool]).slice(0, Math.min(requestedCount, pool.length));
        if (questions.length === 0) {
            status.textContent = 'No questions available for this selection.';
            return;
        }
        const minutes = clamp(Math.round(Number(minutesInput.value)), 5, 60);
        activeExam = {
            questions,
            answers: Array.from({ length: questions.length }).fill(null),
            currentIndex: 0,
            startedAt: Date.now(),
            timed,
            remainingSeconds: minutes * 60,
            timerId: null,
            topic,
            mode
        };
        const modeLabel = mode === 'mixed' ? 'Mixed review' : topic;
        status.textContent = timed ? `${modeLabel} exam started. Time left: ${formatTime(activeExam.remainingSeconds)}.` : `${modeLabel} exam started (untimed).`;
        if (timed) {
            activeExam.timerId = window.setInterval(() => {
                if (!activeExam) {
                    return;
                }
                activeExam.remainingSeconds -= 1;
                status.textContent = `${modeLabel} exam in progress. Time left: ${formatTime(activeExam.remainingSeconds)}.`;
                if (activeExam.remainingSeconds <= 0) {
                    finishExam();
                }
            }, 1000);
        }
        renderQuestion();
    });
    modeSelect.addEventListener('change', () => {
        topicSelect.disabled = modeSelect.value !== 'topic';
    });
    topicSelect.disabled = modeSelect.value !== 'topic';
    renderHistory();
}
function setupSimulators() {
    const projOutput = getById('proj-output');
    getById('proj-run').addEventListener('click', () => {
        const v0 = getNumber('proj-speed');
        const angle = degToRad(getNumber('proj-angle'));
        const gravity = getNumber('proj-g');
        const v0y = v0 * Math.sin(angle);
        const time = (2 * v0y) / gravity;
        const range = ((v0 ** 2) * Math.sin(2 * angle)) / gravity;
        const maxHeight = (v0y ** 2) / (2 * gravity);
        projOutput.textContent = `Time: ${time.toFixed(2)} s | Range: ${range.toFixed(2)} m | Max height: ${maxHeight.toFixed(2)} m`;
    });
    const forceOutput = getById('force-output');
    getById('force-run').addEventListener('click', () => {
        const mass = getNumber('force-mass');
        const applied = getNumber('force-applied');
        const mu = getNumber('force-mu');
        const normal = mass * 9.8;
        const friction = mu * normal;
        const net = applied - friction;
        const accel = net / mass;
        forceOutput.textContent = `Normal: ${normal.toFixed(2)} N | Friction: ${friction.toFixed(2)} N | Net: ${net.toFixed(2)} N | Acceleration: ${accel.toFixed(2)} m/s²`;
    });
    const energyOutput = getById('energy-output');
    getById('energy-run').addEventListener('click', () => {
        const mass = getNumber('energy-mass');
        const height = getNumber('energy-height');
        const speed = getNumber('energy-speed');
        const springK = getNumber('energy-k');
        const compression = getNumber('energy-x');
        const kinetic = 0.5 * mass * speed ** 2;
        const grav = mass * 9.8 * height;
        const spring = 0.5 * springK * compression ** 2;
        const total = kinetic + grav + spring;
        energyOutput.textContent = `KE: ${kinetic.toFixed(2)} J | Ug: ${grav.toFixed(2)} J | Us: ${spring.toFixed(2)} J | Total: ${total.toFixed(2)} J`;
    });
    const momentumOutput = getById('mom-output');
    getById('mom-run').addEventListener('click', () => {
        const m1 = getNumber('mom-m1');
        const u1 = getNumber('mom-u1');
        const m2 = getNumber('mom-m2');
        const u2 = getNumber('mom-u2');
        const type = getById('mom-type').value;
        if (type === 'inelastic') {
            const shared = (m1 * u1 + m2 * u2) / (m1 + m2);
            momentumOutput.textContent = `Perfectly inelastic: v = ${shared.toFixed(2)} m/s for both objects.`;
            return;
        }
        const v1 = ((m1 - m2) / (m1 + m2)) * u1 + ((2 * m2) / (m1 + m2)) * u2;
        const v2 = ((2 * m1) / (m1 + m2)) * u1 + ((m2 - m1) / (m1 + m2)) * u2;
        momentumOutput.textContent = `Elastic collision: v₁ = ${v1.toFixed(2)} m/s, v₂ = ${v2.toFixed(2)} m/s.`;
    });
    const modeSelect = getById('osc-mode');
    const shmInputs = getById('osc-shm-inputs');
    const rotInputs = getById('osc-rot-inputs');
    const oscOutput = getById('osc-output');
    modeSelect.addEventListener('change', () => {
        const shmMode = modeSelect.value === 'shm';
        shmInputs.classList.toggle('hidden', !shmMode);
        rotInputs.classList.toggle('hidden', shmMode);
    });
    getById('osc-run').addEventListener('click', () => {
        if (modeSelect.value === 'shm') {
            const mass = getNumber('shm-mass');
            const springK = getNumber('shm-k');
            const amplitude = getNumber('shm-a');
            const omega = Math.sqrt(springK / mass);
            const period = (2 * Math.PI) / omega;
            const vmax = omega * amplitude;
            const energy = 0.5 * springK * amplitude ** 2;
            oscOutput.textContent = `SHM: ω = ${omega.toFixed(2)} rad/s | T = ${period.toFixed(2)} s | vmax = ${vmax.toFixed(2)} m/s | E = ${energy.toFixed(2)} J`;
            return;
        }
        const force = getNumber('rot-force');
        const radius = getNumber('rot-radius');
        const inertia = getNumber('rot-i');
        const torque = force * radius;
        const alpha = torque / inertia;
        const theta2s = 0.5 * alpha * (2 ** 2);
        oscOutput.textContent = `Rotation: τ = ${torque.toFixed(2)} N·m | α = ${alpha.toFixed(2)} rad/s² | θ after 2s (from rest) = ${theta2s.toFixed(2)} rad`;
    });
}
function setupFlashcards() {
    const topicSelect = getById('flash-topic');
    const cardBox = getById('flash-card');
    const meta = getById('flash-meta');
    const reviewedSet = new Set(loadJson(storageKeys.reviewedFlashcards, []));
    topicSelect.innerHTML = ['All', ...Array.from(new Set(flashcards.map((card) => card.topic)))]
        .map((topic) => `<option value="${topic}">${topic}</option>`)
        .join('');
    let filtered = [...flashcards];
    let index = 0;
    let revealed = false;
    const render = () => {
        if (filtered.length === 0) {
            cardBox.innerHTML = '<p>No flashcards in this filter.</p>';
            meta.textContent = '';
            return;
        }
        const card = filtered[index];
        cardBox.innerHTML = `
      <h3>${card.topic}</h3>
      <p><strong>Front:</strong> ${card.front}</p>
      <p class="${revealed ? '' : 'hidden'}"><strong>Back:</strong> ${card.back}</p>
    `;
        meta.textContent = `Card ${index + 1} of ${filtered.length} • Reviewed ${reviewedSet.size}/${flashcards.length}`;
    };
    topicSelect.addEventListener('change', () => {
        filtered = topicSelect.value === 'All' ? [...flashcards] : flashcards.filter((card) => card.topic === topicSelect.value);
        index = 0;
        revealed = false;
        render();
    });
    getById('flash-prev').addEventListener('click', () => {
        if (filtered.length === 0) {
            return;
        }
        index = (index - 1 + filtered.length) % filtered.length;
        revealed = false;
        render();
    });
    getById('flash-next').addEventListener('click', () => {
        if (filtered.length === 0) {
            return;
        }
        index = (index + 1) % filtered.length;
        revealed = false;
        render();
    });
    getById('flash-random').addEventListener('click', () => {
        if (filtered.length === 0) {
            return;
        }
        index = Math.floor(Math.random() * filtered.length);
        revealed = false;
        render();
    });
    getById('flash-reveal').addEventListener('click', () => {
        if (filtered.length === 0) {
            return;
        }
        revealed = !revealed;
        if (revealed) {
            reviewedSet.add(filtered[index].id);
            saveJson(storageKeys.reviewedFlashcards, [...reviewedSet]);
            updateProgressSummary();
        }
        render();
    });
    render();
}
function setupTools() {
    setupChecklist();
    setupConverter();
    setupFormulaFinder();
    setupTopicTracker();
    updateProgressSummary();
}
const checklistItems = [
    { id: 'draw-diagram', label: 'Draw and label a diagram' },
    { id: 'list-knowns', label: 'List known/unknown variables with units' },
    { id: 'pick-model', label: 'Pick the correct model (forces, energy, momentum)' },
    { id: 'solve-symbolic', label: 'Solve symbolically before plugging numbers' },
    { id: 'check-units', label: 'Check units and sign of final result' },
    { id: 'sanity-check', label: 'Compare answer magnitude with physical intuition' }
];
function setupChecklist() {
    const box = getById('checklist-box');
    const completed = new Set(loadJson(storageKeys.checklist, []));
    box.innerHTML = checklistItems
        .map((item) => `<label><input type="checkbox" data-checklist="${item.id}" ${completed.has(item.id) ? 'checked' : ''}/> ${item.label}</label>`)
        .join('');
    box.querySelectorAll('input[data-checklist]').forEach((input) => {
        input.addEventListener('change', () => {
            const itemId = input.dataset.checklist;
            if (!itemId) {
                return;
            }
            if (input.checked) {
                completed.add(itemId);
            }
            else {
                completed.delete(itemId);
            }
            saveJson(storageKeys.checklist, [...completed]);
            updateProgressSummary();
        });
    });
}
const conversions = {
    m_to_cm: { label: 'Meters → Centimeters', convert: (value) => `${(value * 100).toFixed(2)} cm` },
    cm_to_m: { label: 'Centimeters → Meters', convert: (value) => `${(value / 100).toFixed(4)} m` },
    kmh_to_ms: { label: 'km/h → m/s', convert: (value) => `${(value / 3.6).toFixed(3)} m/s` },
    ms_to_kmh: { label: 'm/s → km/h', convert: (value) => `${(value * 3.6).toFixed(3)} km/h` },
    n_to_kn: { label: 'Newtons → kiloNewtons', convert: (value) => `${(value / 1000).toFixed(5)} kN` },
    j_to_kj: { label: 'Joules → kiloJoules', convert: (value) => `${(value / 1000).toFixed(5)} kJ` }
};
function setupConverter() {
    const typeSelect = getById('convert-type');
    const valueInput = getById('convert-value');
    const output = getById('convert-output');
    typeSelect.innerHTML = Object.entries(conversions)
        .map(([key, conversion]) => `<option value="${key}">${conversion.label}</option>`)
        .join('');
    const update = () => {
        const conversion = conversions[typeSelect.value];
        const value = Number(valueInput.value);
        output.textContent = Number.isFinite(value) ? conversion.convert(value) : 'Enter a valid number.';
    };
    typeSelect.addEventListener('change', update);
    valueInput.addEventListener('input', update);
    update();
}
const formulaFinderOptions = [
    { label: 'Known mass + acceleration, need net force', result: 'Use ΣF = ma.' },
    { label: 'Known initial/final speed + displacement, need acceleration', result: 'Use v² = v0² + 2aΔx.' },
    { label: 'Known mass + height, need gravitational potential energy', result: 'Use Ug = mgh.' },
    { label: 'Known masses/velocities before collision, need final values', result: 'Use momentum conservation: m1u1 + m2u2 = m1v1 + m2v2.' },
    { label: 'Known spring constant and mass, need SHM period', result: 'Use T = 2π√(m/k).' },
    { label: 'Known force and lever arm, need torque', result: 'Use τ = rF sinφ.' }
];
function setupFormulaFinder() {
    const select = getById('finder-select');
    const output = getById('finder-output');
    select.innerHTML = formulaFinderOptions
        .map((option, index) => `<option value="${index}">${option.label}</option>`)
        .join('');
    const update = () => {
        const option = formulaFinderOptions[Number(select.value)];
        output.textContent = option.result;
    };
    select.addEventListener('change', update);
    update();
}
function setupTopicTracker() {
    const box = getById('topic-progress');
    const completed = new Set(loadJson(storageKeys.masteredTopics, []));
    box.innerHTML = studyTopics
        .map((topic) => `<label><input type="checkbox" data-topic-track="${topic.id}" ${completed.has(topic.id) ? 'checked' : ''}/> ${topic.title}</label>`)
        .join('');
    box.querySelectorAll('input[data-topic-track]').forEach((input) => {
        input.addEventListener('change', () => {
            const topicId = input.dataset.topicTrack;
            if (!topicId) {
                return;
            }
            if (input.checked) {
                completed.add(topicId);
            }
            else {
                completed.delete(topicId);
            }
            saveJson(storageKeys.masteredTopics, [...completed]);
            updateProgressSummary();
        });
    });
}
function updateProgressSummary() {
    const summary = document.getElementById('progress-summary');
    if (!summary) {
        return;
    }
    const checklistDone = loadJson(storageKeys.checklist, []).length;
    const topicsDone = loadJson(storageKeys.masteredTopics, []).length;
    const cardsReviewed = loadJson(storageKeys.reviewedFlashcards, []).length;
    const attempts = loadJson(storageKeys.practiceHistory, []);
    const best = attempts.reduce((max, attempt) => Math.max(max, attempt.percent), 0);
    const checklistPercent = (checklistDone / checklistItems.length) * 100;
    const topicPercent = (topicsDone / studyTopics.length) * 100;
    const cardPercent = (cardsReviewed / flashcards.length) * 100;
    summary.innerHTML = `
    <p>Checklist complete: <strong>${checklistDone}/${checklistItems.length}</strong> (${checklistPercent.toFixed(0)}%)</p>
    <p>Topics mastered: <strong>${topicsDone}/${studyTopics.length}</strong> (${topicPercent.toFixed(0)}%)</p>
    <p>Flashcards reviewed: <strong>${cardsReviewed}/${flashcards.length}</strong> (${cardPercent.toFixed(0)}%)</p>
    <p>Practice attempts: <strong>${attempts.length}</strong></p>
    <p>Best practice score: <strong>${best.toFixed(1)}%</strong></p>
  `;
}
function getById(id) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Missing element: ${id}`);
    }
    return element;
}
function getNumber(id) {
    const element = getById(id);
    const value = Number(element.value);
    return Number.isFinite(value) ? value : 0;
}
function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
function loadJson(key, fallback) {
    const raw = localStorage.getItem(key);
    if (!raw) {
        return fallback;
    }
    try {
        return JSON.parse(raw);
    }
    catch {
        return fallback;
    }
}
function groupBy(items, keyFn) {
    return items.reduce((acc, item) => {
        const key = keyFn(item);
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {});
}
function shuffle(items) {
    for (let index = items.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
    }
    return items;
}
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
function degToRad(degrees) {
    return (degrees * Math.PI) / 180;
}
function formatTime(seconds) {
    const safe = Math.max(0, seconds);
    const mins = Math.floor(safe / 60)
        .toString()
        .padStart(2, '0');
    const secs = Math.floor(safe % 60)
        .toString()
        .padStart(2, '0');
    return `${mins}:${secs}`;
}

function setupNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const siteNav = document.getElementById('site-nav');
    if (!menuToggle || !siteNav) {
        return;
    }
    const closeMenu = () => {
        siteNav.classList.remove('active');
    };
    menuToggle.addEventListener('click', () => {
        siteNav.classList.toggle('active');
    });
    siteNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            closeMenu();
        }
    });
}
