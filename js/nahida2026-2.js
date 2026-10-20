/* ===== 纳西妲生日祝福 · 星空版 ===== */
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
  const btnPrev = document.getElementById("quote-prev");
  const btnNext = document.getElementById("quote-next");
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
  function prevQuote() { showQuote((quoteIdx - 1 + QUOTES.length) % QUOTES.length); }

  function resetTimer() {
    if (quoteTimer) clearInterval(quoteTimer);
    quoteTimer = setInterval(nextQuote, 6000);
  }

  btnPrev.addEventListener("click", () => { prevQuote(); resetTimer(); });
  btnNext.addEventListener("click", () => { nextQuote(); resetTimer(); });

  showQuote(0);
  resetTimer();

  /* ---------- 星空粒子 ---------- */
  const canvas = document.getElementById("star-canvas");
  const ctx = canvas.getContext("2d");
  let stars = [], shooters = [], W, H;

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
      this.size = Math.random() * 1.8 + 0.4;
      this.baseA = Math.random() * 0.6 + 0.3;
      this.speed = Math.random() * 0.02 + 0.005;
      this.phase = Math.random() * Math.PI * 2;
      this.cyan = Math.random() > 0.75;
    }
    update() { this.phase += this.speed; }
    draw() {
      const tw = (Math.sin(this.phase) + 1) / 2;
      const a = this.baseA * (0.4 + tw * 0.6);
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

  /* ---------- 滚动渐显 ---------- */
  const revealElements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
  );
  revealElements.forEach(el => observer.observe(el));

  /* ---------- 星空许愿 ---------- */
  const wishStarsContainer = document.getElementById("wish-stars");
  const wishDisplay = document.getElementById("wish-display");
  const starSymbols = ["✦", "✧", "★", "☆", "✩", "✪", "✫", "✬", "✭", "✮", "✯", "✰"];
  const wishes = [
    "愿智慧如星辰，永远照亮你前行的路。",
    "愿你的梦境，永远有最温柔的风。",
    "愿每一个问题，都能找到属于它的答案。",
    "愿须弥的风，带去我们最真挚的祝福。",
    "愿你不再孤单，因为我们都在你身边。",
    "愿知识的海洋，永远为你敞开。",
    "愿你的笑容，如星空般璀璨永恒。",
    "愿五百年来的等待，都化作今日的欢喜。",
    "愿草元素的力量，永远守护你。",
    "愿所有的美好，都如约而至。",
    "愿你的生日，充满爱与温暖。",
    "纳西妲，生日快乐，我们永远爱你。",
  ];
  let wishIdx = 0;

  for (let i = 0; i < 12; i++) {
    const star = document.createElement("span");
    star.className = "wish-star";
    star.textContent = starSymbols[Math.floor(Math.random() * starSymbols.length)];
    star.style.animationDelay = (Math.random() * 2) + "s";
    star.style.fontSize = (Math.random() * 0.8 + 1.4) + "rem";
    wishStarsContainer.appendChild(star);
  }

  wishStarsContainer.addEventListener("click", e => {
    if (!e.target.classList.contains("wish-star")) return;
    const star = e.target;
    star.style.transition = "all 0.5s ease";
    star.style.transform = "scale(2) rotate(360deg)";
    star.style.opacity = "0";
    wishDisplay.innerHTML = `<p class="wish-result">${wishes[wishIdx % wishes.length]}</p>`;
    wishIdx++;
    createStarBurst(star);
    setTimeout(() => {
      star.style.transition = "all 0.4s ease";
      star.style.transform = "";
      star.style.opacity = "";
    }, 2000);
  });

  function createStarBurst(sourceEl) {
    const rect = sourceEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < 12; i++) {
      const p = document.createElement("div");
      p.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:4px;height:4px;border-radius:50%;background:radial-gradient(circle,#ffd54f,transparent);pointer-events:none;z-index:9999;`;
      document.body.appendChild(p);
      const angle = (Math.PI * 2 * i) / 12;
      const dist = 50 + Math.random() * 50;
      p.animate(
        [
          { transform: "translate(0,0) scale(1)", opacity: 1 },
          { transform: `translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(0)`, opacity: 0 },
        ],
        { duration: 700 + Math.random() * 300, easing: "cubic-bezier(0.25,0.46,0.45,0.94)" }
      ).onfinish = () => p.remove();
    }
  }

  document.addEventListener("click", e => {
    if (e.target.closest(".wish-star") || e.target.closest(".quote-btn") || e.target.closest(".quote-dot")) return;
    const dust = document.createElement("div");
    dust.style.cssText = `position:fixed;left:${e.clientX-3}px;top:${e.clientY-3}px;width:6px;height:6px;border-radius:50%;background:radial-gradient(circle,rgba(255,213,79,0.8),transparent);pointer-events:none;z-index:9998;`;
    document.body.appendChild(dust);
    dust.animate(
      [{ transform: "scale(1)", opacity: 1 }, { transform: "scale(4)", opacity: 0 }],
      { duration: 600, easing: "ease-out" }
    ).onfinish = () => dust.remove();
  });
})();
