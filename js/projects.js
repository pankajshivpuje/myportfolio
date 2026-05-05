(function () {
  // ─── PROJECT FILTER ─────────────────────────────────
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      cards.forEach(function (card) {
        if (filter === "all" || card.dataset.category === filter) {
          card.style.opacity = "1";
          card.style.transform = "scale(1)";
          card.style.pointerEvents = "auto";
          card.style.position = "relative";
          card.style.height = "";
          card.style.marginBottom = "";
          card.style.overflow = "";
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          card.style.pointerEvents = "none";
          card.style.position = "absolute";
          card.style.height = "0";
          card.style.marginBottom = "0";
          card.style.overflow = "hidden";
        }
      });

      setTimeout(function () {
        cards.forEach(function (card) {
          if (filter === "all" || card.dataset.category === filter) {
            card.style.position = "";
          }
        });
      }, 350);
    });
  });

  // ─── MOUSE-FOLLOWING CARD SPOTLIGHT ─────────────────
  cards.forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", x + "px");
      card.style.setProperty("--mouse-y", y + "px");
    });
  });
})();
