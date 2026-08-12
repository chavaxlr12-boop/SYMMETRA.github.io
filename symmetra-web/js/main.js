(function () {
  "use strict";

  /* ---------- Navbar scroll state ---------- */
  var navbar = document.getElementById("navbar");
  var lastY = window.scrollY;

  function onScroll() {
    var y = window.scrollY;
    if (y > 24) {
      navbar.classList.add("is-scrolled");
    } else {
      navbar.classList.remove("is-scrolled");
    }
    lastY = y;
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById("navToggle");
  var mobilePanel = document.getElementById("mobilePanel");

  function closeMobile() {
    mobilePanel.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  function openMobile() {
    mobilePanel.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  navToggle.addEventListener("click", function () {
    var expanded = navToggle.getAttribute("aria-expanded") === "true";
    if (expanded) { closeMobile(); } else { openMobile(); }
  });
  mobilePanel.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMobile);
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMobile();
  });

  /* ---------- Active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinkMap = {};
  document.querySelectorAll(".nav-links a[href^='#']").forEach(function (a) {
    navLinkMap[a.getAttribute("href").slice(1)] = a;
  });

  var activeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.id;
        var link = navLinkMap[id];
        if (!link) return;
        if (entry.isIntersecting) {
          Object.keys(navLinkMap).forEach(function (k) {
            navLinkMap[k].classList.remove("is-active");
          });
          link.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach(function (s) {
    if (navLinkMap[s.id]) activeObserver.observe(s);
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });

    // Safety net: if an element never crosses the observer threshold
    // (e.g. very short pages, or a delayed/inactive compositor), don't
    // leave it permanently invisible.
    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }, 3000);
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Services tabs ---------- */
  var tabs = document.querySelectorAll(".service-tab");
  var panels = document.querySelectorAll(".service-panel");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var target = tab.getAttribute("data-tab");

      tabs.forEach(function (t) {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      panels.forEach(function (p) {
        p.classList.toggle("is-active", p.getAttribute("data-panel") === target);
      });
    });
  });

  /* ---------- Contact form (mailto handoff) ---------- */
  var form = document.getElementById("contactForm");
  var fields = document.getElementById("formFields");
  var success = document.getElementById("formSuccess");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var name = document.getElementById("name").value.trim();
      var company = document.getElementById("company").value.trim();
      var email = document.getElementById("email").value.trim();
      var message = document.getElementById("message").value.trim();

      var subject = "Nuevo proyecto — " + name + (company ? " (" + company + ")" : "");
      var body =
        "Nombre: " + name + "\n" +
        "Empresa: " + (company || "-") + "\n" +
        "Correo: " + email + "\n\n" +
        "Mensaje:\n" + message;

      var mailto =
        "mailto:salvadormuher@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailto;

      fields.style.display = "none";
      success.classList.add("is-visible");
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
