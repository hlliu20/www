/* ===== 纳西妲生日倒计时 · 森林版 ===== */
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

  const elDays = document.getElementById("days");
  const elHours = document.getElementById("hours");
  const elMinutes = document.getElementById("minutes");
  const elSeconds = document.getElementById("seconds");
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");
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

  const quoteText = document.getElementById("quote-text");
  const quoteAuthor = document.getElementById("quote-author");
  const quoteDots = document.getElementById("quote-dots");
  let quoteIdx = 0;
  let quoteTimer = null;

  QUOTES.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "quote-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "第" + (i + 1) + "条");
    dot.addEventListener("click", () => { showQuote(i); resetTimer(); });
    quoteDots.appendChild(dot);
  });

  function showQuote(idx) {
    quoteIdx = idx;
    quoteText.style.opacity = "0";
    quoteAuthor.style.opacity = "0";
    setTimeout(() => {
      quoteText.textContent = '"' + QUOTES[idx].text + '"';
      quoteAuthor.textContent = "—— 纳西妲 · " + QUOTES[idx].source;
      quoteText.style.opacity = "1";
      quoteAuthor.style.opacity = "1";
    }, 400);
    quoteDots.querySelectorAll(".quote-dot").forEach((d, i) => d.classList.toggle("active", i === idx));
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

  function updateDigit(el, value, len) {
    const formatted = pad(value, len);
    if (el.textContent !== formatted) {
      el.textContent = formatted;
      el.classList.remove("flip");
      void el.offsetWidth;
      el.classList.add("flip");
    }
  }

  function update() {
    const now = Date.now();
    const diff = TARGET - now;

    if (diff <= 0) {
      countdownEl.hidden = true;
      celebrateEl.hidden = false;
      progressFill.style.width = "100%";
      progressText.textContent = "今天就是纳西妲的生日！";
      return;
    }

    const ts = Math.floor(diff / 1000);
    const d = Math.floor(ts / 86400);
    const h = Math.floor((ts % 86400) / 3600);
    const m = Math.floor((ts % 3600) / 60);
    const s = ts % 60;

    updateDigit(elDays, d, 3);
    updateDigit(elHours, h, 2);
    updateDigit(elMinutes, m, 2);
    updateDigit(elSeconds, s, 2);

    const total = TARGET - START;
    const elapsed = now - START;
    const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
    progressFill.style.width = pct.toFixed(2) + "%";
    progressText.textContent = `距离生日还有 ${d} 天 ${pad(h,2)} 时 ${pad(m,2)} 分`;
  }

  update();
  setInterval(update, 1000);

  /* ---------- 萤火虫 ---------- */
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  let W, H, fireflies = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  class Firefly {
    constructor() { this.reset(); this.y = Math.random() * H; }
    reset() {
      this.x = Math.random() * W;
      this.y = -10;
      this.size = Math.random() * 2.5 + 1;
      this.speedY = Math.random() * 0.35 + 0.1;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.phase = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.025 + 0.008;
      this.gold = Math.random() > 0.7;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.012) * 0.25;
      this.phase += this.pulseSpeed;
      if (this.y > H + 15 || this.x < -15 || this.x > W + 15) this.reset();
    }
    draw() {
      const pulse = (Math.sin(this.phase) + 1) / 2;
      const a = this.opacity * (0.35 + pulse * 0.65);
      const color = this.gold ? "255,213,79" : "174,213,129";
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4);
      g.addColorStop(0, `rgba(${color},${a})`);
      g.addColorStop(1, `rgba(${color},0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }
  }

  const count = Math.min(50, Math.floor(W / 25));
  for (let i = 0; i < count; i++) fireflies.push(new Firefly());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    fireflies.forEach(f => { f.update(); f.draw(); });
    requestAnimationFrame(animate);
  }
  animate();

  /* ---------- 飘落叶子 ---------- */
  const leafContainer = document.getElementById("leaves");
  const leafEmojis = ["🍃", "🌿", "🍀", "☘️"];
  for (let i = 0; i < 10; i++) {
    const leaf = document.createElement("span");
    leaf.className = "leaf";
    leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
    leaf.style.left = Math.random() * 100 + "%";
    leaf.style.animationDuration = (Math.random() * 8 + 10) + "s";
    leaf.style.animationDelay = (Math.random() * 10) + "s";
    leaf.style.fontSize = (Math.random() * 10 + 13) + "px";
    leafContainer.appendChild(leaf);
  }
})();
