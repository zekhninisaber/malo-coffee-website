/* =============================================
   MALŌ COFFEE — Interactions & Animations
   ============================================= */

(function () {
  'use strict';

  // ── Respect prefers-reduced-motion ──
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ════════════════════════════════════════
  // NAVBAR — scroll state + mobile drawer
  // ════════════════════════════════════════
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const drawer   = document.getElementById('nav-drawer');
  const drawerLinks = drawer ? drawer.querySelectorAll('a') : [];

  // Scroll → add .scrolled class
  function handleNavScroll() {
    const scrolled = window.scrollY > 48;
    navbar.classList.toggle('scrolled', scrolled);
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load

  // Hamburger toggle
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close drawer when a link is clicked
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !drawer.contains(e.target)) {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ════════════════════════════════════════
  // SCROLL REVEAL
  // ════════════════════════════════════════
  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Immediately show all reveals
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  // ════════════════════════════════════════
  // MENU TABS
  // ════════════════════════════════════════
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels  = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Update buttons
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update panels
      tabPanels.forEach(panel => {
        const isTarget = panel.id === `tab-${target}`;
        panel.classList.toggle('active', isTarget);

        // Re-trigger reveal for newly visible cards
        if (isTarget && !prefersReducedMotion) {
          const cards = panel.querySelectorAll('.reveal');
          cards.forEach(card => card.classList.remove('visible'));
          requestAnimationFrame(() => {
            cards.forEach(card => card.classList.add('visible'));
          });
        }
      });
    });

    // Keyboard navigation for tabs
    btn.addEventListener('keydown', (e) => {
      const tabs = [...tabButtons];
      const idx  = tabs.indexOf(btn);
      if (e.key === 'ArrowRight') {
        tabs[(idx + 1) % tabs.length].focus();
        tabs[(idx + 1) % tabs.length].click();
      } else if (e.key === 'ArrowLeft') {
        tabs[(idx - 1 + tabs.length) % tabs.length].focus();
        tabs[(idx - 1 + tabs.length) % tabs.length].click();
      }
    });
  });

  // ════════════════════════════════════════
  // SMOOTH ANCHOR SCROLL (offset for fixed nav)
  // ════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  // ════════════════════════════════════════
  // HERO PARALLAX (subtle, desktop only)
  // ════════════════════════════════════════
  if (!prefersReducedMotion && window.innerWidth > 900) {
    const heroBlob1 = document.querySelector('.hero-blob-1');
    const heroBlob2 = document.querySelector('.hero-blob-2');

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (heroBlob1) heroBlob1.style.transform = `translateY(${y * 0.12}px)`;
          if (heroBlob2) heroBlob2.style.transform = `translateY(${y * -0.08}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

})();
