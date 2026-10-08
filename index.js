// 3700 ms = the time the animation takes before the screen dissolves
    setTimeout(() => {
      document.getElementById('intro').classList.add('done');
    }, 3700);
    /* PORTFOLIO SCRIPT
       OOP used here: classes + objects, inheritance (Particle >
       GlowParticle/Spark, Card > ProjectCard, Rule > Required),
       encapsulation (#private fields) and polymorphism (draw(),
       render(), test() behave differently per subclass). */

    /* Content */
    // Main portfolio data 
    const DATA = {
      name: "Kerby",
      role: "Full Stack Developer",
      photo: "assets/images/id.png",
      phrases: ["Happy life without coding.", "Simple Portfolio", "Always learning something new."],
      projects: [
        {
          t: "Philipines Tourist Spots",
          d: "This site: responsive, animated, with a physics ID card and particle background.",
          img: "assets/images/pilipin.png",
          link: "https://pilipin.netlify.app",
          tags: "HTML, CSS, JavaScript",
          l: "#",
        },
        {
          t: "Valentines Date",
          d: "A romantic website for a special day.",
          tags: "HTML, CSS, JavaScript",
          img: "assets/images/valentines.png",
          link: "https://cozy-pastelito-65db08.netlify.app",
          l: "#",
        },
        {
          t: "CAH Library",
          d: "A library management system built with PHP and CSS.",
          tags: "PHP, MySQL, CSS",
          img: "assets/images/CAH.png",
          l: "#",
        },
        {
          t: "Ordering System",
          d: "A simple ordering system built with PHP and CSS.",
          tags: "PHP, MySQL, CSS",
          img: "assets/images/restau.png",
          l: "#",
        },
      ],
      achievements: [
        { t: "PROJECT MANAGEMENT Certificate", d: "Certiport, 2026" },
        { t: "High Honor", d: "Senior High School, 2024" },
        { t: "Dean's Lister", d: "National University, 2026" },
      ],
      stack: [
        ["React", "Re", "#1b6f8a"],
        ["TypeScript", "TS", "#2b6cb0"],
        ["Java", "J", "#0f8f9c"],
        ["HTML", "H5", "#d4501f"],
        ["CSS", "C3", "#2a6fd0"],
        ["PHP", "PHP", "#6b6fb5"],
        ["Laravel", "La", "#d03c36"],
        ["Node.js", "N", "#000"],
        ["JavaScript", "JS", "#b59b00"],
        ["MySQL", "SQL", "#2c6b8a"],
      ],
      skills: [
        ["HTML and CSS", 92],
        ["JavaScript", 85],
        ["PHP", 78],
        ["UI design", 72],
      ],
      interests: ["Web design", "Open source", "Eating", "Gaming", "Music"],
    };

    // Simple selector helper for quick DOM access throughout the app.
    const $ = (s, r) => (r || document).querySelector(s);
    const reduced = matchMedia("(prefers-reduced-motion:reduce)").matches;
 
    const esc = (s) =>
      String(s).replace(/[&<>\"]/g, (c) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
      }[c]));

    // Display a temporary toast message 
    function toast(m) {
      const t = $("#toast");
      t.textContent = m;
      t.classList.add("show");
      setTimeout(() => t.classList.remove("show"), 2600);
    }

    /* Typewriter */
    // Animates the rotating text lines in the hero section 
    class Typewriter {
      #el;
      #list;
      #i = 0;
      #j = 0;
      #del = false;

      constructor(el, list) {
        this.#el = el;
        this.#list = list;
      }

      start() {
        if (reduced) {
          this.#el.textContent = this.#list[0];
          return;
        }
        this.#tick();
      }

      #tick() {
        const w = this.#list[this.#i];
        this.#j += this.#del ? -1 : 1;
        this.#el.textContent = w.slice(0, this.#j);

        let d = this.#del ? 35 : 80;
        if (!this.#del && this.#j === w.length) {
          this.#del = true;
          d = 1400;
        } else if (this.#del && this.#j === 0) {
          this.#del = false;
          this.#i = (this.#i + 1) % this.#list.length;
          d = 350;
        }

        setTimeout(() => this.#tick(), d);
      }
    }

    /*Particles*/
    class Particle {
      constructor(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        const a = Math.random() * 6.283;
        this.speed = 0.25 + Math.random() * 0.55;
        this.vx = Math.cos(a) * this.speed;
        this.vy = Math.sin(a) * this.speed;
        this.r = 0.8 + Math.random() * 1.7;
        this.ph = Math.random() * 6.283;
        this.z = 0.4 + Math.random() * 0.6;
      }

      push(fx, fy) {
        this.vx += fx;
        this.vy += fy;
      }

      update(w, h) {
        this.vx *= 0.985;
        this.vy *= 0.985;
        this.ph += 0.01;

        if (Math.hypot(this.vx, this.vy) < 0.15) {
          this.vx += Math.cos(this.ph) * 0.05;
          this.vy += Math.sin(this.ph) * 0.05;
        }

        this.x += this.vx * this.z + 0.0;
        this.y += this.vy * this.z;

        if (this.x < -12) this.x = w + 12;
        if (this.x > w + 12) this.x = -12;
        if (this.y < -12) this.y = h + 12;
        if (this.y > h + 12) this.y = -12;
      }

      get alive() {
        return true;
      }

      draw(c, col, t, ox, oy) {
        c.fillStyle = `rgba(${col},${0.45 + 0.25 * Math.sin(t * 2 + this.ph)})`;
        c.beginPath();
        c.arc(this.x + ox * this.z, this.y + oy * this.z, this.r * this.z + 0.4, 0, 6.283);
        c.fill();
      }
    }

    class GlowParticle extends Particle {
      constructor(w, h) {
        super(w, h);
        this.r = 2 + Math.random() * 1.6;
      }

      draw(c, col, t, ox, oy) {
        const x = this.x + ox * this.z;
        const y = this.y + oy * this.z;
        const p = 0.5 + 0.5 * Math.sin(t * 1.6 + this.ph);
        const R = this.r * (5 + p * 5);
        const g = c.createRadialGradient(x, y, 0, x, y, R);
        g.addColorStop(0, `rgba(${col},.5)`);
        g.addColorStop(1, `rgba(${col},0)`);
        c.fillStyle = g;
        c.beginPath();
        c.arc(x, y, R, 0, 6.283);
        c.fill();

        c.fillStyle = `rgba(${col},.95)`;
        c.beginPath();
        c.arc(x, y, this.r * 0.8, 0, 6.283);
        c.fill();
      }
    }

    class Spark extends Particle {
      constructor(x, y) {
        super(0, 0);
        this.x = x;
        this.y = y;
        const a = Math.random() * 6.283;
        const s = 1.5 + Math.random() * 3.5;
        this.vx = Math.cos(a) * s;
        this.vy = Math.sin(a) * s;
        this.life = 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.93;
        this.vy *= 0.93;
        this.life -= 0.022;
      }

      get alive() {
        return this.life > 0;
      }

      draw(c, col) {
        c.strokeStyle = `rgba(${col},${this.life * 0.85})`;
        c.lineWidth = 1.4;
        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(this.x - this.vx * 3, this.y - this.vy * 3);
        c.stroke();
      }
    }

    class ParticleField {
      #host;
      #cv;
      #c;
      #w = 0;
      #h = 0;
      #dots = [];
      #sparks = [];
      #rings = [];
      #m = { x: -9999, y: -9999 };
      #col = "242,242,242";
      #vis = true;
      #going = false;
      #t = 0;

      static LINK = 140;
      static GRAB = 200;
      static PUSH = 100;

      constructor(host, cv) {
        this.#host = host;
        this.#cv = cv;
        this.#c = cv.getContext("2d");

        addEventListener("pointermove", (e) => {
          const r = host.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          this.#m = x < 0 || y < 0 || x > this.#w || y > this.#h ? { x: -9999, y: -9999 } : { x, y };
          if (reduced) this.#kick();
        });

        host.addEventListener("pointerdown", (e) => {
          if (e.target.closest("a,button")) return;
          const r = host.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          this.burst(x, y);
        });

        new IntersectionObserver((e) => {
          this.#vis = e[0].isIntersecting;
          if (this.#vis) this.#kick();
        }).observe(host);

        new ResizeObserver(() => this.#size()).observe(host);
        document.addEventListener("visibilitychange", () => this.#kick());
        matchMedia("(prefers-color-scheme:light)").addEventListener("change", () =>
          setTimeout(() => {
            this.#readCol();
            this.#kick();
          }, 60)
        );

        this.#readCol();
        this.#size();
      }

      #readCol() {
        const m = getComputedStyle(document.body).color.match(/\d+/g);
        if (m) this.#col = m.slice(0, 3).join(",");
      }

      #size() {
        const d = Math.min(devicePixelRatio || 1, 2);
        this.#w = this.#host.clientWidth;
        this.#h = this.#host.clientHeight;
        this.#cv.width = this.#w * d;
        this.#cv.height = this.#h * d;
        this.#c.setTransform(d, 0, 0, d, 0, 0);

        const n = Math.min(350, Math.round((this.#w * this.#h) / 8000));
        while (this.#dots.length < n) {
          this.#dots.push(Math.random() < 0.16 ? new GlowParticle(this.#w, this.#h) : new Particle(this.#w, this.#h));
        }
        this.#dots.length = n;
        this.#kick();
      }

      burst(x, y) {
        for (let i = 0; i < 16; i++) this.#sparks.push(new Spark(x, y));
        this.#rings.push({ x, y, r: 0, life: 1 });
        if (reduced) this.#kick();
      }

      #kick() {
        if (!this.#going) {
          this.#going = true;
          requestAnimationFrame(() => this.#frame());
        }
      }

      #frame() {
        this.#going = false;
        if (!this.#vis || document.hidden) return;

        const c = this.#c;
        const w = this.#w;
        const h = this.#h;
        const m = this.#m;
        const col = this.#col;
        const D = this.#dots;
        this.#t += 0.016;
        const t = this.#t;

        //const ox = m.x > -999 ? (w / 2 - m.x) * 0.04 : 0;
        //const oy = m.x > -999 ? (h / 2 - m.y) * 0.04 : 0;
        const ox = 0;
        const oy = 0;

        c.clearRect(0, 0, w, h);

        if (m.x > -999) {
          const g = c.createRadialGradient(m.x, m.y, 0, m.x, m.y, 230);
          g.addColorStop(0, `rgba(${col},.11)`);
          g.addColorStop(1, `rgba(${col},0)`);
          c.fillStyle = g;
          c.fillRect(m.x - 230, m.y - 230, 460, 460);
        }
        

        for (const r of this.#rings) {
          r.r += 7;
          r.life -= 0.026;
          c.strokeStyle = `rgba(${col},${Math.max(r.life, 0) * 0.5})`;
          c.lineWidth = 1.5;
          c.beginPath();
          c.arc(r.x, r.y, r.r, 0, 6.283);
          c.stroke();
        }
        this.#rings = this.#rings.filter((r) => r.life > 0);

        for (let i = 0; i < D.length; i++) {
          const a = D[i];
          if (!reduced) {
            let dx = a.x - m.x;
            let dy = a.y - m.y;
            let d = Math.hypot(dx, dy) || 1;
            if (d < ParticleField.PUSH) {
              const f = (1 - d / ParticleField.PUSH) * 0.35;
              a.push((dx / d) * f, (dy / d) * f);
            }

            for (const r of this.#rings) {
              dx = a.x - r.x;
              dy = a.y - r.y;
              d = Math.hypot(dx, dy) || 1;
              if (Math.abs(d - r.r) < 26) a.push((dx / d) * 0.9 * r.life, (dy / d) * 0.9 * r.life);
            }

            a.update(w, h);
          }

          a.draw(c, col, t, ox, oy);

          const ax = a.x + ox * a.z;
          const ay = a.y + oy * a.z;
          for (let j = i + 1; j < D.length; j++) {
            const b = D[j];
            const bx = b.x + ox * b.z;
            const by = b.y + oy * b.z;
            const d = Math.hypot(ax - bx, ay - by);
            if (d < ParticleField.LINK) {
              c.strokeStyle = `rgba(${col},${0.26 * (1 - d / ParticleField.LINK)})`;
              c.lineWidth = 1;
              c.beginPath();
              c.moveTo(ax, ay);
              c.lineTo(bx, by);
              c.stroke();
            }
          }

          const e = Math.hypot(ax - m.x, ay - m.y);
          if (e < ParticleField.GRAB) {
            c.strokeStyle = `rgba(${col},${0.6 * (1 - e / ParticleField.GRAB)})`;
            c.beginPath();
            c.moveTo(ax, ay);
            c.lineTo(m.x, m.y);
            c.stroke();
          }
        }

        for (const s of this.#sparks) {
          s.update();
          s.draw(c, col);
        }
        this.#sparks = this.#sparks.filter((s) => s.alive);

        if (!reduced || this.#sparks.length || this.#rings.length) {
          this.#going = true;
          requestAnimationFrame(() => this.#frame());
        }
      }
    }

    /*Lanyard*/
    class Lanyard {
      #cv;
      #c;
      #W = 0;
      #H = 0;
      #dpr = 1;
      #P = [];
      #K = [];
      #drag = null;
      #vis = false;
      #going = false;
      #t = 0;
      #img = null;
      #hover = false;

      static CW = 230;
      static CH = 320;
      static CLIP = 25;

      constructor(cv) {
        this.#cv = cv;
        this.#c = cv.getContext("2d");

        if (DATA.photo) {
          this.#img = new Image();
          this.#img.src = DATA.photo;
        }

        new ResizeObserver(() => this.#build()).observe(cv.parentElement);
        new IntersectionObserver((e) => {
          this.#vis = e[0].isIntersecting;
          if (this.#vis) {
            this.#nudge();
            this.#kick();
          }
        }).observe(cv);

        cv.addEventListener("pointerdown", (e) => {
          const p = this.#pos(e);
          if (!this.#hit(p)) return;
          const B = this.#P[1];
          this.#drag = { dx: B.x - p.x, dy: B.y - p.y, x: p.x, y: p.y };
          cv.setPointerCapture(e.pointerId);
          cv.style.cursor = "grabbing";
          this.#kick();
        });

        cv.addEventListener("pointermove", (e) => {
          const p = this.#pos(e);
          if (this.#drag) {
            this.#drag.x = Math.min(Math.max(p.x, 30), this.#W - 30);
            this.#drag.y = Math.min(Math.max(p.y, 80), this.#H - 30);
          } else {
            this.#hover = this.#hit(p);
            cv.style.cursor = this.#hover ? "grab" : "default";
          }
        });

        const end = () => {
          if (this.#drag) {
            for (const q of this.#P) {
              q.px = q.x - (q.x - q.px) * 0.6;
              q.py = q.y - (q.y - q.py) * 0.6;
            }
          }
          this.#drag = null;
          cv.style.cursor = this.#hover ? "grab" : "default";
        };

        cv.addEventListener("pointerup", end);
        cv.addEventListener("pointercancel", end);
        cv.addEventListener(
          "touchstart",
          (e) => {
            const t = e.touches[0];
            const r = cv.getBoundingClientRect();
            if (this.#hit({ x: t.clientX - r.left, y: t.clientY - r.top })) e.preventDefault();
          },
          { passive: false }
        );
      }

      #build() {
        const cv = this.#cv;
        const d = Math.min(devicePixelRatio || 1, 2);
        this.#dpr = d;
        this.#W = cv.parentElement.clientWidth;
        this.#H = cv.parentElement.clientHeight;
        cv.width = this.#W * d;
        cv.height = this.#H * d;
        this.#c.setTransform(d, 0, 0, d, 0, 0);

        const cx = this.#W / 2;
        const sp = Math.min(56, this.#W * 0.15);
        const N = 8;
        const L = Lanyard.CLIP + Lanyard.CH;
        const pt = (x, y, pin) => ({ x, y, px: x, py: y, pin: !!pin });

        const P = [pt(cx, 300), pt(cx, 300 + L)];
        const K = [[0, 1, L]];

        [-1, 1].forEach((side) => {
          const start = P.length;
          for (let k = 0; k < N; k++) {
            const u = k / N;
            P.push(pt(cx + side * sp * (1 - u), -30 + 330 * u, k === 0));
          }
          for (let k = start; k < P.length; k++) {
            const nx = k + 1 < P.length ? k + 1 : 0;
            if (k + 1 >= start + N) K.push([k, 0, 0]);
            else K.push([k, k + 1, 0]);
          }
        });

        K.forEach((k) => {
          if (!k[2]) {
            const a = P[k[0]];
            const b = P[k[1]];
            k[2] = Math.hypot(a.x - b.x, a.y - b.y) * 1.02;
          }
        });

        this.#P = P;
        this.#K = K;
        this.#nudge();
        this.#kick();
      }

      #nudge() {
        const B = this.#P[1];
        if (B && !reduced) B.px -= 5;
      }

      #ang() {
        const A = this.#P[0];
        const B = this.#P[1];
        return Math.atan2(-(B.x - A.x), B.y - A.y);
      }

      #pos(e) {
        const r = this.#cv.getBoundingClientRect();
        return {
          x: e.clientX - r.left,
          y: e.clientY - r.top,
        };
      }

      #hit(p) {
        const A = this.#P[0];
        const a = this.#ang();
        const dx = p.x - A.x;
        const dy = p.y - A.y;
        const lx = dx * Math.cos(a) + dy * Math.sin(a);
        const ly = -dx * Math.sin(a) + dy * Math.cos(a);

        return lx > -Lanyard.CW / 2 && lx < Lanyard.CW / 2 && ly > 0 && ly < Lanyard.CLIP + Lanyard.CH;
      }

      #kick() {
        if (!this.#going) {
          this.#going = true;
          requestAnimationFrame(() => this.#frame());
        }
      }

      #step() {
        const P = this.#P;
        this.#t += 0.016;

        for (const p of P) {
          if (p.pin) continue;
          let vx = (p.x - p.px) * 0.994;
          let vy = (p.y - p.py) * 0.994;
          const s = Math.hypot(vx, vy);
          if (s > 28) {
            vx *= 28 / s;
            vy *= 28 / s;
          }
          p.px = p.x;
          p.py = p.y;
          p.x += vx;
          p.y += vy + 0.62;
        }

        P[1].x += Math.sin(this.#t * 0.7) * 0.03;

        if (this.#drag) {
          const B = P[1];
          const g = this.#drag;
          B.x += (g.x + g.dx - B.x) * 0.3;
          B.y += (g.y + g.dy - B.y) * 0.3;
        }

        for (let it = 0; it < 18; it++)
          for (const [i, j, len] of this.#K) {
            const a = P[i];
            const b = P[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const d = Math.hypot(dx, dy) || 1;
            const diff = (d - len) / d;
            const w = a.pin ? 0 : b.pin ? 1 : 0.5;
            const v = a.pin ? 1 : b.pin ? 0 : 0.5;
            if (!a.pin) {
              a.x += dx * diff * w;
              a.y += dy * diff * w;
            }
            if (!b.pin) {
              b.x -= dx * diff * v;
              b.y -= dy * diff * v;
            }
          }
      }

      #curve(ids) {
        const p = ids.map((i) => this.#P[i]);
        const o = [];
        const f = (a, b, c, d, u) =>
          0.5 *
          (2 * b +
            (-a + c) * u +
            (2 * a - 5 * b + 4 * c - d) * u * u +
            (-a + 3 * b - 3 * c + d) * u * u * u);

        for (let i = 0; i < p.length - 1; i++) {
          const a = p[Math.max(i - 1, 0)];
          const b = p[i];
          const c = p[i + 1];
          const d = p[Math.min(i + 2, p.length - 1)];
          for (let s = 0; s < 6; s++) {
            const u = s / 6;
            o.push({ x: f(a.x, b.x, c.x, d.x, u), y: f(a.y, b.y, c.y, d.y, u) });
          }
        }

        o.push({ x: p[p.length - 1].x, y: p[p.length - 1].y });
        return o;
      }

      #strap(poly) {
        const c = this.#c;
        c.lineJoin = "round";
        c.beginPath();
        poly.forEach((q, i) => (i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y)));

        c.strokeStyle = "#3a3a3a";
        c.lineWidth = 17;
        c.stroke();
        c.strokeStyle = "#121212";
        c.lineWidth = 14;
        c.stroke();

        const len = [];
        let total = 0;
        for (let i = 0; i < poly.length - 1; i++) {
          const l = Math.hypot(poly[i + 1].x - poly[i].x, poly[i + 1].y - poly[i].y);
          len.push(l);
          total += l;
        }

        const txt = `NATIONAL UNIVERSITY  ✦  NATIONAL UNIVERSITY  ✦  `;
        c.font = "700 7.5px Syne,Arial,sans-serif";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillStyle = "rgba(255,255,255,.72)";

        let s = 10;
        let seg = 0;
        let acc = 0;

        for (let n = 0; ; n++) {
          const ch = txt[n % txt.length];
          const w = c.measureText(ch).width + 1.5;
          if (s + w > total - 4) break;
          while (seg < len.length - 1 && acc + len[seg] < s + w / 2) {
            acc += len[seg];
            seg++;
          }
          const u = (s + w / 2 - acc) / (len[seg] || 1);
          const a = poly[seg];
          const b = poly[seg + 1];
          c.save();
          c.translate(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u);
          c.rotate(Math.atan2(b.y - a.y, b.x - a.x));
          c.fillText(ch, 0, 0);
          c.restore();
          s += w;
        }
      }

      #card() {
        const c = this.#c;
        const A = this.#P[0];
        const a = this.#ang();
        const W = Lanyard.CW;
        const H = Lanyard.CH;
        const T = Lanyard.CLIP;

        c.save();
        c.translate(A.x, A.y);
        c.rotate(a);

        c.shadowColor = "rgba(0,0,0,.55)";
        c.shadowBlur = 30;
        c.shadowOffsetY = 16;
        c.fillStyle = "#f1f1f1";
        c.beginPath();
        c.roundRect(-W / 2, T, W, H, 16);
        c.fill();
        c.shadowColor = "transparent";

        if (this.#hover || this.#drag) {
          c.strokeStyle = "rgba(255,255,255,.9)";
          c.lineWidth = 2;
          c.stroke();
        }

        c.fillStyle = "#1a1a1a";
        c.beginPath();
        c.roundRect(-20, T + 10, 40, 8, 4);
        c.fill();

        c.save();
        c.beginPath();
        c.roundRect(-W / 2 + 16, T + 34, W - 32, 172, 10);
        c.clip();
        const g = c.createLinearGradient(0, T + 34, 0, T + 206);
        g.addColorStop(0, "#d4d4d4");
        g.addColorStop(1, "#707070");
        c.fillStyle = g;
        c.fillRect(-W / 2, T + 34, W, 172);

        if (this.#img && this.#img.complete && this.#img.naturalWidth) {
          const im = this.#img;
          const k = Math.max((W - 32) / im.naturalWidth, 172 / im.naturalHeight);
          c.drawImage(
            im,
            -im.naturalWidth * k / 2,
            T + 34 + (172 - im.naturalHeight * k) / 2,
            im.naturalWidth * k,
            im.naturalHeight * k
          );
        } else {
          c.fillStyle = "#222";
          c.beginPath();
          c.arc(0, T + 98, 34, 0, 6.283);
          c.fill();
          c.fillStyle = "#111";
          c.beginPath();
          c.ellipse(0, T + 190, 76, 62, 0, Math.PI, 0);
          c.fill();
          c.fillStyle = "#eee";
          c.beginPath();
          c.moveTo(-12, T + 142);
          c.lineTo(0, T + 170);
          c.lineTo(12, T + 142);
          c.fill();
        }
        c.restore();

        c.textAlign = "left";
        c.textBaseline = "alphabetic";
        c.fillStyle = "#0b0b0b";
        c.font = "800 20px Syne,Arial,sans-serif";
        c.fillText(DATA.name, -W / 2 + 16, T + 234);

        c.fillStyle = "#555";
        c.font = "500 12px Manrope,Arial,sans-serif";
        c.fillText(DATA.role, -W / 2 + 16, T + 254);

        c.fillStyle = "#111";
        let x = -W / 2 + 16;
        for (let i = 0; i < 34; i++) {
          const bw = (i * 7) % 4 + 1;
          c.fillRect(x, T + 270, bw, 24);
          x += bw + 2;
          if (x > -W / 2 + 120) break;
        }

        c.fillStyle = "#777";
        c.font = "500 10px Manrope,Arial,sans-serif";
        c.textAlign = "right";
        c.fillText("No. 2026-0001", W / 2 - 16, T + 288);

        const hue = (a * 260 + this.#t * 30) % 360;
        const h = c.createLinearGradient(-W / 2 + 16, 0, W / 2 - 16, 0);
        [0, 0.33, 0.66, 1].forEach((s, i) => h.addColorStop(s, `hsl(${hue + i * 70},70%,62%)`));
        c.fillStyle = h;
        c.beginPath();
        c.roundRect(-W / 2 + 16, T + 292, W - 32, 9, 4);
        c.fill();

        const sh = Math.min(Math.max(0.5 + a * 1.4, 0.1), 0.9);
        const gl = c.createLinearGradient(-W / 2, T, W / 2, T + H);
        const st = (v) => Math.min(1, Math.max(0, v));
        gl.addColorStop(st(sh - 0.18), "rgba(255,255,255,0)");
        gl.addColorStop(st(sh), "rgba(255,255,255,.28)");
        gl.addColorStop(st(sh + 0.18), "rgba(255,255,255,0)");
        c.fillStyle = gl;
        c.beginPath();
        c.roundRect(-W / 2, T, W, H, 16);
        c.fill();

        const m = c.createLinearGradient(-14, 0, 14, 0);
        m.addColorStop(0, "#8c8c8c");
        m.addColorStop(0.5, "#f2f2f2");
        m.addColorStop(1, "#7a7a7a");
        c.fillStyle = m;
        c.beginPath();
        c.roundRect(-14, 4, 28, T + 4, 6);
        c.fill();
        c.fillStyle = "#2a2a2a";
        c.beginPath();
        c.roundRect(-5, 12, 10, 16, 4);
        c.fill();
        c.strokeStyle = m;
        c.lineWidth = 3;
        c.beginPath();
        c.arc(0, 0, 6, 0, 6.283);
        c.stroke();

        c.restore();
      }

      #frame() {
        this.#going = false;
        if (!this.#vis || !this.#P.length) return;
        if (!reduced) {
          this.#step();
          this.#step();
        }

        const c = this.#c;
        c.setTransform(this.#dpr, 0, 0, this.#dpr, 0, 0);
        c.shadowColor = "transparent";
        c.clearRect(0, 0, this.#W, this.#H);

        try {
          this.#strap(this.#curve([2, 3, 4, 5, 6, 7, 8, 9, 0]));
          this.#strap(this.#curve([10, 11, 12, 13, 14, 15, 16, 17, 0]));
          this.#card();
        } catch (err) {
          console.error(err);
        }

        if (!reduced) {
          this.#going = true;
          requestAnimationFrame(() => this.#frame());
        }
      }
    }

    /* Cards: inheritance  */
    class Card {
      constructor(d, i) {
        this.d = d;
        this.i = i;
      }

      thumb() {
        return '<div class="th"></div>';
      }

      body() {
        return "";
      }

      render() {
        return `<article class="card">${this.thumb()}<div class="bd">${this.body()}</div></article>`;
      }
    }

    class ProjectCard extends Card {
      thumb() {
        const d = this.d;
        if (d.img) {
          return `<div class="th"><img src="${esc(d.img)}" alt="${esc(d.t)}"></div>`;
        }

        const i = this.i;
        const bars = [0, 1, 2]
          .map((k) => `<rect x="14" y="${46 + k * 16}" width="${60 + ((i + k) * 23) % 70}" height="7" rx="3.500" fill="#3a3a3a"/>`)
          .join("");

        return `<div class="th"><svg viewBox="0 0 200 125" preserveAspectRatio="xMidYMid slice"><rect width="200" height="125" fill="#141414"/><rect x="0" y="0" width="200" height="22" fill="#1c1c1c"/><circle cx="12" cy="11" r="3" fill="#555"/><circle cx="22" cy="11" r="3" fill="#444"/><circle cx="32" cy="11" r="3" fill="#333"/><rect x="14" y="30" width="${90 + i * 20}" height="9" rx="4" fill="#bbb"/>${bars}<rect x="${120 + i * 12}" y="60" width="64" height="48" rx="8" fill="#242424"/></svg></div>`;
      }

      body() {
        const d = this.d;
        return `<h3>${esc(d.t)}</h3><p>${esc(d.d)}</p><p style="color:var(--dim)">${esc(d.tags)}</p><a href="${esc(d.link || d.l || "#")}" class="btn solid view-project" data-title="${esc(d.t)}" data-image="${esc(d.img || "")}" data-link="${esc(d.link || d.l || "#")}" data-repo="${esc(d.repo || "#")}">View project <svg viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></svg></a>`;
      }
    }

    class AchievementCard extends Card {
      thumb() {
        return `<div class="th cert"><svg viewBox="0 0 24 24" style="width:44px;height:44px;stroke:#999"><circle cx="12" cy="9" r="5"/><path d="m9 13-1 8 4-2 4 2-1-8"/></svg></div>`;
      }

      body() {
        return `<h3>${esc(this.d.t)}</h3><p>${esc(this.d.d)}</p>`;
      }
    }

    class StackTile extends Card {
      render() {
        const [n, k, c] = this.d;
        return `<div class="tile"><i style="background:${c}">${esc(k)}</i>${esc(n)}</div>`;
      }
    }

    class Showcase {
      #panel;
      #sets;

      constructor(panel, tabs, sets) {
        this.#panel = panel;
        this.#sets = sets;

        tabs.forEach((b) =>
          b.addEventListener("click", () => {
            tabs.forEach((x) => x.setAttribute("aria-selected", x === b));
            this.show(b.dataset.t);
          })
        );

        this.show("projects");
      }

      show(key) {
        const { cls, items, wrap } = this.#sets[key];
        this.#panel.innerHTML = `<div class="${wrap}">${items.map((d, i) => new cls(d, i).render()).join("")}</div>`;
      }
    }

    /* Form validation */
    class Rule {
      constructor(msg) {
        this.msg = msg;
      }

      test() {
        return true;
      }
    }

    class Required extends Rule {
      test(v) {
        return v.trim().length > 0;
      }
    }

    class MinLength extends Rule {
      constructor(n, msg) {
        super(msg);
        this.n = n;
      }

      test(v) {
        return v.trim().length >= this.n;
      }
    }

    class EmailRule extends Rule {
      test(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
      }
    }

    class Field {
      #el;
      #rules;
      #err;

      constructor(el, rules) {
        this.#el = el;
        this.#rules = rules;
        this.#err = el.nextElementSibling;
        el.addEventListener("input", () => this.validate());
      }

      get value() {
        return this.#el.value.trim();
      }

      clear() {
        this.#el.value = "";
        this.#show("");
      }

      #show(m) {
        this.#err.textContent = m;
        this.#el.setAttribute("aria-invalid", m ? "true" : "false");
      }

      validate() {
        for (const r of this.#rules) {
          if (!r.test(this.#el.value)) {
            this.#show(r.msg);
            return false;
          }
        }
        this.#show("");
        return true;
      }
    }

    class ContactForm {
      #fields;

      constructor(fields, btn, onValid) {
        this.#fields = fields;
        btn.addEventListener("click", () => {
          const ok = this.#fields.map((f) => f.validate()).every(Boolean);
          if (ok) {
            onValid(this.#fields.map((f) => f.value));
            this.#fields.forEach((f) => f.clear());
          } else {
            toast("Please fix the highlighted fields");
          }
        });
      }
    }

    class CommentBoard {
      #list;
      #items = [{ n: "Kerbs", c: "Thanks for visiting my portfolio!" }];

      constructor(list) {
        this.#list = list;
        try {
          const v = JSON.parse(localStorage.getItem("cm2") || "null");
          if (Array.isArray(v)) this.#items = v;
        } catch (e) { }
        this.draw();
      }

      add(n, c) {
        this.#items.unshift({ n: n.slice(0, 40), c: c.slice(0, 400) });
        try {
          localStorage.setItem("cm2", JSON.stringify(this.#items));
        } catch (e) { }
        this.draw();
      }

      draw() {
        this.#list.innerHTML = this.#items
          .map(
            (x) =>
              `<div class="cm"><div class="av">${esc(x.n.charAt(0).toUpperCase())}</div><div><b>${esc(x.n)}</b><p>${esc(x.c)}</p></div></div>`
          )
          .join("");
      }
    }

    /* Start everything */
    class App {
      static init() {
        setTimeout(() => $("#intro").classList.add("done"), 2400);

        if (DATA.photo) {
          const a = $("#avatar");
          a.style.backgroundImage = `url(${DATA.photo})`;
          a.innerHTML = "";
        }

        $("#track").innerHTML = [...DATA.stack, ...DATA.stack].map((s) => `<span>${esc(s[0])}</span>`).join("");
        $("#skills").innerHTML = DATA.skills.map((s) => `<div class="sk"><div><span>${esc(s[0])}</span><em>${s[1]}%</em></div><div class="bar"><i style="--w:${s[1]}%"></i></div></div>`).join("");
        $("#interests").innerHTML = DATA.interests.map((i) => `<span class="chip">${esc(i)}</span>`).join("");

        new ParticleField($("#home"), $("#fx"));
        new Lanyard($("#lc"));
        setTimeout(() => new Typewriter($("#type"), DATA.phrases).start(), 2500);

        new Showcase($("#panel"), document.querySelectorAll(".tabs button"), {
          projects: { cls: ProjectCard, items: DATA.projects, wrap: "grid" },
          achievements: { cls: AchievementCard, items: DATA.achievements, wrap: "grid" },
          stack: { cls: StackTile, items: DATA.stack, wrap: "tech" },
        });

        document.addEventListener("click", (event) => {
          const btn = event.target.closest(".view-project");
          if (!btn) return;

          const title = btn.dataset.title;
          const image = btn.dataset.image || "assets/images/pilipin.png";
          const link = btn.dataset.link || "#";
          const repo = btn.dataset.repo || "#";

          const modal = document.createElement("div");
          modal.className = "project-modal";

          modal.innerHTML = `
            <div class="project-modal-box">
              <button type="button" class="project-close" aria-label="Close project preview">×</button>
              <h3>${esc(title)}</h3>
              <img src="${esc(image)}" alt="${esc(title)}">
              <div class="project-links">
                <a class="btn solid" href="${esc(link)}" target="_blank" rel="noreferrer">Open live demo</a>
                <a class="btn" href="${esc(repo)}" target="_blank" rel="noreferrer">GitHub repo</a>
              </div>
            </div>
          `;

          modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.remove();
          });

          const closeBtn = modal.querySelector(".project-close");
          closeBtn.addEventListener("click", () => modal.remove());

          document.body.appendChild(modal);
        });

        const text = (m) => new Required(m);
        const f = (id) => $("#" + id);

        new ContactForm(
          [
            new Field(f("cn"), [text("Enter your name"), new MinLength(2, "Name is too short")]),
            new Field(f("ce"), [text("Enter your email"), new EmailRule("Enter a valid email, like name@mail.com")]),
            new Field(f("cm"), [text("Write a message"), new MinLength(10, "Message needs at least 10 characters")]),
          ],
          $("#send"),
          () => toast("Message ready. Connect an email service to deliver it.")
        );

        const board = new CommentBoard($("#list"));
        const kn = new Field(f("kn"), [text("Enter your name")]);
        const kc = new Field(f("kc"), [text("Write a comment")]);

        $("#post").addEventListener("click", () => {
          if (kn.validate() & kc.validate()) {
            board.add(kn.value, kc.value);
            kn.clear();
            kc.clear();
            toast("Comment posted");
          }
        });

        $("#cv").addEventListener("click", (e) => {
          e.preventDefault();
          toast("Add your CV link to the Download CV button");
        });

        let seen = false;
        const count = (id, n) => {
          const el = $(id);
          let i = 0;
          const h = setInterval(() => {
            el.textContent = ++i;
            if (i >= n) clearInterval(h);
          }, 260);
        };

        new IntersectionObserver(
          (e) => {
            if (e[0].isIntersecting && !seen) {
              seen = true;
              count("#n1", DATA.projects.length);
              count("#n2", DATA.achievements.length);
              count("#n3", DATA.projects.length);
            }
          },
          { threshold: 0.4 }
        ).observe($(".stats"));

        new IntersectionObserver(
          (e) => {
            if (e[0].isIntersecting) $("#more").classList.add("on");
          },
          { threshold: 0.25 }
        ).observe($("#more"));

        const links = document.querySelectorAll('nav a[href^="#"]:not(.logo)');
        const io = new IntersectionObserver((es) =>
          es.forEach((e) => {
            if (e.isIntersecting) {
              links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
            }
          })
          , { rootMargin: "-45% 0px -50% 0px" });

        document.querySelectorAll("main section").forEach((x) => io.observe(x));
      }
    }

    App.init();