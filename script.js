// ===================================================
// 김예진 포트폴리오 — script.js
// ===================================================

// ===== Navbar scroll effect =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== Mobile nav toggle =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  navToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  // Animate hamburger → X
  const spans = navToggle.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ===== Scroll fade-in (IntersectionObserver) =====
const fadeSections = document.querySelectorAll('.fade-section');

const observerOptions = {
  root: null,
  rootMargin: '0px 0px -80px 0px',
  threshold: 0.1,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      sectionObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeSections.forEach(section => {
  sectionObserver.observe(section);
});

// ===== Staggered project card animation =====
const projectCards = document.querySelectorAll('.project-card');

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.project-card');
      cards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.1}s`;
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease, border-color 0.3s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 100 + 100);
      });
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

const projectsGrid = document.querySelector('.projects-grid');
if (projectsGrid) {
  cardObserver.observe(projectsGrid);
}

// ===== Active nav link highlight on scroll =====
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => navObserver.observe(section));

// Add active nav link style dynamically
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--blue) !important; }`;
document.head.appendChild(style);

// ===== Smooth scroll for hero CTA "프로젝트 보기" =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== Project Modal =====
// 웹 포트폴리오용 압축 버전 — 숫자·성과·핵심 구현만. 상세 내용은 GitHub 참고.
const PROJECT_DATA = {
  tabletopia: {
    icon: '🍴',
    name: '테이블토피아',
    period: '2025.09 ~ 2025.10',
    team: '5인 팀',
    github: 'https://github.com/zero5ive/Tabletopia',
    summary: 'Redis·WebSocket 기반 실시간 좌석 선점 시스템 설계 및 Docker + NCP 배포 담당',
    achievements: [
      { color: 'green', text: '에러율 15.83% → 0%' },
      { color: 'blue',  text: '응답속도 65ms → 51ms (22% 단축)' },
      { color: 'gray',  text: 'Docker + NCP 전체 배포' },
    ],
    stack: [
      { category: 'Backend',    tags: ['Java', 'Spring Boot 3.x', 'Spring Security', 'JWT', 'JPA'] },
      { category: 'DB & 실시간', tags: ['MySQL', 'Redis', 'WebSocket (STOMP)'] },
      { category: 'Infra',      tags: ['Docker', 'NCP', 'Nginx'] },
    ],
    performance: {
      note: 'JMeter · 100명 동시 · 3,500건',
      rows: [
        { item: '에러율',      before: '15.83%', after: '0%',   diff: '▼ 100%', highlight: true },
        { item: '안정 응답속도', before: '65ms',   after: '51ms', diff: '▼ 22%',  highlight: false },
      ],
    },
    implemented: [
      '테이블 예약 도메인 전체 — 예약 생성·조회·취소·상태 변경 API',
      'Redis SETNX 원자적 연산으로 동시 좌석 선점 Race Condition 방지',
      'Docker Compose + NCP 배포, Nginx 리버스 프록시 설정, 트러블슈팅 6건 Wiki 문서화',
    ],
    troubleshooting: [
      {
        title: 'Redis 기반 실시간 좌석 선점 — 동시성 이슈 해결',
        rows: [
          { label: '문제', text: '다수 사용자 동시 접근 시 중복 예약 가능성. RDBMS 단독 처리 시 트랜잭션 충돌 우려.' },
          { label: '해결', text: 'Redis 싱글 스레드 원자성 활용해 좌석 선점(Hold) 구축. TTL 5분으로 미결제 좌석 자동 해제.' },
          { label: '결과', text: '분산 락 없이 데이터 무결성 보장. DB 부하 최소화.' },
        ],
      },
      {
        title: 'Docker 배포 — 복합 이슈 5건 해결',
        rows: [
          { label: '문제', text: 'ERR_CONNECTION_REFUSED · 한글 깨짐 · React Router 404 · Redis 연결 실패 · 이미지 로딩 실패 복합 발생.' },
          { label: '원인', text: '포트 매핑 불일치 · MySQL charset 미설정 · .env API URL localhost 고정 · Redis 서비스 누락 · Nginx try_files 미설정.' },
          { label: '해결', text: '① 포트 매핑 수정 ② MySQL utf8mb4 ③ VITE_API_BASE_URL 서버 IP 변경 ④ Redis 서비스 추가 ⑤ Nginx try_files 추가' },
          { label: '결과', text: '전체 서비스 정상 배포. 해결 내용 Wiki 문서화.' },
        ],
      },
    ],
  },

  ai_camera: {
    icon: '📷',
    name: 'AI 카메라 관리 시스템',
    period: '2024.01 ~ 2024.02',
    team: '4인 팀 · 기업 인턴',
    github: 'https://github.com/yejeeni/AI-Camera-Management-System',
    summary: '(주)테이큰소프트 인턴 — AI 카메라 실시간 관제 시스템 프로토타입 개발',
    achievements: [
      { color: 'blue', text: '스케줄러 DB 조회 제거 (@PostConstruct 캐싱)' },
      { color: 'blue', text: 'CPU/메모리/연결 장애 10초 주기 실시간 감지' },
    ],
    stack: [
      { category: 'Backend',  tags: ['Java', 'Spring Legacy', 'MyBatis', 'PostgreSQL'] },
      { category: '영상 처리', tags: ['Python', 'Node.js', 'FFmpeg'] },
    ],
    performance: null,
    implemented: [
      '10초 주기 스케줄러로 CPU/메모리 기준치 초과 및 연결 오류 자동 감지',
      '@PostConstruct 메모리 캐싱 — 스케줄러 실행마다 반복되던 DB 풀스캔 제거',
      'Node.js + FFmpeg RTSP → HLS 변환으로 브라우저 실시간 영상 표시 구현',
    ],
    troubleshooting: [
      {
        title: '스케줄러 DB 과부하 — @PostConstruct 메모리 캐싱으로 해결',
        rows: [
          { label: '문제', text: '10초 주기 스케줄러가 매 실행마다 전체 장비 DB 조회 → 조회량 빠르게 누적.' },
          { label: '원인', text: '장애 감지를 위해 매번 DB에서 장비 상태를 풀스캔하는 구조.' },
          { label: '해결', text: '@PostConstruct로 앱 시작 시 장비 목록을 메모리에 로드. 스케줄러는 메모리 리스트와 비교. 장애 상태 변경 시에만 DB 업데이트.' },
          { label: '결과', text: '스케줄러 실행당 DB 조회 제거. 실시간 장애 감지 성능 유지.' },
        ],
      },
      {
        title: 'RTSP 스트리밍 — HTML5 미지원 문제 해결',
        rows: [
          { label: '문제', text: 'HTML5 브라우저가 RTSP 프로토콜을 직접 지원하지 않아 AI 카메라 영상을 웹에서 표시 불가.' },
          { label: '해결', text: '중앙 서버에서 Node.js + FFmpeg를 활용해 RTSP → HLS 변환. 브라우저에서 HLS로 실시간 수신.' },
          { label: '결과', text: '웹 브라우저에서 AI 카메라 실시간 영상 표시 구현.' },
        ],
      },
    ],
  },

  peach_store: {
    icon: '🛒',
    name: '피치스토어',
    period: '2025.07 ~ 2025.08',
    team: '5인 팀',
    github: 'https://github.com/zero5ive/Peach-Store',
    summary: 'Toss Payments 연동 결제 시스템 및 주문 스냅샷 설계 담당',
    achievements: [
      { color: 'blue',  text: 'Toss Payments 결제 승인·취소·실패 전 플로우' },
      { color: 'blue',  text: '주문 시점 스냅샷으로 데이터 정합성 보장' },
      { color: 'green', text: '15-thread 동시 결제 중복 방지 검증 PASS' },
    ],
    stack: [
      { category: 'Backend',  tags: ['Java', 'Spring MVC', 'MyBatis', 'MySQL'] },
      { category: '외부 API', tags: ['Toss Payments', 'Kakao Login', 'Naver Login'] },
      { category: '테스트',   tags: ['Python', 'requests', 'threading.Barrier'] },
    ],
    performance: {
      note: 'Python 15-thread 동시 요청',
      rows: [
        { item: '성공 결제 수',         before: '미검증', after: '1건',  diff: '정확', highlight: true  },
        { item: 'toss_payment 레코드', before: '미검증', after: '1건',  diff: '중복 없음', highlight: true  },
        { item: '나머지 14건',          before: '-',      after: '500', diff: 'Toss API 거부', highlight: false },
      ],
    },
    implemented: [
      'Toss Payments API 연동 — 결제 승인·취소·실패 전 플로우 구현',
      '결제-주문-스냅샷 단일 트랜잭션 처리로 정합성 보장',
      '3계층 중복 결제 방지 설계 — Toss API 멱등성 + selectByPaymentKey DB 체크 + @Transactional 롤백',
      '리뷰·문의·등급(Bronze~Platinum)·카테고리 관리 CRUD 전체 구현',
    ],
    troubleshooting: [
      {
        title: '동시 결제 중복 방지 — 15-thread 시나리오 테스트로 검증',
        rows: [
          { label: '목표', text: '동일 paymentKey로 15개 요청이 동시에 들어와도 DB에 결제 레코드가 1건만 생성되는지 검증.' },
          { label: '방법', text: 'Python threading.Barrier로 15개 스레드를 동기화 후 동시에 /payment/confirm 호출. DB 결과를 자동 검증하는 테스트 스크립트 직접 작성.' },
          { label: '1차 시도 실패 원인', text: 'Python requests 라이브러리가 RFC 쿠키 정책상 localhost 도메인 쿠키를 자동으로 붙이지 않아 JSESSIONID가 누락 → 15건 전부 로그인 페이지로 302 리다이렉트 → DB 0건.' },
          { label: '해결', text: 'session.cookies.set() 대신 Cookie 헤더 직접 지정으로 수정. 추가로 selectByPaymentKey() 중복 체크를 서비스 레이어에 추가해 Toss API 통과 후 DB 수준에서도 차단.' },
          { label: '결과', text: '15건 동시 요청 중 1건만 200 성공, 나머지 14건은 Toss API 차단으로 500. toss_payment · order_receipt 각 1건 생성 확인. PASS.' },
        ],
      },
      {
        title: '결제-DB 저장 트랜잭션 불일치 — 단일 트랜잭션으로 통합',
        rows: [
          { label: '문제', text: '결제 승인은 완료됐는데 DB 저장 실패 시 롤백이 안 되는 위험. 컨트롤러와 서비스 양쪽에 @Transactional 중복 적용으로 트랜잭션 범위 불명확.' },
          { label: '원인', text: 'TossPaymentService와 PaymentController 양쪽에 @Transactional이 걸려 있어 트랜잭션 경계가 예상과 다르게 동작.' },
          { label: '해결', text: '컨트롤러 @Transactional 제거 → TossPaymentService.handlePaymentAndSession()으로 이동. processPaymentComplete()에 두면 같은 클래스 내 자기 호출이라 Spring 프록시를 거치지 않아 @Transactional이 무효가 되기 때문.' },
          { label: '결과', text: '결제 승인부터 DB 저장까지 하나의 트랜잭션으로 처리. 중간 실패 시 결제 취소 + 롤백 자동 수행.' },
        ],
      },
    ],
  },

  allsee: {
    icon: '📹',
    name: '올씨구나',
    period: '2023.04 ~ 2023.11',
    team: '4인 팀 · 한이음 ICT멘토링',
    github: 'https://github.com/yejeeni/AI-IoT-CCTV-Security-Service',
    summary: 'AI + IoT + 자율주행 결합 스마트 방범 서비스 — 센서·서버·앱 풀스택 담당',
    achievements: [
      { color: 'green', text: '🏆 한이음 ICT멘토링 공모전 입선' },
      { color: 'blue',  text: '📄 ACK 2023 학술발표대회 논문 게재' },
      { color: 'blue',  text: '📱 Google Play 앱 등록' },
      { color: 'gray',  text: '©️ 한국저작권위원회 저작권 등록' },
    ],
    stack: [
      { category: 'S/W', tags: ['Python', 'Flask', 'Firebase', 'OpenCV', 'YOLOv3', 'OpenPose'] },
      { category: 'H/W', tags: ['Raspberry Pi', 'Arduino Uno', 'GPS·가스·초음파 센서'] },
    ],
    performance: null,
    implemented: [
      '라즈베리파이 센서 제어 · Flask 서버 · Firebase 실시간 DB 구축',
      'YOLOv3 + OpenPose로 사람 감지 및 넘어짐 이상 행동 인식',
      'KakaoMap 연동 실시간 CCTV 스트리밍 웹사이트 + Bluetooth RC카 제어 앱 개발',
    ],
    troubleshooting: [],
  },
};

function buildModalHTML(project) {
  const p = PROJECT_DATA[project];
  if (!p) return '';

  const achHTML = p.achievements.map(a =>
    `<span class="ach-badge ${a.color}">${a.text}</span>`
  ).join('');

  const stackHTML = p.stack.map(s =>
    `<div class="modal-stack-row">
      <span class="modal-stack-cat">${s.category}</span>
      <div class="modal-stack-tags">${s.tags.map(t => `<span class="stack-tag">${t}</span>`).join('')}</div>
    </div>`
  ).join('');

  const implHTML = p.implemented.map(i => `<li>${i}</li>`).join('');

  let perfHTML = '';
  if (p.performance) {
    const rows = p.performance.rows.map(r =>
      `<tr>
        <td>${r.item}</td>
        <td>${r.before}</td>
        <td class="${r.highlight ? 'highlight' : ''}">${r.after}</td>
        <td class="${r.highlight ? 'highlight' : ''}">${r.diff}</td>
      </tr>`
    ).join('');
    perfHTML = `
      <div class="modal-section">
        <div class="modal-section-title">성과 수치 <span style="font-weight:400;color:var(--gray-400);font-size:0.7rem;letter-spacing:0">${p.performance.note}</span></div>
        <table class="modal-perf-table">
          <thead><tr><th>항목</th><th>Before</th><th>After</th><th>개선</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }

  const tsHTML = p.troubleshooting.length > 0 ? `
    <div class="modal-section">
      <div class="modal-section-title">트러블슈팅</div>
      <div class="modal-ts-list">
        ${p.troubleshooting.map(ts => `
          <div class="modal-ts-item">
            <div class="modal-ts-title">${ts.title}</div>
            <div class="modal-ts-rows">
              ${ts.rows.map(row => `
                <div class="modal-ts-row">
                  <span class="modal-ts-label">${row.label}</span>
                  <span class="modal-ts-text">${row.text}</span>
                </div>`).join('')}
            </div>
          </div>`).join('')}
      </div>
    </div>` : '';

  return `
    <div class="modal-header">
      <div class="modal-meta">
        <span class="modal-icon">${p.icon}</span>
        <span class="modal-period">${p.period}</span>
        <span class="modal-team">${p.team}</span>
      </div>
      <h2 id="modal-title">${p.name}</h2>
      <p class="modal-summary">${p.summary}</p>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">주요 성과</div>
      <div class="modal-achievements">${achHTML}</div>
    </div>
    ${perfHTML}
    <div class="modal-section">
      <div class="modal-section-title">기술 스택</div>
      <div class="modal-stack-groups">${stackHTML}</div>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">핵심 구현</div>
      <ul class="modal-implemented">${implHTML}</ul>
    </div>
    ${tsHTML}
    <div class="modal-footer">
      <a href="${p.github}" target="_blank" rel="noopener" class="modal-github-btn">GitHub 바로가기 →</a>
    </div>`;
}

const modal = document.getElementById('project-modal');
const modalContent = document.getElementById('modal-content');
const modalCloseBtn = document.querySelector('.modal-close');

function openModal(projectId) {
  modalContent.innerHTML = buildModalHTML(projectId);
  modal.removeAttribute('hidden');
  // Force reflow before adding class for transition
  modal.offsetHeight;
  modal.classList.add('modal-visible');
  document.body.style.overflow = 'hidden';
  modalCloseBtn.focus();
}

function closeModal() {
  modal.classList.remove('modal-visible');
  modal.addEventListener('transitionend', () => {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }, { once: true });
}

// Open on "자세히 보기" button click
document.querySelectorAll('[data-project]').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.project));
});

// Close on X button
modalCloseBtn.addEventListener('click', closeModal);

// Close on backdrop click
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
});

// ===== Timeline items stagger =====
const timelineItems = document.querySelectorAll('.timeline-item');

const tlObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll('.timeline-item');
      items.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-16px)';
        setTimeout(() => {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        }, i * 80);
      });
      tlObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

const timelines = document.querySelectorAll('.timeline');
timelines.forEach(tl => tlObserver.observe(tl));
