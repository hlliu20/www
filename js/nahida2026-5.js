/* ===== 纳西妲生日祝福 · 梦境童话版 ===== */
(function () {
  "use strict";

  /* ---------- 音乐播放 ---------- */
  const music = document.getElementById("bg-music");
  const musicToggle = document.getElementById("music-toggle");
  let musicPlaying = false;

  function setPlayingUI(playing) {
    musicPlaying = playing;
    musicToggle.classList.toggle("playing", playing);
    musicToggle.classList.toggle("paused", !playing);
  }

  function tryAutoPlay() {
    music.play().then(() => setPlayingUI(true)).catch(() => {
      setPlayingUI(false);
      const onFirstInteract = () => {
        music.play().then(() => setPlayingUI(true)).catch(() => {});
        document.removeEventListener("click", onFirstInteract);
        document.removeEventListener("touchstart", onFirstInteract);
      };
      document.addEventListener("click", onFirstInteract, { once: true });
      document.addEventListener("touchstart", onFirstInteract, { once: true });
    });
  }

  musicToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (musicPlaying) { music.pause(); setPlayingUI(false); }
    else { music.play().then(() => setPlayingUI(true)).catch(() => {}); }
  });

  tryAutoPlay();

  /* ---------- 真实台词 ---------- */
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
  let quoteIdx = 0, quoteTimer = null;

  QUOTES.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "quote-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "第" + (i + 1) + "条");
    dot.addEventListener("click", () => { showQuote(i); resetTimer(); });
    quoteDots.appendChild(dot);
  });

  function showQuote(idx) {
    quoteIdx = idx;
    quoteText.style.opacity = "0"; quoteAuthor.style.opacity = "0";
    setTimeout(() => {
      quoteText.textContent = '"' + QUOTES[idx].text + '"';
      quoteAuthor.textContent = "—— 纳西妲 · " + QUOTES[idx].source;
      quoteText.style.opacity = "1"; quoteAuthor.style.opacity = "1";
    }, 400);
    quoteDots.querySelectorAll(".quote-dot").forEach((d, i) => d.classList.toggle("active", i === idx));
  }
  function nextQuote() { showQuote((quoteIdx + 1) % QUOTES.length); }
  function resetTimer() { if (quoteTimer) clearInterval(quoteTimer); quoteTimer = setInterval(nextQuote, 6000); }
  showQuote(0); resetTimer();

  /* ---------- 梦幻气泡 ---------- */
  const canvas = document.getElementById("dream-canvas");
  const ctx = canvas.getContext("2d");
  let W, H, bubbles = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize(); window.addEventListener("resize", resize);

  const bubbleColors = [
    "255,143,171", "192,132,252", "125,211,252",
    "253,224,71", "134,239,172", "255,255,255",
  ];

  class Bubble {
    constructor() { this.reset(); this.y = Math.random() * H; }
    reset() {
      this.x = Math.random() * W;
      this.y = H + 20;
      this.size = Math.random() * 20 + 6;
      this.speedY = Math.random() * 0.8 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.sway = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
      this.opacity = Math.random() * 0.4 + 0.2;
      this.color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
    }
    update() {
      this.sway += this.swaySpeed;
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.sway) * 0.5;
      if (this.y < -30) this.reset();
    }
    draw() {
      const grad = ctx.createRadialGradient(
        this.x - this.size * 0.3, this.y - this.size * 0.3, 0,
        this.x, this.y, this.size
      );
      grad.addColorStop(0, `rgba(255,255,255,${this.opacity + 0.2})`);
      grad.addColorStop(0.5, `rgba(${this.color},${this.opacity})`);
      grad.addColorStop(1, `rgba(${this.color},${this.opacity * 0.3})`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      // 高光
      ctx.beginPath();
      ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${this.opacity + 0.3})`;
      ctx.fill();
    }
  }

  const bubbleCount = Math.min(40, Math.floor(W / 30));
  for (let i = 0; i < bubbleCount; i++) bubbles.push(new Bubble());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    bubbles.forEach(b => { b.update(); b.draw(); });
    requestAnimationFrame(animate);
  }
  animate();

  /* ---------- 蛋糕交互 ---------- */
  const dflame = document.getElementById("dflame");
  const dreamCake = document.getElementById("dream-cake");
  const cakeMsg = document.getElementById("cake-msg");
  let candleOut = false;
  const wishes = [
    "愿望会在梦里实现的 💫", "纳西妲，生日快乐！🎂",
    "梦里什么都有哦 🌈", "甜甜的梦送给你 🍬",
    "愿你永远开开心心 💖", "美梦成真 ✨",
  ];

  dreamCake.addEventListener("click", () => {
    if (!candleOut) {
      candleOut = true;
      dflame.classList.add("out");
      cakeMsg.style.opacity = "0";
      setTimeout(() => {
        cakeMsg.textContent = wishes[Math.floor(Math.random() * wishes.length)];
        cakeMsg.style.opacity = "1";
      }, 400);
      // 彩色粒子爆发
      const rect = dreamCake.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 3;
      for (let i = 0; i < 20; i++) {
        const p = document.createElement("div");
        const colors = ["#ff8fab", "#c084fc", "#7dd3fc", "#fde047", "#86efac"];
        p.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:8px;height:8px;border-radius:50%;background:${colors[i % colors.length]};pointer-events:none;z-index:9999;`;
        document.body.appendChild(p);
        const angle = (Math.PI * 2 * i) / 20;
        const dist = 60 + Math.random() * 70;
        p.animate(
          [
            { transform: "translate(0,0) scale(1)", opacity: 1 },
            { transform: `translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(0)`, opacity: 0 },
          ],
          { duration: 900 + Math.random() * 400, easing: "cubic-bezier(0.25,0.46,0.45,0.94)" }
        ).onfinish = () => p.remove();
      }
    } else {
      candleOut = false;
      dflame.classList.remove("out");
      cakeMsg.style.opacity = "0";
      setTimeout(() => {
        cakeMsg.textContent = "又一个愿望，继续闪亮 ✨";
        cakeMsg.style.opacity = "1";
      }, 400);
    }
  });

  /* ---------- 滚动渐显 ---------- */
  const reveals = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
  }, { threshold: 0.15 });
  reveals.forEach(el => obs.observe(el));
})();
