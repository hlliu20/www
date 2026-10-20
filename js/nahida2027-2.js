/* ===== 纳西妲生日倒计时 · 星空版 ===== */
(function () {
  "use strict";

  /* ---------- 音乐播放 ---------- */
  const music = document.getElementById("bg-music");
  const musicToggle = document.getElementById("music-toggle");
  let musicPlaying = false;
  function setPlayingUI(p) { musicPlaying = p; musicToggle.classList.toggle("playing", p); musicToggle.classList.toggle("paused", !p); }
  function tryAutoPlay() {
    music.play().then(() => setPlayingUI(true)).catch(() => {
      setPlayingUI(false);
      const onFirst = () => { music.play().then(() => setPlayingUI(true)).catch(() => {}); document.removeEventListener("click", onFirst); document.removeEventListener("touchstart", onFirst); };
      document.addEventListener("click", onFirst, { once: true });
      document.addEventListener("touchstart", onFirst, { once: true });
    });
  }
  musicToggle.addEventListener("click", (e) => { e.stopPropagation(); if (musicPlaying) { music.pause(); setPlayingUI(false); } else { music.play().then(() => setPlayingUI(true)).catch(() => {}); } });
  tryAutoPlay();

  const TARGET = new Date(2027, 9, 27, 0, 0, 0).getTime();
  const START = new Date(2026, 9, 27, 0, 0, 0).getTime();
  const RING_C = 2 * Math.PI * 52;

  const elDays = document.getElementById("days");
  const elHours = document.getElementById("hours");
  const elMinutes = document.getElementById("minutes");
  const elSeconds = document.getElementById("seconds");
  const ringFill = document.getElementById("ring-fill");
  const ringPct = document.getElementById("ring-pct");
  const countdownEl = document.getElementById("countdown");
  const celebrateEl = document.getElementById("celebrate");

  /* ---------- 真实台词（9条） ---------- */
  const QUOTES = [
    { text: "快去睡吧，放心，我已经为你准备好甜甜的梦啦。", source: "语音「晚安」" },
    { text: "你知道吗？雷鸣是生命的前奏，很快这片大地就会充满生机。", source: "语音「打雷的时候」" },
    { text: "听见了吗？天空正对万物轻语：「睡觉时间到了哦。」", source: "语音「下雪的时候」" },
    { text: "又有心事吗？我来陪你一起想吧。", source: "语音「闲聊·心事」" },
    { text: "早上好，我们赶快出发吧，这世上有太多的东西都是「过时不候」的呢。", source: "语音「早上好」" },
    { text: "初次见面，我已经关注你很久了。我叫纳西妲，别看我像个孩子，我比任何一位大人都了解这个世界。所以，我可以用我的知识，换取你路上的见闻吗？", source: "语音「初次见面」" },
    { text: "很多时候，我们直到经受切肤之痛，才不得不直视自身的懒惰、愚昧、鲁莽或傲慢。但大可不必为此懊悔，我们无法观测未来的所有可能性，只能靠这样略显笨拙的方式获取知识。学费而已，再正常不过啦。", source: "语音「有什么想要分享」" },
    { text: "神明只送给人类填饱肚子的知识，人类却借此制作了工具，书写了文字，壮大了城邦，现在又放眼星辰与深渊……他们每时每刻都在创造全新的「知识」，也令我再也无法移开双眼。", source: "语音「关于纳西妲自己·痴迷」" },
    { text: "我自认为我擅长提问和回答问题，但我渐渐明白，有很多人是揣着明白装糊涂，问题的答案并不能帮上他们的忙。是不是随着年龄增长，大家都会失去面对质问和答案的勇气呢……", source: "语音「纳西妲的烦恼」" },
  ];

  const wisdomQuote = document.getElementById("wisdom-quote");
  const wisdomAuthor = document.getElementById("wisdom-author");
  const wisdomDots = document.getElementById("wisdom-dots");
  let quoteIdx = 0;
  let quoteTimer = null;

  QUOTES.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "wisdom-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "第" + (i + 1) + "条");
    dot.addEventListener("click", () => { showQuote(i); resetTimer(); });
    wisdomDots.appendChild(dot);
  });

  function showQuote(idx) {
    quoteIdx = idx;
    wisdomQuote.style.opacity = "0";
    wisdomAuthor.style.opacity = "0";
    setTimeout(() => {
      wisdomQuote.textContent = '"' + QUOTES[idx].text + '"';
      wisdomAuthor.textContent = "—— 纳西妲 · " + QUOTES[idx].source;
      wisdomQuote.style.opacity = "1";
      wisdomAuthor.style.opacity = "1";
    }, 400);
    wisdomDots.querySelectorAll(".wisdom-dot").forEach((d, i) => d.classList.toggle("active", i === idx));
  }

  function nextQuote() { showQuote((quoteIdx + 1) % QUOTES.length); }

  function resetTimer() {
    if (quoteTimer) clearInterval(quoteTimer);
    quoteTimer = setInterval(nextQuote, 6000);
  }

  showQuote(0);
  resetTimer();

  /* ---------- 倒计时 ---------- */
  function pad(n, len) { return String(n).padStart(len, "0"); }

  function tick(el, val, len) {
    const f = pad(val, len);
    if (el.textContent !== f) {
      el.textContent = f;
      el.classList.remove("tick");
      void el.offsetWidth;
      el.classList.add("tick");
    }
  }

  function update() {
    const now = Date.now();
    const diff = TARGET - now;

    if (diff <= 0) {
      countdownEl.hidden = true;
      celebrateEl.hidden = false;
      ringFill.style.strokeDashoffset = "0";
      ringPct.textContent = "100%";
      return;
    }

    const ts = Math.floor(diff / 1000);
    const d = Math.floor(ts / 86400);
    const h = Math.floor((ts % 86400) / 3600);
    const m = Math.floor((ts % 3600) / 60);
    const s = ts % 60;

    tick(elDays, d, 3);
    tick(elHours, h, 2);
    tick(elMinutes, m, 2);
    tick(elSeconds, s, 2);

    const total = TARGET - START;
    const elapsed = now - START;
    const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
    ringFill.style.strokeDashoffset = RING_C * (1 - pct / 100);
    ringPct.textContent = pct.toFixed(1) + "%";
  }

  update();
  setInterval(update, 1000);

  /* ---------- 星空粒子 ---------- */
  const canvas = document.getElementById("star-canvas");
  const ctx = canvas.getContext("2d");
  let W, H, stars = [], shooters = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  class Star {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 1.6 + 0.4;
      this.baseA = Math.random() * 0.55 + 0.3;
      this.speed = Math.random() * 0.02 + 0.005;
      this.phase = Math.random() * Math.PI * 2;
      this.cyan = Math.random() > 0.75;
    }
    update() { this.phase += this.speed; }
    draw() {
      const tw = (Math.sin(this.phase) + 1) / 2;
      const a = this.baseA * (0.35 + tw * 0.65);
      const [r, g, b] = this.cyan ? [128, 222, 234] : [255, 249, 196];
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
      grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fill();
    }
  }

  class Shooter {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W * 0.6;
      this.y = Math.random() * H * 0.35;
      this.len = Math.random() * 70 + 50;
      this.spd = Math.random() * 5 + 7;
      this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.25;
      this.a = 1;
      this.alive = true;
    }
    update() {
      this.x += Math.cos(this.angle) * this.spd;
      this.y += Math.sin(this.angle) * this.spd;
      this.a -= 0.01;
      if (this.a <= 0 || this.x > W || this.y > H) this.alive = false;
    }
    draw() {
      const tx = this.x - Math.cos(this.angle) * this.len;
      const ty = this.y - Math.sin(this.angle) * this.len;
      const grad = ctx.createLinearGradient(this.x, this.y, tx, ty);
      grad.addColorStop(0, `rgba(255,249,196,${this.a})`);
      grad.addColorStop(0.4, `rgba(255,213,79,${this.a * 0.5})`);
      grad.addColorStop(1, "rgba(255,213,79,0)");
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  }

  const starCount = Math.min(140, Math.floor((W * H) / 9000));
  for (let i = 0; i < starCount; i++) stars.push(new Star());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => { s.update(); s.draw(); });
    if (Math.random() < 0.004 && shooters.length < 3) shooters.push(new Shooter());
    shooters = shooters.filter(s => s.alive);
    shooters.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();
