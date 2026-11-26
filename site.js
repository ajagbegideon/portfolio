// Mobile menu, and the current year in the footer.
const btn = document.querySelector(".menu-btn");
const nav = document.getElementById("nav");
if (btn && nav) {
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? "Close" : "Menu";
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = "Menu";
    }
  });
}
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());
