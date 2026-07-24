(function () {
  const header = document.querySelector(".site-header");
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");
  if (!header) return;

  function closeMenu() {
    if (!nav || !menuBtn) return;
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  function updateHeader() {
    if (nav && nav.classList.contains("is-open")) {
      header.classList.add("is-solid");
      header.classList.remove("is-hero-light");
      return;
    }
    const y = window.scrollY;
    if (y > 80) {
      header.classList.add("is-solid");
      header.classList.remove("is-hero-light");
    } else {
      header.classList.remove("is-solid");
      header.classList.add("is-hero-light");
    }
  }

  header.classList.add("is-hero-light");
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(nav.classList.contains("is-open")));
      updateHeader();
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) closeMenu();
      updateHeader();
    });
  }
})();

(function () {
  const revealTargets = document.querySelectorAll(
    ".band__text, .section .section-label, .section h2, .section .section-intro, .editorial-item, .space-main, .space-copy, .space-strip img, .location-wrap, .products-cta"
  );

  if (!revealTargets.length) return;

  revealTargets.forEach(function (el, idx) {
    el.classList.add("reveal");
    el.style.transitionDelay = Math.min((idx % 6) * 70, 280) + "ms";
  });

  const observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
  );

  revealTargets.forEach(function (el) {
    observer.observe(el);
  });
})();

(function () {
  const modal = document.getElementById("booking-modal");
  const triggers = document.querySelectorAll(".js-booking-trigger");
  if (!modal || !triggers.length) return;

  const closeTargets = modal.querySelectorAll("[data-booking-close]");
  let lastTrigger = null;

  function openModal(trigger) {
    lastTrigger = trigger || null;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastTrigger) lastTrigger.focus();
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      openModal(trigger);
    });
  });

  closeTargets.forEach(function (target) {
    target.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
})();

(function () {
  const switches = document.querySelectorAll("[data-updates-switch]");
  if (!switches.length) return;

  switches.forEach(function (root) {
    const track = root.querySelector(".updates-switch__track");
    const cards = root.querySelectorAll(".update-card");
    const prevBtn = root.querySelector(".updates-switch__btn--prev");
    const nextBtn = root.querySelector(".updates-switch__btn--next");
    const dotsWrap = root.querySelector(".updates-switch__dots");

    if (!track || !cards.length || !dotsWrap) return;

    let index = 0;
    const autoSwitchMs = window.matchMedia("(max-width: 768px)").matches ? 2000 : 2600;
    let autoTimer = null;

    function render() {
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dotsWrap.querySelectorAll(".updates-switch__dot").forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function next() {
      index = (index + 1) % cards.length;
      render();
    }

    function startAuto() {
      stopAuto();
      autoTimer = window.setInterval(next, autoSwitchMs);
    }

    function stopAuto() {
      if (autoTimer !== null) {
        window.clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    cards.forEach(function (_, i) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "updates-switch__dot";
      dot.setAttribute("aria-label", "Go to update " + (i + 1));
      dot.addEventListener("click", function () {
        index = i;
        render();
        startAuto();
      });
      dotsWrap.appendChild(dot);
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        index = (index - 1 + cards.length) % cards.length;
        render();
        startAuto();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        next();
        startAuto();
      });
    }

    root.addEventListener("mouseenter", stopAuto);
    root.addEventListener("mouseleave", startAuto);

    render();
    startAuto();
  });
})();
