// Gideon Ajagbe portfolio: loader, cursor, reveals, word light-up, counters, rotator, tilt, magnetic buttons.
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;

  // Loader: count to 100, then lift away.
  const loader = document.querySelector(".loader");
  const count = document.getElementById("count");
  const start = () => body.classList.add("ready");
  if (!loader || reduce) { if (loader) loader.remove(); start(); }
  else {
    let n = 0;
    const tick = () => {
      n = Math.min(100, n + Math.ceil((100 - n) / 9));
      count.textContent = n;
      if (n < 100) setTimeout(tick, 35);
      else setTimeout(() => { loader.classList.add("done"); start(); setTimeout(() => loader.remove(), 1100); }, 180);
    };
    tick();
  }

  // Header gets a glass background after scrolling.
  const top = document.querySelector(".top");
  const onScroll = () => top.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu.
  const btn = document.querySelector(".menu-btn");
  const nav = document.getElementById("nav");
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
  });

  // Split big statements into words that light up as you scroll.
  document.querySelectorAll(".split").forEach((el) => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
  });
  const splits = [...document.querySelectorAll(".split")];
  const lightWords = () => {
    const vh = window.innerHeight;
    splits.forEach((el) => {
      const words = el.querySelectorAll(".w");
      const r = el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      const lit = Math.round(progress * words.length);
      words.forEach((w, i) => w.classList.toggle("lit", i < lit));
    });
  };
  if (reduce) splits.forEach((el) => el.querySelectorAll(".w").forEach((w) => w.classList.add("lit")));
  else { lightWords(); window.addEventListener("scroll", lightWords, { passive: true }); }

  // Reveal on scroll, and count numbers up.
  const countUp = (el) => {
    const end = Number(el.dataset.count);
    if (reduce) { el.textContent = end; return; }
    const t0 = performance.now(), dur = 1400;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      const num = e.target.querySelector("[data-count]");
      if (num) countUp(num);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal, .card").forEach((el) => io.observe(el));
  document.querySelectorAll("[data-count]").forEach((el) => { el.textContent = "0"; });

  // Rotating words in the hero.
  const words = ["founder.", "software builder.", "web developer.", "problem solver."];
  const rot = document.querySelector(".rot-word");
  if (rot && !reduce) {
    let i = 0;
    setInterval(() => {
      rot.classList.add("out");
      setTimeout(() => {
        i = (i + 1) % words.length;
        rot.textContent = words[i];
        rot.classList.remove("out"); rot.classList.add("in");
        requestAnimationFrame(() => requestAnimationFrame(() => rot.classList.remove("in")));
      }, 450);
    }, 2600);
  }

  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!fine || reduce) return;

  // Custom cursor.
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  const cursor = document.querySelector(".cursor");
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px)`; });
  const follow = () => {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(follow);
  };
  follow();
  document.querySelectorAll("a, button, .pills li, .card").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
  });

  // Magnetic buttons.
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });

  // 3D tilt on the phone.
  const phone = document.querySelector(".tilt");
  const stage = document.querySelector(".phone-stage");
  if (phone && stage) {
    stage.addEventListener("mousemove", (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      phone.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 14}deg)`;
    });
    stage.addEventListener("mouseleave", () => { phone.style.transform = ""; });
  }
})();
