/* ============================================================
   Practical Databases with Python — book.js
   ============================================================ */

// --- Theme ---
const saved = localStorage.getItem('db-book-theme') || 'dark';
document.documentElement.setAttribute('data-theme', saved);

function toggleTheme() {
  const cur  = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('db-book-theme', next);
  updateThemeBtn();
}

function updateThemeBtn() {
  const btn = document.getElementById('theme-btn');
  if (!btn) return;
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.textContent = dark ? '☀️' : '🌙';
  btn.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
}

// --- Mobile sidebar ---
function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
}
document.addEventListener('click', e => {
  const sb  = document.querySelector('.sidebar');
  const btn = document.querySelector('.menu-btn');
  if (sb && sb.classList.contains('open') && !sb.contains(e.target) && e.target !== btn)
    sb.classList.remove('open');
});

// --- Quiz ---
function initQuiz() {
  document.querySelectorAll('.option').forEach(opt => {
    opt.addEventListener('click', () => {
      const q = opt.closest('.question');
      if (q.dataset.answered) return;
      q.dataset.answered = 'true';
      const correct = q.dataset.correct;
      const chosen  = opt.dataset.value;
      q.querySelectorAll('.option').forEach(o => {
        if (o.dataset.value === correct) o.classList.add('correct');
        else if (o.dataset.value === chosen) o.classList.add('wrong');
      });
    });
  });
}

// --- Reveal buttons ---
function initReveals() {
  document.querySelectorAll('.reveal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const open = target.classList.toggle('open');
      btn.textContent = open
        ? (btn.dataset.hideLabel || 'Hide')
        : (btn.dataset.showLabel || 'Show');
    });
  });
}

// --- Copy buttons on code blocks ---
function initCopyButtons() {
  document.querySelectorAll('pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'copy';
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(pre.innerText.replace('copy','').trim()).then(() => {
        btn.textContent = 'copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('copied'); }, 1500);
      });
    });
    pre.appendChild(btn);
  });
}

// --- Progress tracking ---
function initProgress() {
  const key   = 'db-book-progress';
  const saved = JSON.parse(localStorage.getItem(key) || '[]');
  const slug  = location.pathname.split('/').pop().replace('.html','');

  if (slug && slug !== 'index' && !saved.includes(slug)) {
    saved.push(slug);
    localStorage.setItem(key, JSON.stringify(saved));
  }

  // Mark visited links in sidebar
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkSlug = link.getAttribute('href').replace('.html','').split('/').pop();
    if (saved.includes(linkSlug)) {
      link.style.setProperty('--visited', '1');
      if (!link.classList.contains('active')) {
        link.style.opacity = '0.75';
      }
    }
  });
}

// --- Active nav ---
function setActiveNav() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    link.classList.toggle('active', href === current);
  });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  updateThemeBtn();
  initQuiz();
  initReveals();
  initCopyButtons();
  initProgress();
  setActiveNav();
});
