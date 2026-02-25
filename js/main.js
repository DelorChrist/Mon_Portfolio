document.addEventListener('DOMContentLoaded', () => {
  // Splash screen
  const splash = document.getElementById('splash');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('hidden');
      splash.addEventListener('transitionend', () => splash.remove());
    }, 3000);
  }

  // Header hide on scroll down, show on scroll up
  const nav = document.querySelector('.nav');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateNav() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }
    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  });

  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.menu');
  toggle && toggle.addEventListener('click', () => {
    if (menu.style.display === 'flex') {
      menu.style.display = 'none';
    } else {
      menu.style.display = 'flex';
      menu.style.flexDirection = 'column';
      menu.style.background = 'var(--bg)';
      menu.style.position = 'absolute';
      menu.style.right = '1rem';
      menu.style.top = '64px';
      menu.style.padding = '0.75rem';
      menu.style.borderRadius = '8px';
      menu.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    }
  });

  const form = document.querySelector('.contact-form');
  const popup = document.getElementById('msg-popup');
  const popupClose = document.getElementById('popup-close');

  function showPopup() {
    popup.hidden = false;
    // force reflow for transition
    popup.offsetHeight;
    popup.style.opacity = '1';
    popupClose.focus();
  }

  function hidePopup() {
    popup.style.opacity = '0';
    setTimeout(() => { popup.hidden = true; }, 300);
  }

  popupClose && popupClose.addEventListener('click', hidePopup);
  popup && popup.addEventListener('click', (e) => { if (e.target === popup) hidePopup(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !popup.hidden) hidePopup(); });

  form && form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Envoi en cours...';
    btn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        showPopup();
      } else {
        btn.textContent = 'Erreur, réessayez';
        setTimeout(() => { btn.textContent = 'Envoyer le message'; btn.disabled = false; }, 3000);
      }
    } catch {
      btn.textContent = 'Erreur réseau';
      setTimeout(() => { btn.textContent = 'Envoyer le message'; btn.disabled = false; }, 3000);
    }

    btn.textContent = 'Envoyer le message';
    btn.disabled = false;
  });

  // General reveal-on-scroll for many elements using a single observer.
  // Elements to observe: sections, project cards, parcours items, skill cards, stats, hero elements, footer
  const selectors = ['section', '.project-card', '.parcours-item', '.skill-card', '.stat-card', '.hero-text > *', '.hero-image', 'footer'];
  const elems = Array.from(document.querySelectorAll(selectors.join(',')));

  // Add stagger delays to skill cards so they appear one after another
  document.querySelectorAll('.skill-card').forEach((card, i) => {
    card.dataset.delay = String(i * 150);
  });

  // Add the utility animate class to elements that should animate if not already present
  elems.forEach(el => {
    if (!el.classList.contains('animate') && !el.classList.contains('no-animate')) {
      el.classList.add('animate');
    }
  });

  function applyReveal(target, idx){
    // allow per-element delay via data-delay (ms)
    const dataDelay = parseInt(target.dataset.delay || '0', 10) || 0;
    const baseStagger = 90; // ms
    const totalDelay = dataDelay + (idx * baseStagger);
    target.style.setProperty('--anim-delay', totalDelay + 'ms');
    target.classList.add('revealed');
  }

  if ('IntersectionObserver' in window && elems.length) {
    const indexMap = new Map(elems.map((el, i) => [el, i]));
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const idx = indexMap.get(target) || 0;
          applyReveal(target, idx);
          observer.unobserve(target);
        }
      });
    }, {root: null, rootMargin: '0px 0px -6% 0px', threshold: 0.08});
    elems.forEach(el => obs.observe(el));
  } else {
    // fallback: reveal all at once with small stagger
    elems.forEach((el, i) => applyReveal(el, i));
  }
});
