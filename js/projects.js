/* ===== 프로젝트 모달 : 카드 썸네일에서 자연스럽게 커지며 열림 ===== */
const PROJECTS = [
  {
    title: '말모이',
    img: 'assets/p-malmoi.webp',
    meta: '8인 프로젝트 · 프로그래밍 담당 · 2026.09 ~ 현재 진행',
    lead: '잊고 있던 감정 단어를 찾는 인터랙티브 체험형 리듬게임',
    desc: '"우리는 얼마나 많은 말을 잃었을까"라는 질문에서 출발한 프로젝트입니다. 익숙한 감정 단어에서 시작해 더 섬세한 우리말 감정 단어를 발견하고, 선택이 쌓일수록 숲이 완성되는 과정을 체험합니다.',
    list: [
      ['게임 흐름', '상황 → 감정 선택 → 리듬 플레이 → 결과 → 데이터가 나무로 이동'],
      ['손 인식 입력', '웹캠 기반 MediaPipe Hands로 손 위치를 인식해, 손을 레인 버튼에 올려 감정 단어를 받는 방식'],
      ['시청각 연출', '단어를 맞힐 때마다 나무가 5단계로 성장하고, 감정별 BGM·비트맵과 효과음 연동'],
      ['전시 환경 대응', '어두운 전시장을 고려해 Windows Hello 적외선(IR) 카메라 입력 지원']
    ],
    stack: 'Unity · C#'
  },
  {
    title: 'DIV',
    img: 'assets/p-div.webp',
    meta: '3인 프로젝트 · 웹 디자인 · 프로그래밍 담당 · 2026.03 ~ 2026.06',
    lead: '기부 이후 경험을 연결하는 기부 서비스 소개 웹사이트',
    desc: '기부자 감소라는 문제에서 출발해, 한눈에 보이는 투명한 기부 경험을 제안하는 앱을 소개합니다.',
    list: [
      ['스크롤 스토리텔링', 'GSAP ScrollTrigger로 기부자 감소 시각화와 섹션 전환 구현'],
      ['앱 체험 섹션', '홈 → 탐색 → 상세 → 결제 → 비밀번호까지 기부 흐름을 목업으로 시뮬레이션'],
      ['세액공제·핵심 기능', '폰 목업 애니메이션, 부채꼴 카드 스크롤 연출']
    ],
    stack: 'HTML · CSS · JavaScript · Illustrator',
    link: 'https://leeyoujoungg.github.io/Reboot-GIV.github.io/'
  },
  {
    title: 'Is Life',
    img: 'assets/p-islife.webp',
    meta: '1인 프로젝트 · 2026.05 ~ 2026.06',
    lead: '경제적 불안정 삶을 체험하는 시리어스 게임',
    desc: '출근 → 업무 → 퇴근 → 식사 → 수면을 2일간 반복하며 한 달을 압축해 보여주고, 마지막에 급여명세서로 지출이 월급과 같아지는 결말을 마주하게 됩니다.',
    list: [
      ['2일 사이클 구조', '두 번의 하루 후 "한 달이 지났습니다"로 넘어가는 시간 압축 연출'],
      ['인터랙션', '스프라이트 애니메이션, 핫스팟 이동, 타이핑 미니게임(키보드 입력)'],
      ['시청각 연출', '페이드 전환, 암전 + 캡션, Web Audio API로 직접 합성한 효과음'],
      ['엔딩', '영수증 연출로 잔액 0원, "파산하였습니다" 표시']
    ],
    stack: 'HTML · CSS · JavaScript · Illustrator',
    link: 'https://leeyoujoungg.github.io/IsLife/'
  },
  {
    title: '도자기',
    img: 'assets/p-dojagi.webp',
    meta: '1인 프로젝트 · 2026.05 ~ 2026.06',
    lead: '한국 전통 도자기를 소개하는 React 기반 웹사이트',
    desc: '백자·청자·분청사기 등 도자기의 역사, 종류, 제작, 관리 방법을 페이지별로 풀어낸 가이드 사이트입니다. 따뜻한 크림/베이지 톤과 큰 한자 타이포(陶瓷器) 위주로 디자인했습니다.',
    list: [
      ['페이지 구성', 'Main, History, Type, Explore, Making, Care (useState 기반 페이지 전환)'],
      ['인터랙션', '시대별 풀스크린 스크롤, 카드 클릭 시 모달 + 이미지 슬라이드, 탭 전환'],
      ['디자인 → 개발', 'Figma/Illustrator로 비주얼 설계 후 React로 구현']
    ],
    stack: 'HTML · CSS · JavaScript · Illustrator · Figma',
    link: 'https://leeyoujoungg.github.io/yujung.github.io/'
  }];

(() => {
  const modal = document.getElementById('pmodal');
  const panel = modal.querySelector('.pmodal__panel');
  const $ = id => document.getElementById(id);
  const reduceM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DUR = reduceM ? 1 : 520, EASE = 'cubic-bezier(.2,.7,.2,1)';
  let origin = null, lastCard = null, busy = false;

  const fill = p => {
    $('pmThumb').style.backgroundImage = `url(${p.img})`;
    $('pmTitle').textContent = p.title;
    $('pmMeta').textContent = p.meta;
    $('pmLead').textContent = p.lead;
    $('pmDesc').textContent = p.desc;
    $('pmDesc').hidden = !p.desc;
    const st = $('pmStack');
    st.innerHTML = '';
    st.hidden = !p.stack;
    if (p.stack) {
      const lb = document.createElement('span'); lb.className = 'pmodal__stack-label'; lb.textContent = 'STACK';
      st.append(lb);
      p.stack.split('·').forEach(t => {
        const c = document.createElement('span'); c.className = 'chip'; c.textContent = t.trim(); st.append(c);
      });
    }
    const ul = $('pmList'); ul.innerHTML = '';
    p.list.forEach(([k, v]) => {
      const li = document.createElement('li');
      const b = document.createElement('strong'); b.textContent = k;
      const s = document.createElement('span'); s.textContent = v;
      li.append(b, s); ul.append(li);
    });
    ul.hidden = !p.list.length;
    const a = $('pmLink');
    a.hidden = !p.link;
    if (p.link) a.href = p.link;
  };

  const delta = (from, to) => ({
    x: from.left - to.left, y: from.top - to.top,
    sx: from.width / to.width, sy: from.height / to.height
  });

  function open(card) {
    if (busy) return;
    const p = PROJECTS[+card.dataset.project];
    if (!p) return;
    busy = true; lastCard = card;
    fill(p);
    origin = card.querySelector('.pcard__thumb').getBoundingClientRect();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    const to = panel.getBoundingClientRect();
    const d = delta(origin, to);
    modal.querySelector('.pmodal__backdrop').animate([{ opacity: 0 }, { opacity: 1 }], { duration: DUR, easing: 'ease', fill: 'both' });
    panel.animate([
      { transformOrigin: '0 0', transform: `translate(${d.x}px,${d.y}px) scale(${d.sx},${d.sy})`, opacity: .6 },
      { transformOrigin: '0 0', transform: 'none', opacity: 1 }
    ], { duration: DUR, easing: EASE }).onfinish = () => { busy = false; panel.querySelector('.pmodal__close').focus({ preventScroll: true }); };
    panel.querySelector('.pmodal__body').animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: DUR, delay: DUR * .35, easing: 'ease', fill: 'backwards' });
  }

  function close() {
    if (busy || !modal.classList.contains('is-open')) return;
    busy = true;
    const live = lastCard.querySelector('.pcard__thumb').getBoundingClientRect();
    const to = panel.getBoundingClientRect();
    const d = delta(live, to);
    modal.querySelector('.pmodal__backdrop').animate([{ opacity: 1 }, { opacity: 0 }], { duration: DUR * .8, easing: 'ease', fill: 'forwards' });
    panel.animate([
      { transformOrigin: '0 0', transform: 'none', opacity: 1 },
      { transformOrigin: '0 0', transform: `translate(${d.x}px,${d.y}px) scale(${d.sx},${d.sy})`, opacity: .4 }
    ], { duration: DUR * .8, easing: EASE, fill: 'forwards' }).onfinish = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      modal.getAnimations({ subtree: true }).forEach(a => a.cancel());
      busy = false;
      lastCard.focus({ preventScroll: true });
    };
  }

  document.querySelectorAll('[data-project]').forEach(c => {
    const pj = PROJECTS[+c.dataset.project];
    if (pj && pj.img) c.querySelector('.pcard__thumb').style.backgroundImage = `url(${pj.img})`;
    c.addEventListener('click', () => open(c));
    c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(c); } });
  });
  modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();