document.addEventListener('DOMContentLoaded', () => {
  // Splash screen
  const splash = document.getElementById('splash');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('hidden');
      splash.addEventListener('transitionend', () => splash.remove());
    }, 3000);
  }



  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('is-active');
    });

    // Close menu when clicking a link
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-active');
      });
    });

    // Close menu on desktop resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        menu.classList.remove('is-active');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('is-active') && !menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('is-active');
      }
    });

    // Close menu on scroll
    window.addEventListener('scroll', () => {
      if (menu.classList.contains('is-active')) {
        menu.classList.remove('is-active');
      }
    });
  }

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
        btn.textContent = 'Envoyer le message';
        btn.disabled = false;
      } else {
        btn.textContent = 'Erreur, réessayez';
        setTimeout(() => { btn.textContent = 'Envoyer le message'; btn.disabled = false; }, 3000);
      }
    } catch {
      btn.textContent = 'Erreur réseau';
      setTimeout(() => { btn.textContent = 'Envoyer le message'; btn.disabled = false; }, 3000);
    }
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
      el.classList.add('will-change');
    }
  });

  function applyReveal(target, idx){
    // allow per-element delay via data-delay (ms)
    const dataDelay = parseInt(target.dataset.delay || '0', 10) || 0;
    const baseStagger = 90; // ms
    const totalDelay = dataDelay + (idx * baseStagger);
    target.style.setProperty('--anim-delay', totalDelay + 'ms');
    target.classList.add('revealed');
    // Remove will-change after animation
    setTimeout(() => { target.classList.remove('will-change'); }, totalDelay + 650);
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
