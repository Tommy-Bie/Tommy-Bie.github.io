const header = document.querySelector('.site-header');
const navLinks = [...document.querySelectorAll('.nav-links a')];
const sections = [...document.querySelectorAll('main section[id]')];
const reveals = document.querySelectorAll('.reveal');
const allMotionVideos = [...document.querySelectorAll('.hero video')];
const motionToggle = document.querySelector('.motion-toggle');

window.addEventListener('load', () => {
  if (!window.location.hash) return;
  window.setTimeout(() => {
    document.querySelector(window.location.hash)?.scrollIntoView({ block: 'start' });
  }, 450);
});

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
reveals.forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
}, { rootMargin: '-25% 0px -60% 0px', threshold: [0, .1, .3] });
sections.forEach((section) => sectionObserver.observe(section));

motionToggle?.addEventListener('click', () => {
  const paused = motionToggle.getAttribute('aria-pressed') === 'true';
  allMotionVideos.forEach((video) => paused ? video.play().catch(() => {}) : video.pause());
  motionToggle.setAttribute('aria-pressed', String(!paused));
  motionToggle.querySelector('span').textContent = paused ? 'Pause motion' : 'Play motion';
  motionToggle.querySelector('svg').innerHTML = paused
    ? '<path d="M8 5v14M16 5v14"/>'
    : '<path d="m8 5 11 7-11 7V5Z"/>';
});

const demoCards = [...document.querySelectorAll('.demo-card, .dataset-card')];
const demoObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    const video = target.querySelector('video');
    if (!video) return;
    if (isIntersecting) video.play().catch(() => {});
    else video.pause();
  });
}, { rootMargin: '160px', threshold: .12 });
demoCards.forEach((card) => demoObserver.observe(card));

const dialog = document.querySelector('.video-dialog');
const dialogVideo = dialog?.querySelector('video');
const closeDialog = () => {
  if (!dialog?.open) return;
  dialog.close();
  dialogVideo.pause();
  dialogVideo.removeAttribute('src');
  dialogVideo.load();
  document.body.classList.remove('modal-open');
};
const openDialog = (card) => {
  if (!dialog || !dialogVideo) return;
  dialogVideo.src = card.dataset.video;
  dialog.showModal();
  document.body.classList.add('modal-open');
  dialogVideo.play().catch(() => {});
};
demoCards.forEach((card) => {
  card.addEventListener('click', () => openDialog(card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDialog(card);
    }
  });
});
document.querySelector('.dialog-close')?.addEventListener('click', closeDialog);
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) closeDialog();
});
dialog?.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeDialog();
});
