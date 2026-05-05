(function () {
  // ─── TYPED TAGLINE ──────────────────────────────────
  const typedEl = document.getElementById("typed-text");
  const tagline = "Building the interfaces that orchestrate the cloud";

  if (typedEl) {
    if (sessionStorage.getItem("typed")) {
      typedEl.textContent = tagline;
    } else {
      let i = 0;
      function typeChar() {
        if (i < tagline.length) {
          typedEl.textContent += tagline.charAt(i);
          i++;
          setTimeout(typeChar, 45);
        } else {
          sessionStorage.setItem("typed", "1");
        }
      }
      setTimeout(typeChar, 800);
    }
  }

  // ─── SCROLL PROGRESS BAR ───────────────────────────
  const progressBar = document.getElementById("scroll-progress");

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0 && progressBar) {
      progressBar.style.width = (scrollTop / docHeight) * 100 + "%";
    }
  }

  // ─── NAVIGATION SCROLL STATE ───────────────────────
  const nav = document.getElementById("nav");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  function updateNav() {
    if (nav) {
      nav.classList.toggle("scrolled", window.scrollY > 50);
    }

    let current = "";
    sections.forEach(function (section) {
      const top = section.offsetTop - 150;
      if (window.scrollY >= top) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", function () {
    updateProgress();
    updateNav();
  }, { passive: true });

  // ─── HAMBURGER MENU ────────────────────────────────
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobile-nav");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("open");
      mobileNav.classList.toggle("open");
      document.body.style.overflow = mobileNav.classList.contains("open") ? "hidden" : "";
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        hamburger.classList.remove("open");
        mobileNav.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  // ─── REVEAL ON SCROLL ──────────────────────────────
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach(function (el) {
    revealObserver.observe(el);
  });

  // ─── STAT COUNTER ANIMATION ────────────────────────
  const statObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const display = el.dataset.display;
          const suffix = el.dataset.suffix || "+";

          if (display) {
            el.textContent = display;
            statObserver.unobserve(el);
            return;
          }

          let start = 0;
          const duration = 1500;
          const startTime = performance.now();

          function animate(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(ease * target);
            el.textContent = current + suffix;
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          }

          requestAnimationFrame(animate);
          statObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(".stat-number[data-target]").forEach(function (el) {
    statObserver.observe(el);
  });

  // ─── EMAIL COPY TO CLIPBOARD ───────────────────────
  const emailLink = document.getElementById("email-link");
  const tooltip = document.getElementById("copy-tooltip");

  if (emailLink && tooltip) {
    emailLink.addEventListener("click", function (e) {
      e.preventDefault();
      const email = emailLink.getAttribute("href").replace("mailto:", "");
      navigator.clipboard.writeText(email).then(function () {
        tooltip.classList.add("show");
        setTimeout(function () {
          tooltip.classList.remove("show");
        }, 1500);
      });
    });
  }
})();
