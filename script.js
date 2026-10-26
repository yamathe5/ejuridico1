const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
  navigation.classList.remove('open');
  navigation.inert = window.matchMedia('(max-width: 1024px)').matches;
};
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  navigation.classList.toggle('open', open);
  navigation.inert = !open;
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) closeMenu();
});
window.matchMedia('(min-width: 1025px)').addEventListener('change', closeMenu);
closeMenu();

if ('IntersectionObserver' in window) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  reveals.forEach(element => {
    if (element.parentElement.classList.contains('steps') || element.parentElement.classList.contains('hero-content')) {
      const siblings = [...element.parentElement.querySelectorAll(':scope > .reveal')];
      element.style.setProperty('--delay', `${Math.min(siblings.indexOf(element) * 65, 195)}ms`);
    }
    revealObserver.observe(element);
  });
  if (!reducedMotion.matches) document.documentElement.classList.add('js-motion');
  reducedMotion.addEventListener('change', event => {
    if (event.matches) document.documentElement.classList.remove('js-motion');
  });
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.navigation a').forEach(link => {
        const current = link.hash === `#${entry.target.id}`;
        link.classList.toggle('active', current);
        if (current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -65% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
}

const practiceItems = [...document.querySelectorAll('.practice-item')];
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const accordionStates = new WeakMap();
const movementAnimations = new WeakMap();
const flowElements = [...document.querySelectorAll('.practice-item, #enfoque, #testimonios, #contacto, footer')];
const motionEasing = 'cubic-bezier(.22, 1, .36, 1)';

// FLIP: animate the displaced sections with transforms, without animating layout properties.
function updateAccordionLayout(change) {
  const positions = flowElements.map(element => element.getBoundingClientRect().top);
  flowElements.forEach(element => movementAnimations.get(element)?.cancel());
  change();
  if (motionPreference.matches) return;
  const offsets = flowElements.map((element, index) => positions[index] - element.getBoundingClientRect().top);
  flowElements.forEach((element, index) => {
    if (Math.abs(offsets[index]) < 1 || !element.animate) return;
    const animation = element.animate([
      { transform: `translateY(${offsets[index]}px)` },
      { transform: 'translateY(0)' }
    ], { duration: 260, easing: motionEasing });
    movementAnimations.set(element, animation);
  });
}

async function setPracticeOpen(item, open) {
  const state = accordionStates.get(item);
  if (state.open === open) return;
  state.open = open;
  const revision = ++state.revision;
  const content = item.querySelector('.practice-content');
  const currentOpacity = item.open ? getComputedStyle(content).opacity : '0';
  const currentTransform = item.open ? getComputedStyle(content).transform : 'translateY(-8px)';
  state.animation?.cancel();
  item.classList.toggle('is-closing', !open);
  content.inert = !open;
  if (open && !item.open) updateAccordionLayout(() => { item.open = true; });
  if (content.animate) {
    state.animation = content.animate([
      { opacity: currentOpacity, transform: motionPreference.matches ? 'none' : currentTransform },
      { opacity: open ? 1 : 0, transform: motionPreference.matches ? 'none' : `translateY(${open ? 0 : -8}px)` }
    ], { duration: motionPreference.matches ? 100 : (open ? 240 : 170), easing: motionEasing, fill: 'both' });
    try { await state.animation.finished; } catch { return; }
  }
  if (revision !== state.revision) return;
  if (!open) updateAccordionLayout(() => { item.open = false; });
  state.animation?.cancel();
  state.animation = null;
  item.classList.remove('is-closing');
}

practiceItems.forEach(item => {
  accordionStates.set(item, { open: item.open, revision: 0, animation: null });
  const summary = item.querySelector('summary');
  summary.addEventListener('click', event => {
    event.preventDefault();
    const opening = !accordionStates.get(item).open;
    if (opening) practiceItems.forEach(other => {
      if (other !== item) setPracticeOpen(other, false);
    });
    setPracticeOpen(item, opening);
  });
});
document.querySelectorAll('[data-area]').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('#area').value = link.dataset.area;
  });
});

const form = document.querySelector('#contact-form');
const whatsappNumber = '51999999999';
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = `Hola, quisiera realizar una consulta legal.

*Nombre:* ${data.get('name').trim()}
*Correo:* ${data.get('email').trim()}
*Área de consulta:* ${data.get('area')}

*Detalle de la consulta:*
${data.get('message').trim()}`;
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.location.assign(url);
});
document.querySelector('#year').textContent = new Date().getFullYear();
