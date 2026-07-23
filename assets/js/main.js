/* ==========================================================================
   GoogleHelpit — main.js  (vanilla, no dependencies)
   - Theme toggle (persisted in localStorage)
   - Mobile nav toggle
   - Troubleshooting search + category chip filter
   - Copy-to-clipboard for code blocks
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem("gh-theme"); } catch (e) {}
  if (stored) root.setAttribute("data-theme", stored);

  function setTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("gh-theme", t); } catch (e) {}
    updateThemeButton();
  }
  function currentTheme() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }
  function updateThemeButton() {
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      var light = currentTheme() === "light";
      btn.textContent = light ? "🌙" : "☀️";
      btn.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
    }
  }

  /* ---------- Wire up on load ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    // Theme toggle
    var themeBtn = document.querySelector(".theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        setTheme(currentTheme() === "light" ? "dark" : "light");
      });
      updateThemeButton();
    }

    // Mobile nav
    var navToggle = document.querySelector(".nav-toggle");
    var navLinks = document.querySelector(".nav-links");
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", function () {
        navLinks.classList.toggle("open");
      });
    }

    // Copy buttons
    document.querySelectorAll(".copy-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var block = btn.closest(".codeblock");
        var codeEl = block && block.querySelector("code");
        if (!codeEl) return;
        var text = codeEl.innerText;
        var done = function () {
          var old = btn.textContent;
          btn.textContent = "copied ✓";
          btn.classList.add("copied");
          setTimeout(function () { btn.textContent = old; btn.classList.remove("copied"); }, 1400);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(fallbackCopy);
        } else { fallbackCopy(); }
        function fallbackCopy() {
          var ta = document.createElement("textarea");
          ta.value = text; document.body.appendChild(ta); ta.select();
          try { document.execCommand("copy"); done(); } catch (e) {}
          document.body.removeChild(ta);
        }
      });
    });

    // Troubleshooting search + filter (only on pages that have the list)
    initTroubleshootingFilter();

    // Global search on the landing page: redirect to GCP page with query
    var siteSearch = document.getElementById("site-search");
    if (siteSearch) {
      siteSearch.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && siteSearch.value.trim()) {
          var q = encodeURIComponent(siteSearch.value.trim());
          window.location.href = "gcp-troubleshooting.html?q=" + q;
        }
      });
    }
  });

  /* ---------- Troubleshooting filter ---------- */
  function initTroubleshootingFilter() {
    var filterBox = document.getElementById("filter-box");
    var issues = Array.prototype.slice.call(document.querySelectorAll(".issue"));
    if (!issues.length) return;

    var chips = Array.prototype.slice.call(document.querySelectorAll(".chip"));
    var groups = Array.prototype.slice.call(document.querySelectorAll(".cat-group"));
    var noResults = document.querySelector(".no-results");
    var activeCat = "all";

    // Prefill from ?q= (from landing-page search)
    var params = new URLSearchParams(window.location.search);
    var initialQ = params.get("q") || "";
    if (filterBox && initialQ) filterBox.value = initialQ;

    function apply() {
      var q = (filterBox ? filterBox.value : "").trim().toLowerCase();
      var anyVisible = false;

      issues.forEach(function (issue) {
        var text = issue.getAttribute("data-text") || issue.innerText.toLowerCase();
        var cat = issue.getAttribute("data-cat") || "";
        var matchQ = !q || text.toLowerCase().indexOf(q) !== -1;
        var matchCat = activeCat === "all" || cat === activeCat;
        var show = matchQ && matchCat;
        issue.style.display = show ? "" : "none";
        if (show) anyVisible = true;
        if (show && q) { issue.open = true; } else if (!q) { issue.open = false; }
      });

      // Hide empty category groups
      groups.forEach(function (g) {
        var visibleInGroup = g.querySelectorAll('.issue:not([style*="display: none"])');
        // Recompute robustly:
        var vis = Array.prototype.slice.call(g.querySelectorAll(".issue")).some(function (i) {
          return i.style.display !== "none";
        });
        g.style.display = vis ? "" : "none";
      });

      if (noResults) noResults.style.display = anyVisible ? "none" : "block";
    }

    if (filterBox) filterBox.addEventListener("input", apply);

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        activeCat = chip.getAttribute("data-cat") || "all";
        apply();
      });
    });

    apply();
  }
})();
