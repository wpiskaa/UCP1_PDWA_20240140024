// ===== PAGE TRANSITION (smooth, soft) =====
function navigateTo(url) {
  document.body.classList.add('page-out');
  setTimeout(() => { window.location.href = url; }, 280);
}

// Intercept all internal nav links for smooth transition
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Only intercept local .html links (not external, not #, not mailto)
    if (
      href &&
      !href.startsWith('http') &&
      !href.startsWith('#') &&
      !href.startsWith('mailto') &&
      !href.startsWith('javascript') &&
      href.endsWith('.html')
    ) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(href);
      });
    }
  });
});

// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// Close mobile nav on link click
if (navLinks) {
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ===== ACTIVE NAV LINK =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  let current = 0;
  const step = target / 55;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString() + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }
  }, 18);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = true;
      entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-container').forEach(el => counterObserver.observe(el));

// ===== FORM SUBMISSION =====
const contactForm = document.getElementById('techForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.textContent = 'Mengirim...';
    btn.disabled = true;

    setTimeout(() => {
      const data = new FormData(this);
      const nama  = data.get('nama')  || '-';
      const email = data.get('email') || '-';
      const topik = data.get('topik') || '-';

      const result = document.getElementById('formResult');
      result.innerHTML = `
        <strong>✅ Pesan Berhasil Dikirim!</strong><br>
        <small>Halo <strong>${nama}</strong>, terima kasih sudah menghubungi kami.
        Kami akan membalas ke <strong>${email}</strong> mengenai topik <strong>${topik}</strong>.</small>
      `;
      result.classList.add('show');
      btn.textContent = 'Kirim Pesan';
      btn.disabled = false;
      contactForm.reset();
    }, 1100);
  });
}

// ===== GALLERY FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.gallery-item').forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      if (show) {
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
        item.style.display = '';
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.94)';
        setTimeout(() => { if (!show) item.style.display = 'none'; }, 300);
      }
    });
  });
});

// ===== LIGHTBOX =====
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

if (lightbox) {
  document.querySelectorAll('.gallery-item[data-src]').forEach(item => {
    item.addEventListener('click', () => {
      lightboxImg.src = item.dataset.src;
      lightbox.classList.add('active');
    });
  });

  lightboxClose && lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('active'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lightbox.classList.remove('active'); });
}
