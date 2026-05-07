(function () {
  const canvas = document.getElementById('physics-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Color palettes [r,g,b]
  const COLORS = [
    [56, 189, 248],   // cyan
    [251, 146, 60],   // orange
    [192, 132, 252],  // violet
    [52, 211, 153],   // green
  ];

  function rgba(c, a) {
    return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  }

  function drawGrid() {
    const sp = 60;
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += sp) {
      ctx.strokeStyle = 'rgba(56,189,248,0.03)';
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += sp) {
      ctx.strokeStyle = 'rgba(56,189,248,0.03)';
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
  }

  function drawArrow(x1, y1, x2, y2, color, alpha, lw) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 6) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lw || 1.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    const angle = Math.atan2(dy, dx);
    const hs = 10;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - hs * Math.cos(angle - 0.38), y2 - hs * Math.sin(angle - 0.38));
    ctx.lineTo(x2 - hs * Math.cos(angle + 0.38), y2 - hs * Math.sin(angle + 0.38));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawLabel(text, x, y, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  const G = 9.8;
  const SCALE = 14;
  const GROUND_FRAC = 0.82;

  class Projectile {
    constructor(delay) {
      this.startTime = Date.now() + (delay || 0);
      this.init();
    }
    init() {
      const ground = canvas.height * GROUND_FRAC;
      this.sx = canvas.width * (0.04 + Math.random() * 0.15);
      this.sy = ground;
      this.v0 = 18 + Math.random() * 18;
      this.angle = (28 + Math.random() * 44) * Math.PI / 180;
      this.v0x = this.v0 * Math.cos(this.angle);
      this.v0y = this.v0 * Math.sin(this.angle);
      this.totalTime = (2 * this.v0y) / G;
      this.t = 0;
      this.trail = [];
      this.colorIdx = Math.floor(Math.random() * COLORS.length);
      this.color = COLORS[this.colorIdx];
      this.colorStr = `rgb(${this.color[0]},${this.color[1]},${this.color[2]})`;
    }
    pos(t) {
      return {
        x: this.sx + this.v0x * t * SCALE,
        y: this.sy - (this.v0y * t - 0.5 * G * t * t) * SCALE
      };
    }
    vel(t) {
      return { vx: this.v0x, vy: -(this.v0y - G * t) };
    }
    update(dt) {
      if (Date.now() < this.startTime) return;
      this.t += dt;
      if (this.t > this.totalTime + 1.2) {
        this.startTime = Date.now() + 2000 + Math.random() * 4000;
        this.init();
        return;
      }
      const p = this.pos(this.t);
      this.trail.push({ x: p.x, y: p.y });
      if (this.trail.length > 120) this.trail.shift();
    }
    draw() {
      if (Date.now() < this.startTime || this.trail.length < 2) return;
      // Trail
      ctx.save();
      for (let i = 1; i < this.trail.length; i++) {
        const a = (i / this.trail.length) * 0.55;
        ctx.globalAlpha = a;
        ctx.strokeStyle = this.colorStr;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
        ctx.stroke();
      }
      ctx.restore();

      if (this.t > this.totalTime) return;

      const p = this.pos(this.t);
      const v = this.vel(this.t);

      // Fixed scale: initial speed → 90 px, so vₓ stays constant throughout
      const vs = 90 / Math.max(this.v0, 1);

      const ex = p.x + v.vx * vs;   // tip of full v vector
      const ey = p.y + v.vy * vs;
      const vxTip = p.x + v.vx * vs; // tip of vx (same x, ball y)
      const vyTip = p.y + v.vy * vs; // tip of vy (ball x, shifted y)

      // Ball
      ctx.save();
      ctx.globalAlpha = 0.95;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = this.colorStr;
      ctx.shadowColor = this.colorStr;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.restore();

      // vx component — horizontal cyan arrow FROM ball
      drawArrow(p.x, p.y, vxTip, p.y, '#38bdf8', 0.92, 2.5);
      drawLabel('vₓ', p.x + v.vx * vs * 0.5 - 10, p.y + 16, '#38bdf8', 0.95);

      // vy component — vertical green arrow FROM ball
      drawArrow(p.x, p.y, p.x, vyTip, '#34d399', 0.92, 2.5);
      drawLabel('vᵧ', p.x - 28, p.y + v.vy * vs * 0.5 + 4, '#34d399', 0.95);

      // Dashed parallelogram lines to tip of resultant
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      ctx.moveTo(vxTip, p.y);   // end of vx  → up/down to tip
      ctx.lineTo(ex, ey);
      ctx.moveTo(p.x, vyTip);   // end of vy  → right to tip
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Full velocity vector v (on top, ball's color)
      drawArrow(p.x, p.y, ex, ey, this.colorStr, 0.95, 3);
      drawLabel('v', ex + 6, ey - 5, this.colorStr, 0.9);

      // At peak: label max height
      const tPeak = this.v0y / G;
      if (Math.abs(this.t - tPeak) < 0.12) {
        const peak = this.pos(tPeak);
        const htMeters = (this.v0y * this.v0y) / (2 * G);
        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = this.colorStr;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(peak.x, peak.y);
        ctx.lineTo(peak.x, this.sy);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
        drawLabel(`h = ${htMeters.toFixed(1)}m`, peak.x + 6, peak.y - 8, this.colorStr, 0.7);
      }

      // Gravity vector (downward)
      drawArrow(p.x, p.y, p.x, p.y + 28, 'rgba(248,113,113,1)', 0.45, 1.5);
    }
  }

  // Floating equation labels
  const EQS = [
    'F = ma', 'v = v₀ + at', 'KE = ½mv²', 'p = mv',
    'W = Fd·cosθ', 'τ = rF sinθ', 'T = 2π√(m/k)',
    'a_c = v²/r', 'PE = mgh', 'Δp = FΔt',
  ];
  const floaters = EQS.map((eq, i) => ({
    text: eq,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.12,
    alpha: 0.06 + Math.random() * 0.07,
  }));

  function updateFloaters() {
    for (const f of floaters) {
      f.x += f.vx;
      f.y += f.vy;
      if (f.x < -100) f.x = canvas.width + 50;
      if (f.x > canvas.width + 100) f.x = -50;
      if (f.y < -20) f.y = canvas.height + 10;
      if (f.y > canvas.height + 20) f.y = -10;
    }
  }

  function drawFloaters() {
    ctx.save();
    ctx.font = '13px JetBrains Mono, monospace';
    for (const f of floaters) {
      ctx.globalAlpha = f.alpha;
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.restore();
  }

  // Ground line
  function drawGround() {
    const y = canvas.height * GROUND_FRAC;
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.setLineDash([8, 12]);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  const projectiles = [
    new Projectile(200),
    new Projectile(2800),
    new Projectile(5400),
    new Projectile(1500),
  ];

  // ─── Interactive Balloons ───────────────────────────────────────────────────

  const userBalloons = [];
  const userShots = [];

  class UserBalloon {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.r = 22 + Math.random() * 11;
      const ci = Math.floor(Math.random() * COLORS.length);
      this.col = COLORS[ci];
      this.cs = `rgb(${this.col[0]},${this.col[1]},${this.col[2]})`;
      this.popped = false;
      this.popAt = 0;
      this.pts = [];
      this.w = 0;
      this.wd = Math.random() > 0.5 ? 1 : -1;
      this.alive = true;
    }

    pop() {
      if (this.popped) return;
      this.popped = true;
      this.popAt = Date.now();
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2;
        const s = 55 + Math.random() * 120;
        this.pts.push({ x: this.x, y: this.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1.0 });
      }
    }

    update(dt) {
      if (this.popped) {
        this.alive = (Date.now() - this.popAt) < 900;
        for (const p of this.pts) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += 95 * dt;
          p.life -= dt * 1.8;
        }
      } else {
        this.w += dt * 2.4 * this.wd;
        if (Math.abs(this.w) > 0.13) this.wd *= -1;
      }
    }

    draw() {
      if (this.popped) {
        ctx.save();
        for (const p of this.pts) {
          const l = Math.max(0, p.life);
          if (l <= 0) continue;
          ctx.globalAlpha = l * 0.88;
          ctx.fillStyle = this.cs;
          ctx.shadowColor = this.cs;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(1, 4.5 * l), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        return;
      }

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(Math.sin(this.w) * 0.07);

      // String
      ctx.globalAlpha = 0.65;
      ctx.strokeStyle = this.cs;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, this.r + 3);
      ctx.quadraticCurveTo(6, this.r + 20, 2, this.r + 40);
      ctx.stroke();

      // Knot
      ctx.globalAlpha = 1;
      ctx.fillStyle = this.cs;
      ctx.beginPath();
      ctx.arc(0, this.r + 3, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Balloon body
      const g = ctx.createRadialGradient(-this.r * 0.28, -this.r * 0.3, this.r * 0.04, 0, 0, this.r);
      g.addColorStop(0, 'rgba(255,255,255,0.78)');
      g.addColorStop(0.28, `rgba(${this.col[0]},${this.col[1]},${this.col[2]},0.9)`);
      g.addColorStop(1, `rgba(${Math.floor(this.col[0] * 0.5)},${Math.floor(this.col[1] * 0.5)},${Math.floor(this.col[2] * 0.5)},1)`);
      ctx.globalAlpha = 0.92;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, -2, this.r * 0.82, this.r, 0, 0, Math.PI * 2);
      ctx.fill();

      // Specular highlight
      ctx.globalAlpha = 0.38;
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.ellipse(-this.r * 0.21, -this.r * 0.31, this.r * 0.17, this.r * 0.09, -0.42, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    hits(px, py) {
      return Math.hypot(px - this.x, py - this.y) < this.r + 6;
    }
  }

  class AimedShot {
    constructor(sx, sy, tx, ty) {
      this.sx = sx;
      this.sy = sy;
      this.t = 0;
      this.trail = [];
      this.done = false;
      this.hit = false;
      this.balloon = null;

      // +1 if target is to the right of launch, -1 if to the left
      this.sign = tx >= sx ? 1 : -1;
      const Dx = Math.abs((tx - sx) / SCALE);
      const Dy = (sy - ty) / SCALE; // positive = target above launch height

      // Solve for v0 given a launch angle: v0² = g·Dx² / (2·cos²θ·(Dx·tanθ − Dy))
      let solved = false;
      const tryAngles = [45, 55, 35, 65, 28, 70, 20, 75, 15, 80];
      for (const deg of tryAngles) {
        const theta = deg * Math.PI / 180;
        const ct = Math.cos(theta);
        const denom = Dx * Math.tan(theta) - Dy;
        if (denom <= 0 || Dx <= 0) continue;
        const v0sq = G * Dx * Dx / (2 * ct * ct * denom);
        if (!isFinite(v0sq) || v0sq <= 0 || v0sq > 260 * 260) continue;
        this.v0 = Math.sqrt(v0sq);
        this.angle = theta;
        solved = true;
        break;
      }

      if (!solved) {
        this.angle = Math.PI / 4;
        this.v0 = Math.max(22, Math.hypot(Dx, Math.max(Dy, 0)) * 1.4);
      }

      this.v0x = this.v0 * Math.cos(this.angle) * this.sign;
      this.v0y = this.v0 * Math.sin(this.angle);

      // Stop after 1.5× the time needed to reach the target x
      const tHit = Dx / (this.v0 * Math.cos(this.angle));
      this.tMax = tHit * 1.6 + 0.4;

      const ci = Math.floor(Math.random() * COLORS.length);
      this.col = COLORS[ci];
      this.cs = `rgb(${this.col[0]},${this.col[1]},${this.col[2]})`;
    }

    pos(t) {
      return {
        x: this.sx + this.v0x * t * SCALE,
        y: this.sy - (this.v0y * t - 0.5 * G * t * t) * SCALE
      };
    }

    update(dt) {
      if (this.done) return;
      this.t += dt;
      const p = this.pos(this.t);
      this.trail.push({ x: p.x, y: p.y });
      if (this.trail.length > 90) this.trail.shift();
      if (this.t > this.tMax || p.y > canvas.height + 80) this.done = true;
    }

    draw() {
      if (this.trail.length < 2) return;
      ctx.save();
      for (let i = 1; i < this.trail.length; i++) {
        ctx.globalAlpha = (i / this.trail.length) * 0.72;
        ctx.strokeStyle = this.cs;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
        ctx.stroke();
      }
      ctx.restore();

      if (!this.done) {
        const p = this.pos(this.t);
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = this.cs;
        ctx.shadowColor = this.cs;
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.restore();
      }
    }

    curPos() {
      return this.pos(this.t);
    }
  }

  // Click anywhere on the page to plant a balloon and fire at it
  document.addEventListener('click', (e) => {
    // Don't intercept clicks on interactive page elements
    if (e.target.closest('a, button, input, select, textarea, label, .q-option, .deck-btn, .sim-tab, .team-member-card, .nav-card, .fc-face')) return;

    const cx = e.clientX;
    const cy = e.clientY;
    const ground = canvas.height * GROUND_FRAC;

    const balloon = new UserBalloon(cx, cy);
    userBalloons.push(balloon);

    // Launch from the opposite side of the screen so the arc is visible
    const launchX = cx > canvas.width / 2 ? canvas.width * 0.04 : canvas.width * 0.96;
    const launchY = ground;

    // Don't aim below the ground line
    const targetY = Math.min(cy, ground - 20);

    const shot = new AimedShot(launchX, launchY, cx, targetY);
    shot.balloon = balloon;
    userShots.push(shot);
  });

  // ─── Main loop ──────────────────────────────────────────────────────────────

  let last = Date.now();
  function animate() {
    const now = Date.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawGround();
    drawFloaters();
    updateFloaters();
    for (const p of projectiles) { p.update(dt); p.draw(); }

    // Update and draw user balloons
    for (const b of userBalloons) { b.update(dt); b.draw(); }

    // Update and draw aimed shots; check for balloon hits
    for (const shot of userShots) {
      shot.update(dt);
      shot.draw();
      if (!shot.done && !shot.hit && shot.balloon && !shot.balloon.popped) {
        const p = shot.curPos();
        if (shot.balloon.hits(p.x, p.y)) {
          shot.balloon.pop();
          shot.hit = true;
          shot.done = true;
        }
      }
    }

    // Prune finished objects
    for (let i = userBalloons.length - 1; i >= 0; i--) {
      if (!userBalloons[i].alive) userBalloons.splice(i, 1);
    }
    for (let i = userShots.length - 1; i >= 0; i--) {
      if (userShots[i].done) userShots.splice(i, 1);
    }

    requestAnimationFrame(animate);
  }
  animate();
})();
