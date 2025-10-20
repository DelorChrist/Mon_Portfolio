document.addEventListener('DOMContentLoaded', () => {
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
  form && form.addEventListener('submit', (e) => {
    e.preventDefault();
    // simple UX feedback
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Envoyé ✓';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = 'Envoyer'; btn.disabled = false; }, 2500);
  });

  // General reveal-on-scroll for many elements using a single observer.
  // Elements to observe: sections, project cards, parcours items, skill cards, stats, hero elements, footer
  const selectors = ['section', '.project-card', '.parcours-item', '.skill-card', '.stat', '.hero-text > *', '.hero-image', 'footer'];
  const elems = Array.from(document.querySelectorAll(selectors.join(',')));

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
