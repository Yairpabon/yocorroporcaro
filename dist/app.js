'use strict';
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Abrir menú'); nav.classList.remove('open'); document.body.classList.remove('menu-open'); }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); nav.classList.toggle('open', open); document.body.classList.toggle('menu-open', open); if (open) nav.querySelector('a').focus(); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); if (e.key === 'Tab' && nav.classList.contains('open')) { const items = [...nav.querySelectorAll('a'), menuButton]; const first = items[0], last = items.at(-1); if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } } });
window.addEventListener('resize', () => { if (window.innerWidth > 767) closeMenu(); });
window.addEventListener('scroll', () => document.querySelector('.header').classList.toggle('scrolled', window.scrollY > 20), { passive: true });
const sectionObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { nav.querySelectorAll('a').forEach(link => { const active = link.hash === '#' + entry.target.id; link.classList.toggle('active', active); if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); }); } }); }, { rootMargin: '-15% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
const dialog = document.querySelector('#info-dialog');
const content = document.querySelector('#dialog-content');
const dialogContents = { register: `<span class="eyebrow">NOS VEMOS EN LA META</span><h2 id="dialog-title">Muy pronto<br>correremos juntas.</h2><p>Las inscripciones para <strong>Yo Corro por Caro</strong> se abrirán próximamente. Aquí encontrarás el enlace oficial cuando esté disponible.</p><p><strong>24 de octubre de 2026<br>Santa Marta, Magdalena</strong></p>`, route: `<span class="eyebrow">SANTA MARTA · 24 DE OCTUBRE</span><h2 id="dialog-title">Mapa del recorrido</h2><div class="map-controls"><button type="button" data-map-zoom aria-pressed="false">Ampliar +</button><span>Amplía y desplázate para ver los detalles</span></div><div class="map-viewport"><img src="assets/recorrido.webp" alt="Mapa del recorrido con salida, llegada y puntos de apoyo" width="3001" height="4001"></div>`, kit: `<span class="eyebrow">IDENTIDAD DE LA CARRERA</span><h2 id="dialog-title">Detalles que nos unen.</h2><div class="kit-detail-official"><img src="assets/kit-de-carrera.jpg" alt="Imagen oficial del kit de carrera: camisetas, termo, visera, dorsal y abanico" width="1536" height="1024"></div><p>Estos diseños forman parte del material de identidad del evento. Los elementos incluidos en el kit, tallas y condiciones de entrega se confirmarán con las inscripciones.</p>` };
function openDialog(type) { closeMenu(); content.innerHTML = dialogContents[type]; dialog.classList.toggle('map-dialog', type === 'route'); dialog.showModal(); document.body.classList.add('dialog-open'); }
['register', 'route', 'kit'].forEach(type => document.querySelectorAll('[data-' + type + ']').forEach(button => button.addEventListener('click', () => openDialog(type))));
function closeDialog() { dialog.close(); }
dialog.querySelector('.dialog-close').addEventListener('click', closeDialog); dialog.querySelector('.dialog-done').addEventListener('click', closeDialog); dialog.addEventListener('close', () => document.body.classList.remove('dialog-open')); dialog.addEventListener('click', e => { const rect = dialog.getBoundingClientRect(); if (e.target === dialog && (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom)) closeDialog(); });
const track = document.querySelector('.gallery-track'); const items = [...track.children]; const dots = document.querySelector('.gallery-dots'); let current = 0; const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
items.forEach((item, i) => { const button = document.createElement('button'); button.setAttribute('aria-label', 'Ver imagen ' + (i + 1)); button.addEventListener('click', () => goTo(i)); dots.append(button); });
function maxIndex() { return Math.max(0, items.length - Math.round(track.clientWidth / (items[0].getBoundingClientRect().width + 16))); }
function goTo(index) { const max = maxIndex(); current = index < 0 ? max : index > max ? 0 : index; track.scrollTo({ left: items[current].offsetLeft - items[0].offsetLeft, behavior: reduced.matches ? 'instant' : 'smooth' }); updateDots(); }
function updateDots() { [...dots.children].forEach((button, i) => { button.classList.toggle('active', i === current); button.setAttribute('aria-pressed', String(i === current)); button.hidden = i > maxIndex(); }); const disabled = maxIndex() === 0; document.querySelectorAll('.gallery-arrow').forEach(b => { b.hidden = disabled; }); }
document.querySelector('.previous').addEventListener('click', () => goTo(current - 1)); document.querySelector('.next').addEventListener('click', () => goTo(current + 1)); let scrollTimer; track.addEventListener('scroll', () => { clearTimeout(scrollTimer); scrollTimer = setTimeout(() => { current = Math.round(track.scrollLeft / (items[0].getBoundingClientRect().width + 16)); updateDots(); }, 100); }, { passive: true }); window.addEventListener('resize', () => { current = Math.min(current, maxIndex()); updateDots(); }); updateDots();

// Show the welcome announcement on every page load, without saved dismissal.
const welcomeDialog = document.querySelector('#welcome-dialog');
function closeWelcome() { welcomeDialog.close(); }
welcomeDialog.querySelector('.welcome-close').addEventListener('click', closeWelcome);
welcomeDialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
welcomeDialog.addEventListener('click', event => {
    const rect = welcomeDialog.getBoundingClientRect();
    if (event.target === welcomeDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) closeWelcome();
});
function showWelcome() {
    if (!welcomeDialog.open && !dialog.open) {
        welcomeDialog.showModal();
        welcomeDialog.focus();
        document.body.classList.add('dialog-open');
    }
}
showWelcome();
window.addEventListener('pageshow', event => { if (event.persisted) showWelcome(); });

content.addEventListener("click", event => { const button = event.target.closest("[data-map-zoom]"); if (!button) return; const enlarged = button.getAttribute("aria-pressed") !== "true"; button.setAttribute("aria-pressed", String(enlarged)); button.textContent = enlarged ? "Ajustar mapa −" : "Ampliar +"; content.querySelector(".map-viewport").classList.toggle("is-enlarged", enlarged); });
