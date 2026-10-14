/* ===== 돌탑 SVG 데이터 (아래 → 위 순서 = 쌓이는 순서) ===== */
const STONES = [
  { t:'d', d:'M120 684 L190 650 C230 636 290 636 330 644 C390 650 430 668 456 690 C400 696 300 700 220 700 C170 700 140 694 120 684 Z',
    l:['M200 668 C240 658 290 658 330 666'] },
  { t:'d', d:'M196 506 L252 494 C300 492 340 500 372 530 L384 565 C384 600 378 625 366 644 C330 650 280 650 240 646 L170 640 C150 625 152 580 160 548 Z',
    l:['M205 524 C232 540 248 566 250 606','M300 508 C318 536 328 570 324 612','M178 600 C200 590 226 596 244 612'] },
  { t:'d', d:'M304 430 C310 405 345 388 372 392 C402 398 410 430 400 460 C392 485 372 508 350 518 C334 524 318 508 312 492 C306 470 302 448 304 430Z',
    l:['M330 418 C350 412 372 420 384 436'] },
  { t:'l', d:'M180 494 C185 480 205 474 230 476 C250 476 260 482 256 492 C240 500 200 502 180 494Z' },
  { t:'l', d:'M214 466 C214 456 226 452 238 454 C250 456 252 468 244 474 C232 478 216 476 214 466Z' },
  { t:'l', d:'M166 422 C166 400 198 388 230 390 C256 394 264 414 258 434 C246 454 210 458 190 450 C172 444 166 434 166 422Z',
    l:['M190 410 C204 402 220 402 232 408'] },
  { t:'l', d:'M206 386 C210 378 230 374 244 378 C252 384 246 392 232 392 C216 392 206 392 206 386Z' },
  { t:'d', d:'M128 340 C130 326 160 316 200 312 L330 300 C390 304 430 316 442 332 C444 346 430 358 400 362 C340 372 250 378 190 372 C150 368 126 356 128 340Z',
    l:['M170 336 C230 326 300 322 380 332','M340 306 L352 334'] },
  { t:'l', d:'M134 300 C134 290 146 284 160 286 C172 290 178 300 172 310 C160 316 138 316 134 300Z' },
  { t:'d', d:'M48 204 C70 180 120 160 170 150 C220 148 248 166 244 196 C240 234 210 262 176 278 C160 286 148 284 146 270 C142 240 120 222 94 218 C68 218 52 214 48 204Z',
    l:['M110 196 C150 186 190 186 226 196','M170 214 C186 232 188 252 176 268'] },
  { t:'l', d:'M172 118 C172 94 190 80 202 80 C218 80 232 98 230 120 C228 140 214 150 200 150 C184 148 172 136 172 118Z',
    l:['M186 100 C196 94 210 96 216 104'] }
];

function towerSVG({ view = '0 0 540 720', slice = false, drop = false } = {}) {
  const body = STONES.map((s, i) => {
    const g = s.t === 'd' ? 'gD' : 'gL', f = s.t === 'd' ? 'fD' : 'fL';
    const cracks = (s.l || []).map(p => `<path class="crack" d="${p}"/>`).join('');
    return `<g class="stone" style="--i:${i}"><path d="${s.d}" fill="url(#${g})" filter="url(#${f})" stroke="rgba(25,22,20,.6)" stroke-width="1.1" stroke-linejoin="round"/>${cracks}</g>`;
  }).join('');
  return `<svg class="tower${drop ? ' tower--drop' : ''}" viewBox="${view}" preserveAspectRatio="xMidYMid ${slice ? 'slice' : 'meet'}" role="img" aria-label="돌탑 일러스트"><ellipse cx="290" cy="700" rx="190" ry="9" fill="url(#gShadow)"/>${body}</svg>`;
}

document.querySelectorAll('[data-tower]').forEach(el => {
  el.innerHTML = towerSVG({
    view: el.dataset.view || '0 0 540 720',
    slice: 'slice' in el.dataset,
    drop: 'drop' in el.dataset
  });
});

/* ===== 로딩 ===== */
const body = document.body;
const countEl = document.getElementById('loaderCount');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DURATION = reduce ? 300 : 2800;
const t0 = performance.now();

(function tick(now) {
  const p = Math.min((now - t0) / DURATION, 1);
  countEl.textContent = Math.round(p * 100);
  if (p < 1) return requestAnimationFrame(tick);
  setTimeout(() => {
    body.classList.add('is-loaded');
    startLines();
    body.classList.remove('is-loading');
    setTimeout(() => body.classList.add('is-done'), 1300);
  }, 350);
})(t0);

/* ===== 스크롤: 로고 등장 / 돌탑 패럴랙스 / 메뉴 강조 ===== */
const heroTower = document.getElementById('heroTower');
let ticking = false;

function onScroll() {
  const y = scrollY;
  body.classList.toggle('scrolled', y > 80);
  if (!reduce && y < innerHeight * 1.2) heroTower.style.setProperty('--py', `${y * 0.18}px`);
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

const links = [...document.querySelectorAll('[data-link]')];
const secObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.dataset.link === e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('[data-section]').forEach(s => secObs.observe(s));

/* ===== 등장 애니메이션 ===== */
const revObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ===== 모바일 메뉴 ===== */
const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
const setMenu = open => { nav.classList.toggle('open', open); toggle.setAttribute('aria-expanded', open); };
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', e => { if (e.target.tagName === 'A') setMenu(false); });

/* ===== 이메일 보내기 (메일 앱 열기) ===== */
const form = document.getElementById('mailForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', e => {
  e.preventDefault();
  const { name, email, msg } = form.elements;
  if (!name.value.trim() || !email.validity.valid || !msg.value.trim()) {
    note.textContent = '이름, 올바른 이메일, 내용을 모두 입력해주세요.';
    return;
  }
  note.textContent = '';
  const subject = encodeURIComponent(`[포트폴리오] ${name.value.trim()}님의 문의`);
  const text = encodeURIComponent(`${msg.value.trim()}\n\n- ${name.value.trim()} (${email.value.trim()})`);
  location.href = `mailto:youkh0503@gmail.com?subject=${subject}&body=${text}`;
});

/* ===== 메인 선 모션: 그려지듯 등장 → 살랑살랑 흔들림 + 스크롤 시 어긋남 ===== */
const heroLines = [...document.querySelectorAll('.hero__lines line')].map((el, i) => ({
  el, i,
  x1: +el.getAttribute('x1'), y1: +el.getAttribute('y1'),
  x2: +el.getAttribute('x2'), y2: +el.getAttribute('y2')
}));
let linesStart = null;

function paintLines(now) {
  const t = linesStart === null ? 0 : now - linesStart;
  const sy = Math.min(scrollY, innerHeight * 1.2);
  heroLines.forEach(l => {
    const p = linesStart === null ? 0 : Math.min(Math.max((t - l.i * 220) / 1200, 0), 1);
    const e = 1 - Math.pow(1 - p, 3);
    const sway = reduce ? 0 : Math.min(Math.max((t - l.i * 220 - 1200) / 1500, 0), 1);
    const ph = now / 1700 + l.i * 1.7;
    const dx = sway * Math.sin(ph) * 14;
    const dy = sway * Math.cos(ph * .8) * 12 + sy * (l.i % 2 ? -.35 : .35);
    l.el.setAttribute('x1', l.x1 + dx);
    l.el.setAttribute('y1', l.y1 + dy);
    l.el.setAttribute('x2', l.x1 + (l.x2 - l.x1) * e + dx);
    l.el.setAttribute('y2', l.y1 + (l.y2 - l.y1) * e + dy);
  });
  if (!reduce) requestAnimationFrame(paintLines);
}
function startLines() { linesStart = performance.now() + 250; }
if (reduce) linesStart = -1e6;
paintLines(performance.now());
