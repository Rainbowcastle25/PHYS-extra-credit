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

      // Scale vectors so the full speed covers ~90px
      const speed = Math.sqrt(v.vx * v.vx + v.vy * v.vy);
      const vs = 90 / Math.max(speed, 1);

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
    requestAnimationFrame(animate);
  }
  animate();
})();
