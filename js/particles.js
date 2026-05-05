(function () {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  let width, height, particles, mouse, animId;
  const CONNECT_DIST = 150;
  const MOUSE_DIST = 200;

  function resize() {
    const hero = canvas.parentElement;
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  }

  function getCount() {
    if (width < 768) return 30;
    if (width < 1024) return 50;
    return 80;
  }

  function createParticles() {
    const count = getCount();
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
        baseAlpha: Math.random() * 0.3 + 0.2,
      });
    }
  }

  mouse = { x: -1000, y: -1000 };

  canvas.addEventListener("mousemove", function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener("mouseleave", function () {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      const mouseFactor = dm < MOUSE_DIST ? 1 - dm / MOUSE_DIST : 0;
      const alpha = p.baseAlpha + mouseFactor * 0.5;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r + mouseFactor * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < CONNECT_DIST) {
          const lineAlpha = (1 - d / CONNECT_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha + mouseFactor * 0.1})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  function init() {
    resize();
    createParticles();
    draw();
  }

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      createParticles();
    }, 200);
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (!animId) draw();
        } else {
          cancelAnimationFrame(animId);
          animId = null;
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(canvas);
  init();
})();
