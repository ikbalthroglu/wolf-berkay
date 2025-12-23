// ---------- Intro ----------
const intro = document.getElementById("intro");
const enterBtn = document.getElementById("enterBtn");

enterBtn.addEventListener("click", () => {
  intro.classList.add("out");
  intro.style.transition = "opacity .6s ease, transform .6s ease";
  intro.style.opacity = "0";
  intro.style.transform = "scale(1.02)";
  setTimeout(() => intro.remove(), 650);
});

// ---------- Love mode overlay ----------
const loveOverlay = document.getElementById("loveOverlay");
const closeLove = document.getElementById("closeLove");
const loveTitle = document.getElementById("loveTitle");
const modeBtn = document.getElementById("modeBtn");
const hearts = document.getElementById("hearts");

let loveOpen = false;

function openLove(titleText = "Sevgilisi"){
  loveOpen = true;
  document.body.classList.add("is-love");
  modeBtn.textContent = "LOVE MODE";
  loveTitle.textContent = titleText;

  loveOverlay.classList.add("show");
  loveOverlay.setAttribute("aria-hidden", "false");

  burstHearts(26);
}

function closeLoveMode(){
  loveOpen = false;
  document.body.classList.remove("is-love");
  modeBtn.textContent = "WOLF MODE";

  loveOverlay.classList.remove("show");
  loveOverlay.setAttribute("aria-hidden", "true");
}

closeLove.addEventListener("click", closeLoveMode);

modeBtn.addEventListener("click", () => {
  if (loveOpen) closeLoveMode();
  else openLove("Sevgilisi");
});

// tek kart var: data-love="all"
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", () => {
    openLove("Sevgilisi");
  });
});

// ---------- Hearts animation ----------
function burstHearts(count){
  const rect = loveOverlay.getBoundingClientRect();
  for(let i=0;i<count;i++){
    const h = document.createElement("div");
    h.className = "heart";
    const x = (rect.width * (0.2 + Math.random()*0.6));
    const y = rect.height * (0.68 + Math.random()*0.25);
    h.style.left = `${x}px`;
    h.style.top = `${y}px`;
    h.style.animationDelay = `${Math.random()*0.25}s`;
    h.style.filter = `blur(${Math.random()*0.6}px)`;
    hearts.appendChild(h);
    setTimeout(() => h.remove(), 1800);
  }
}

// ---------- Ambient particles canvas ----------
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");
let W, H, DPR;
let pts = [];

function resize(){
  DPR = Math.min(2, window.devicePixelRatio || 1);
  W = canvas.width = Math.floor(window.innerWidth * DPR);
  H = canvas.height = Math.floor(window.innerHeight * DPR);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  pts = Array.from({length: 110}, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: (Math.random()*1.6 + 0.3) * DPR,
    vx: (Math.random()*0.5 + 0.15) * DPR,
    vy: (Math.random()*0.25 + 0.08) * DPR,
    a: Math.random()*0.6 + 0.15
  }));
}
window.addEventListener("resize", resize);
resize();

function tick(){
  ctx.clearRect(0,0,W,H);

  const love = document.body.classList.contains("is-love");

  for(const p of pts){
    p.x += p.vx * (love ? 0.55 : 1);
    p.y += p.vy * (love ? 0.55 : 1);

    if(p.x > W) p.x = -20;
    if(p.y > H) p.y = -20;

    ctx.globalAlpha = p.a * (love ? 0.55 : 1);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = love ? "rgba(255,79,163,0.9)" : "rgba(124,124,255,0.9)";
    ctx.fill();
  }

  requestAnimationFrame(tick);
}
tick();
// ---------- LOVE MODE: Heart Rain (continuous while open) ----------
const heartRain = document.getElementById("heartRain");

let rainTimer = null;
let bloomTimer = null;

function startHeartRain(){
  stopHeartRain();

  // yoğunluk: mobilde biraz azalt
  const isMobile = window.matchMedia("(max-width: 600px)").matches;
  const interval = isMobile ? 180 : 120;

  rainTimer = setInterval(() => spawnRainHeart(), interval);
  bloomTimer = setInterval(() => spawnBloom(), isMobile ? 900 : 700);
}

function stopHeartRain(){
  if (rainTimer) clearInterval(rainTimer);
  if (bloomTimer) clearInterval(bloomTimer);
  rainTimer = null;
  bloomTimer = null;

  // DOM temizliği (performans)
  if (heartRain) heartRain.innerHTML = "";
}

// bir adet kalp üret
function spawnRainHeart(){
  if (!heartRain) return;

  const h = document.createElement("div");
  h.className = "rain-heart";

  const x = 6 + Math.random() * 88;          // % olarak
  const scale = 0.65 + Math.random() * 1.25; // boy
  const dur = 2.2 + Math.random() * 2.1;     // süre
  const blur = Math.random() < 0.35 ? (0.6 + Math.random() * 1.8) : 0;

  h.style.left = `${x}%`;
  h.style.setProperty("--sc", scale);
  h.style.setProperty("--dur", `${dur}s`);
  h.style.setProperty("--hb", `${blur}px`);

  heartRain.appendChild(h);
  setTimeout(() => h.remove(), (dur * 1000) + 200);
}

// yumuşak büyük kalp “bloom”
function spawnBloom(){
  if (!heartRain) return;

  const b = document.createElement("div");
  b.className = "love-bloom";

  const x = 20 + Math.random() * 60;
  const y = 35 + Math.random() * 40;

  b.style.setProperty("--x", `${x}%`);
  b.style.setProperty("--y", `${y}%`);

  heartRain.appendChild(b);
  setTimeout(() => b.remove(), 3800);
}

// LOVE MODE açılınca başlat / kapanınca durdur
const _openLove = openLove;
openLove = function(titleText = "Sevgilisi"){
  _openLove(titleText);
  startHeartRain();
};

const _closeLoveMode = closeLoveMode;
closeLoveMode = function(){
  _closeLoveMode();
  stopHeartRain();
};
