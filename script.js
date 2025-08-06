/* ===== Header: sticky blur, mobile drawer, active link highlight ===== */
(function(){
  const header = document.getElementById('site-header');
  const menuBtn = header?.querySelector('.menu-toggle');
  const navWrap = document.getElementById('primary-nav');
  const links = [...document.querySelectorAll('a[data-link]')];

  // Sticky: add .scrolled when page is moved
  const onScroll = () => {
    if (!header) return;
    const scrolled = window.scrollY > 8;
    header.classList.toggle('scrolled', scrolled);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile drawer toggle
  const closeMenu = () => {
    if (!menuBtn || !navWrap) return;
    menuBtn.setAttribute('aria-expanded', 'false');
    navWrap.classList.remove('open');
    document.body.style.overflow = '';
  };
  const openMenu = () => {
    if (!menuBtn || !navWrap) return;
    menuBtn.setAttribute('aria-expanded', 'true');
    navWrap.classList.add('open');
    document.body.style.overflow = 'hidden'; // lock scroll
  };
  menuBtn?.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    expanded ? closeMenu() : openMenu();
  });
  // Close on ESC and on nav click (mobile)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
  navWrap?.addEventListener('click', (e) => {
    const target = e.target;
    if (target.matches('a[href^="#"]')) closeMenu();
  });

  // Active link highlight via IntersectionObserver
  const sectionIds = links.map(a => a.getAttribute('href')).filter(Boolean).map(h => h.replace('#',''));
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          const id = entry.target.id;
          links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

    sections.forEach(sec => io.observe(sec));
  } else {
    // Fallback: on scroll, pick nearest section
    const fallback = () => {
      let nearestId = null, nearestDist = Infinity;
      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        const d = Math.abs(rect.top);
        if (d < nearestDist){ nearestId = sec.id; nearestDist = d; }
      });
      links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${nearestId}`));
    };
    window.addEventListener('scroll', fallback, { passive: true });
    fallback();
  }
})();

/* ===== Hero: reveal on view ===== */
(function(){
  const nodes = document.querySelectorAll('[data-animate]');
  if (!nodes.length) return;

  const reveal = (el) => el.classList.add('in');

  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '-10% 0px -10% 0px', threshold: 0.01 });

    nodes.forEach(n => io.observe(n));
  } else {
    // Fallback
    nodes.forEach(reveal);
  }
})();

/* ===== Specials: keyboard scroll hint on mobile ===== */
(function(){
  const grid = document.querySelector('.specials-grid');
  if (!grid) return;

  // Drag-to-scroll (nice on desktop trackpads too)
  let isDown = false, startX = 0, scrollLeft = 0;
  const isHorizontal = () => window.getComputedStyle(grid).getPropertyValue('scroll-snap-type').includes('x');

  const mdown = (e) => {
    if (!isHorizontal()) return;
    isDown = true;
    grid.classList.add('dragging');
    startX = (e.pageX || e.touches?.[0]?.pageX) - grid.offsetLeft;
    scrollLeft = grid.scrollLeft;
  };
  const mmove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = (e.pageX || e.touches?.[0]?.pageX) - grid.offsetLeft;
    grid.scrollLeft = scrollLeft - (x - startX);
  };
  const mup = () => { isDown = false; grid.classList.remove('dragging'); };

  grid.addEventListener('mousedown', mdown);
  grid.addEventListener('mousemove', mmove);
  grid.addEventListener('mouseleave', mup);
  grid.addEventListener('mouseup', mup);
  grid.addEventListener('touchstart', mdown, { passive: true });
  grid.addEventListener('touchmove', mmove, { passive: false });
  grid.addEventListener('touchend', mup);
})();

/* ===== Footer: year + back-to-top ===== */
(function(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  const btn = document.querySelector('.backtop');
  btn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

