
/* ===== THEME TOGGLE (persist) ===== */
const themeSwitch = document.getElementById('themeSwitch');
if (themeSwitch) {
  themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });

  // load saved theme
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeSwitch.checked = true;
  }
}

/* ===== MOBILE SIDEBAR TOGGLE ===== */
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');
if (menuToggle && sidebar) {
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });
}

/* ===== ACTIVE NAV HIGHLIGHT ON SCROLL ===== */
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav ul li a');

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 150;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}
window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

/* ===== SCROLL ANIMATIONS (IntersectionObserver) ===== */
const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
if ('IntersectionObserver' in window && animatedElements.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.2 });

  animatedElements.forEach(el => observer.observe(el));
} else {
  // fallback: reveal all
  animatedElements.forEach(el => el.classList.add('show'));
}

/* ===== SCROLL TO TOP BUTTON ===== */
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== SKILL BAR ANIMATION (when in view) ===== */
const progressBars = document.querySelectorAll('.progress');
if ('IntersectionObserver' in window && progressBars.length) {
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        // ensure style contains a width value inline (as provided in HTML)
        const inline = bar.getAttribute('style') || '';
        const match = inline.match(/width:\s*(\d+)%/);
        const percent = match ? match[1] + '%' : '0%';
        bar.style.width = percent;
      }
    });
  }, { threshold: 0.3 });

  progressBars.forEach(bar => skillObserver.observe(bar));
}

/* ===== CAR BEHAVIOR: MOVE + EXIT (at bottom only) ===== */
(function () {
  const car = document.querySelector('.car');
  if (!car) return;

  let isAtBottom = false;
  let exitTimer = null;

  function carCheck() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.body.scrollHeight;
    const reachedBottom = scrollY + windowHeight >= docHeight - 20;

    if (reachedBottom && !isAtBottom) {
      isAtBottom = true;
      clearTimeout(exitTimer);
      car.classList.remove('exiting');
      car.classList.add('visible', 'moving');
    } else if (!reachedBottom && isAtBottom) {
      isAtBottom = false;
      car.classList.remove('moving');
      car.classList.add('exiting');

      // after exit animation finishes, remove visibility classes
      clearTimeout(exitTimer);
      exitTimer = setTimeout(() => {
        car.classList.remove('visible', 'exiting');
      }, 3000); // match CSS carExit duration
    }
  }

  window.addEventListener('scroll', carCheck);
  window.addEventListener('resize', carCheck);
  window.addEventListener('load', carCheck);
})();

// ===== Dynamic page height for fly animation =====
const fly = document.querySelector('.fly');
let direction = 1; // 1 = down, -1 = up
let position = 0;
const speed = 1; // 2x faster

function animateFly() {
  const docHeight = document.documentElement.scrollHeight;
  const flyHeight = fly.clientHeight;
  const windowHeight = window.innerHeight;

  // Ensure it stops just above the bottom so it never disappears
  const maxY = docHeight + flyHeight;

  position += direction * speed;

  // Reverse direction at top or bottom limits
  if (position >= maxY - windowHeight) {
    position = maxY - windowHeight;
    direction = -1;
  } else if (position <= 0) {
    position = 0;
    direction = 1;
  }

  fly.style.top = `${position}px`;
  requestAnimationFrame(animateFly);
}

window.addEventListener('resize', () => {
  const docHeight = document.documentElement.scrollHeight;
  if (position > docHeight - fly.clientHeight) {
    position = docHeight - fly.clientHeight;
  }
});

window.addEventListener('load', animateFly);
