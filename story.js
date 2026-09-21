(() => {
  const scenes = Array.from(document.querySelectorAll('.scene'));
  const index = document.querySelector('.progress-index');
  const label = document.querySelector('.progress-label');
  const progress = document.querySelector('.progress-track i');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('seen');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px 40px 0px' });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    document.documentElement.classList.add('motion-ready');
    reduceMotion.addEventListener('change', event => {
      if (event.matches) document.documentElement.classList.remove('motion-ready');
    });
  }

  let queued = false;
  function updateProgress() {
    const marker = window.innerHeight * 0.35;
    let active = scenes[0];
    for (const scene of scenes) {
      if (scene.getBoundingClientRect().top <= marker) active = scene;
    }
    index.textContent = active.dataset.index;
    label.textContent = active.dataset.label;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${Math.min(100, Math.max(0, window.scrollY / Math.max(scrollable, 1) * 100))}%`;
    queued = false;
  }
  window.addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
})();
