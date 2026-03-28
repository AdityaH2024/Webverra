/* ===================================================
   WEBVERRA TECHNOLOGIES — Main JavaScript
   =================================================== */

(function () {
  'use strict';

  /* ── Navbar scroll state ─────────────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ── Mobile nav toggle ───────────────────────── */
  const toggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Active nav link ─────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Scroll reveal ───────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Smooth anchor scrolling ─────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Contact form handling ───────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const service = document.getElementById('service')?.value || '';
      const message = document.getElementById('message').value.trim();

      if (!name || !phone || !message) {
        showFormMsg('Please fill in all required fields.', 'error');
        return;
      }

      // Build WhatsApp message
      const waText = `Hi Webverra Technologies! 👋\n\nName: ${name}\nPhone: ${phone}${service ? '\nService Interested: ' + service : ''}\n\nMessage: ${message}`;
      const waUrl = `https://wa.me/917000000000?text=${encodeURIComponent(waText)}`;

      showFormMsg('Redirecting to WhatsApp…', 'success');
      setTimeout(() => window.open(waUrl, '_blank'), 800);
    });
  }

  function showFormMsg(text, type) {
    let msg = document.getElementById('formMsg');
    if (!msg) {
      msg = document.createElement('div');
      msg.id = 'formMsg';
      msg.style.cssText = `
        margin-top: 14px;
        padding: 12px 18px;
        border-radius: 8px;
        font-family: 'Outfit', sans-serif;
        font-size: 0.88rem;
        font-weight: 600;
        text-align: center;
        transition: opacity 0.3s ease;
      `;
      document.getElementById('contactForm').appendChild(msg);
    }

    msg.textContent = text;
    msg.style.background = type === 'success'
      ? 'rgba(34, 197, 94, 0.12)'
      : 'rgba(239, 68, 68, 0.12)';
    msg.style.border = type === 'success'
      ? '1px solid rgba(34, 197, 94, 0.25)'
      : '1px solid rgba(239, 68, 68, 0.25)';
    msg.style.color = type === 'success' ? '#4ade80' : '#f87171';
    msg.style.opacity = '1';

    if (type !== 'success') {
      setTimeout(() => { msg.style.opacity = '0'; }, 3000);
    }
  }

  /* ── Number counter animation ────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      el.textContent = Math.floor(current) + suffix;
      if (current >= target) clearInterval(timer);
    }, step);
  }

  const counters = document.querySelectorAll('[data-target]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ── WA Float tooltip auto-dismiss ──────────── */
  const waFloat = document.querySelector('.wa-float');
  if (waFloat) {
    setTimeout(() => {
      const tooltip = waFloat.querySelector('.wa-tooltip');
      if (tooltip) {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateX(0)';
        setTimeout(() => {
          tooltip.style.opacity = '';
          tooltip.style.transform = '';
        }, 2800);
      }
    }, 3000);
  }

})();
