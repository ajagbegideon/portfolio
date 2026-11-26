// Menu, header background, and gentle reveals on scroll.
(() => {
  const top = document.querySelector(".top");
  const onScroll = () => top.classList.toggle("scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const btn = document.querySelector(".menu-btn");
  const nav = document.getElementById("nav");
  const setOpen = (open) => { nav.classList.toggle("open", open); btn.setAttribute("aria-expanded", String(open)); btn.textContent = open ? "Close" : "Menu"; };
  btn.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Headings come in word by word.
  document.querySelectorAll(".words").forEach((el) => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w, i) => `<span class="w"><span style="--i:${i}">${w}</span></span>`).join(" ");
    io.observe(el);
  });

  // Big lines write themselves when you reach them.
  const typer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      typer.unobserve(e.target);
      const on = e.target.querySelector(".on"), off = e.target.querySelector(".off");
      const text = off.textContent; let n = 0;
      const tick = () => {
        n = Math.min(text.length, n + 1);
        on.textContent = text.slice(0, n); off.textContent = text.slice(n);
        if (n < text.length) setTimeout(tick, text.length > 60 ? 16 : 45);
        else setTimeout(() => e.target.querySelector(".caret").remove(), 1500);
      };
      tick();
    });
  }, { threshold: 0.4 });
  if (!reduce) document.querySelectorAll(".type-in").forEach((el) => {
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.innerHTML = '<span class="on" aria-hidden="true"></span><span class="caret" aria-hidden="true"></span><span class="off" aria-hidden="true"></span>';
    el.querySelector(".off").textContent = text;
    typer.observe(el);
  });

  // Numbers count up when they come into view.
  const nums = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      nums.unobserve(e.target);
      const end = Number(e.target.dataset.count), t0 = performance.now();
      const step = (t) => { const p = Math.min(1, (t - t0) / 1200); e.target.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      if (!reduce) requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach((el) => nums.observe(el));

  // The hero line types itself, like someone talking.
  const typed = document.querySelector(".typed");
  if (typed && !reduce) {
    const phrases = typed.dataset.phrases.split("|");
    let p = 0, n = 0, deleting = false;
    typed.textContent = "";
    const tick = () => {
      const text = phrases[p];
      n += deleting ? -1 : 1;
      typed.textContent = text.slice(0, n);
      let wait = deleting ? 22 : 42;
      if (!deleting && n === text.length) { deleting = true; wait = 2200; }
      else if (deleting && n === 0) { deleting = false; p = (p + 1) % phrases.length; wait = 350; }
      setTimeout(tick, wait);
    };
    setTimeout(tick, 1300);
  }

  document.getElementById("year").textContent = String(new Date().getFullYear());
})();
