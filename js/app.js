/**
 * Ujiro Energy Services - Main JS
 * Handles: animations, mobile menu, service modals, form states
 */

// ─── Image blur-up reveal ───────────────────────────────────────────────────
// Any <img class="img-reveal"> starts at opacity:0 / blur:6px.
// When the image enters the viewport AND finishes loading, .img-loaded is added,
// triggering the CSS fade+focus transition. Eliminates scroll-pop glitch.
(function () {
  function markLoaded(img) {
    img.classList.add("img-loaded");
    // Remove shimmer from wrapper if present
    var shell = img.closest(".img-shell");
    if (shell) shell.classList.add("img-shell--loaded");
  }

  function attachLoad(img) {
    if (img.complete && img.naturalWidth > 0) {
      // Already in browser cache — reveal immediately (no transition flash)
      img.classList.add("img-loaded");
      var shell = img.closest(".img-shell");
      if (shell) shell.classList.add("img-shell--loaded");
    } else {
      img.addEventListener(
        "load",
        function () {
          markLoaded(img);
        },
        { once: true }
      );
      img.addEventListener(
        "error",
        function () {
          markLoaded(img);
        },
        { once: true }
      );
    }
  }

  var imgs = document.querySelectorAll("img.img-reveal");
  if (!imgs.length) return;

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            attachLoad(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "150px 0px", threshold: 0 }
    );
    imgs.forEach(function (img) {
      io.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    imgs.forEach(attachLoad);
  }
})();

// IntersectionObserver for float-in animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains("float-in-right")) {
          entry.target.classList.add("in-view-right");
        } else if (entry.target.classList.contains("float-in-left")) {
          entry.target.classList.add("in-view-left");
        } else if (entry.target.classList.contains("float-in-left-slow")) {
          entry.target.classList.add("in-view");
        }
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document
  .querySelectorAll(".float-in-left, .float-in-left-slow, .float-in-right")
  .forEach((el) => {
    if (!el.classList.contains("float-in-strict")) {
      observer.observe(el);
    }
  });

const strictObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains("float-in-right")) {
          entry.target.classList.add("in-view-right");
        } else if (entry.target.classList.contains("float-in-left")) {
          entry.target.classList.add("in-view-left");
        } else if (entry.target.classList.contains("float-in-left-slow")) {
          entry.target.classList.add("in-view");
        }
        strictObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".float-in-strict").forEach((el) => {
  strictObserver.observe(el);
});

(function () {
  var cards = document.querySelectorAll("[data-card-reveal]");
  if (!cards.length) return;

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function revealCard(card) {
    if (card.classList.contains("is-visible")) return;

    var items = card.querySelectorAll("[data-card-reveal-item]");
    items.forEach(function (item, index) {
      item.style.transitionDelay = index * 0.12 + "s";
    });
    card.classList.add("is-visible");
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    cards.forEach(revealCard);
    return;
  }

  var cardObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealCard(entry.target);
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 }
  );

  cards.forEach(function (card) {
    cardObserver.observe(card);
  });
})();

(function () {
  var grids = document.querySelectorAll("[data-card-grid-reveal]");
  if (!grids.length) return;

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function revealGrid(grid) {
    if (grid.classList.contains("is-visible")) return;

    var items = grid.querySelectorAll("[data-card-grid-item]");
    items.forEach(function (item, index) {
      item.style.transitionDelay = index * 0.16 + "s";
    });
    grid.classList.add("is-visible");
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    grids.forEach(revealGrid);
    return;
  }

  var gridObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealGrid(entry.target);
          gridObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  grids.forEach(function (grid) {
    gridObserver.observe(grid);
  });
})();

function initProgressiveReveal() {
  var shells = document.querySelectorAll("[data-progressive-reveal]");
  if (!shells.length) return;

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      shells.forEach(function (shell) {
        shell.classList.add("shop-catalog-shell--ready");
        shell.setAttribute("aria-busy", "false");
      });
    });
  });
}

function bindInlineSubmitStates() {
  document
    .querySelectorAll("form[data-inline-submit]")
    .forEach(function (form) {
      form.addEventListener("submit", function (e) {
        if (form.dataset.submitting === "true") {
          e.preventDefault();
          return;
        }

        form.dataset.submitting = "true";

        var submitBtn = form.querySelector("[data-submit-button]");
        var loadingPanelSelector = form.getAttribute("data-loading-panel");
        var loadingPanel = loadingPanelSelector
          ? document.querySelector(loadingPanelSelector)
          : null;

        if (loadingPanel) {
          loadingPanel.classList.add("checkout-main--submitting");
          loadingPanel.setAttribute("aria-busy", "true");
        }

        if (submitBtn) {
          var spinner = submitBtn.querySelector(".submit-inline-spinner");
          var label = submitBtn.querySelector(".submit-button__label");
          var icon = submitBtn.querySelector(".submit-button__icon");

          submitBtn.disabled = true;
          submitBtn.setAttribute("aria-busy", "true");
          submitBtn.classList.add("opacity-75", "cursor-not-allowed");

          if (label) {
            label.textContent =
              submitBtn.getAttribute("data-loading-text") ||
              "Sending request...";
          }
          if (spinner) {
            spinner.classList.remove("hidden");
          }
          if (icon) {
            icon.classList.add("hidden");
          }
        }
      });
    });
}

function bindQuoteForms() {
  document.querySelectorAll("form[data-quote-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      var submitBtn = form.querySelector("[data-submit-button]");
      var spinner = submitBtn
        ? submitBtn.querySelector(".submit-inline-spinner")
        : null;
      var label = submitBtn
        ? submitBtn.querySelector(".submit-button__label")
        : null;
      var icon = submitBtn ? submitBtn.querySelector(".submit-button__icon") : null;
      var status = form.querySelector("[data-quote-status]");
      var originalLabel = label ? label.textContent : "";
      var data = new FormData(form);
      var serviceType = data.get("service_type") || "General AXGAS Inquiry";
      var subject = "AXGAS Quote Request - " + serviceType;
      var lines = [
        "AXGAS Quote Request",
        "",
        "Contact Name: " + (data.get("contact_name") || ""),
        "Company / Organization: " + (data.get("company_name") || ""),
        "Email Address: " + (data.get("email") || ""),
        "Phone Number: " + (data.get("phone") || ""),
        "Service Required: " + serviceType,
        "Preferred Contact Method: " + (data.get("preferred_contact") || ""),
        "Vehicle / Fleet Type: " + (data.get("vehicle_type") || ""),
        "Fleet Size / Units: " + (data.get("fleet_size") || ""),
        "Client Location: " + (data.get("location") || ""),
        "Expected Timeline: " + (data.get("timeline") || ""),
        "",
        "Quote Details:",
        data.get("message") || "",
      ];
      var mailtoUrl =
        "mailto:Axgasltd@gmail.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(lines.join("\n"));

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute("aria-busy", "true");
        submitBtn.classList.add("opacity-75", "cursor-not-allowed");
      }
      if (label) {
        label.textContent =
          submitBtn.getAttribute("data-loading-text") || "Preparing request...";
      }
      if (spinner) {
        spinner.classList.remove("hidden");
      }
      if (icon) {
        icon.classList.add("hidden");
      }
      if (status) {
        status.classList.remove("hidden");
        status.textContent =
          "Opening your email app with a prefilled quote request. If nothing opens, email Axgasltd@gmail.com directly.";
      }

      window.location.href = mailtoUrl;

      window.setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute("aria-busy");
          submitBtn.classList.remove("opacity-75", "cursor-not-allowed");
        }
        if (label) {
          label.textContent = originalLabel;
        }
        if (spinner) {
          spinner.classList.add("hidden");
        }
        if (icon) {
          icon.classList.remove("hidden");
        }
      }, 1200);
    });
  });
}

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", function () {
  initProgressiveReveal();
  bindInlineSubmitStates();
  bindQuoteForms();

  const menuBtn = document.getElementById("mobile-menu-btn");
  const closeBtn = document.getElementById("close-mobile-menu");
  const mobileMenu = document.getElementById("mobile-menu");

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("hidden");
    mobileMenu.setAttribute("aria-hidden", "false");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
    if (closeBtn) closeBtn.focus();
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add("hidden");
    mobileMenu.setAttribute("aria-hidden", "true");
    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.focus();
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", openMobileMenu);
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", closeMobileMenu);
  }

  // Close mobile menu on overlay click
  if (mobileMenu) {
    mobileMenu.addEventListener("click", function (e) {
      if (e.target === mobileMenu) closeMobileMenu();
    });
    // Escape key closes mobile menu
    document.addEventListener("keydown", function (e) {
      if (
        e.key === "Escape" &&
        mobileMenu &&
        !mobileMenu.classList.contains("hidden")
      ) {
        closeMobileMenu();
      }
    });
  }

  // Service detail modals
  const modal = document.getElementById("service-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");
  const closeModal = document.getElementById("close-modal");
  var lastFocusedElement = null;

  if (modal) {
    document.querySelectorAll(".read-more-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        lastFocusedElement = this;
        const title = this.dataset.title || "";
        const description = this.dataset.description || "";
        const outcome = this.dataset.outcome || "";
        const proof = this.dataset.proof || "";
        const ctaLabel = this.dataset.ctaLabel || "Contact Our Team";
        const ctaUrl = this.dataset.ctaUrl || "";
        let features = [];
        let idealFor = [];
        let riskControls = [];
        try {
          features = JSON.parse(this.dataset.features || "[]");
        } catch (e) {
          features = [];
        }
        try {
          idealFor = JSON.parse(this.dataset.idealFor || "[]");
        } catch (e) {
          idealFor = [];
        }
        try {
          riskControls = JSON.parse(this.dataset.riskControls || "[]");
        } catch (e) {
          riskControls = [];
        }

        modalTitle.textContent = title;

        let html = "";
        if (outcome) {
          html +=
            '<div class="mb-4 p-3 bg-orange-50 border border-orange-100 rounded-lg">' +
            '<p class="text-xs uppercase tracking-wide text-orange-700 font-semibold mb-1">Primary Outcome</p>' +
            '<p class="text-sm text-gray-900 font-semibold">' +
            escapeHtml(outcome) +
            "</p></div>";
        }

        html += '<p class="mb-4">' + escapeHtml(description) + "</p>";

        if (proof) {
          html +=
            '<div class="mb-4">' +
            '<h4 class="font-semibold mb-1 text-sm uppercase tracking-wide text-gray-500">Proof Of Capability</h4>' +
            '<p class="text-sm text-gray-700">' +
            escapeHtml(proof) +
            "</p></div>";
        }

        if (idealFor.length > 0) {
          html +=
            '<h4 class="font-semibold mb-2 text-sm uppercase tracking-wide text-gray-500">Ideal For</h4><ul class="list-disc list-inside space-y-1 mb-4">';
          idealFor.forEach(function (item) {
            html += "<li>" + escapeHtml(item) + "</li>";
          });
          html += "</ul>";
        }

        if (riskControls.length > 0) {
          html +=
            '<h4 class="font-semibold mb-2 text-sm uppercase tracking-wide text-gray-500">Risk Controls</h4><ul class="list-disc list-inside space-y-1 mb-4">';
          riskControls.forEach(function (item) {
            html += "<li>" + escapeHtml(item) + "</li>";
          });
          html += "</ul>";
        }

        if (features.length > 0) {
          html +=
            '<h4 class="font-semibold mb-2">Key Features:</h4><ul class="list-disc list-inside space-y-1">';
          features.forEach(function (f) {
            html += "<li>" + escapeHtml(f) + "</li>";
          });
          html += "</ul>";
        }

        html +=
          '<div class="mt-6">' +
          '<a href="' +
          escapeHtml(ctaUrl) +
          '" class="btn btn-primary btn-sm">' +
          escapeHtml(ctaLabel) +
          "</a></div>";

        modalContent.innerHTML = html;
        modal.classList.remove("hidden");
        modal.setAttribute("aria-hidden", "false");
        closeModal.focus();
      });
    });

    function closeModalFn() {
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
      if (lastFocusedElement) lastFocusedElement.focus();
    }

    if (closeModal) {
      closeModal.addEventListener("click", closeModalFn);
    }

    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModalFn();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModalFn();
      }
      // Focus trap
      if (e.key === "Tab" && !modal.classList.contains("hidden")) {
        var focusable = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }
});

function escapeHtml(text) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

// Lightweight parallax layers
(function () {
  var layers = document.querySelectorAll("[data-parallax]");
  if (!layers.length) return;

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) return;

  var ticking = false;

  function updateParallax() {
    var viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    layers.forEach(function (layer) {
      var rect = layer.getBoundingClientRect();

      if (rect.bottom < 0 || rect.top > viewportHeight) {
        return;
      }

      var speed = parseFloat(
        layer.getAttribute("data-parallax-speed") || "0.1"
      );
      var distanceFromCenter = rect.top + rect.height / 2 - viewportHeight / 2;
      var offset = distanceFromCenter * speed * -1;

      layer.style.transform = "translate3d(0, " + offset.toFixed(2) + "px, 0)";
    });

    ticking = false;
  }

  function queueParallax() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateParallax);
  }

  updateParallax();
  window.addEventListener("scroll", queueParallax, { passive: true });
  window.addEventListener("resize", queueParallax);
})();

// Animated counters
(function () {
  var counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function formatCounterValue(value, suffix) {
    return Math.round(value).toLocaleString() + (suffix || "");
  }

  function runCounter(counter) {
    if (counter.dataset.counted === "true") return;

    counter.dataset.counted = "true";

    var target = parseInt(counter.getAttribute("data-target") || "0", 10);
    var suffix = counter.getAttribute("data-suffix") || "";
    var duration = parseInt(
      counter.getAttribute("data-duration") || "1400",
      10
    );

    if (prefersReducedMotion || target <= 0) {
      counter.textContent = formatCounterValue(target, suffix);
      return;
    }

    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;

      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var currentValue = target * eased;

      counter.textContent = formatCounterValue(currentValue, suffix);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        counter.textContent = formatCounterValue(target, suffix);
      }
    }

    window.requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.45 }
    );

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  } else {
    counters.forEach(runCounter);
  }
})();

// Hero Carousel – crossfade images + sync info card
(function () {
  var slides = document.querySelectorAll(".hero-slide");
  var infoSlides = document.querySelectorAll(".hero-info-slide");
  var announce = document.getElementById("hero-announce");
  if (slides.length < 2) return;

  var current = 0;
  var total = slides.length;
  var INTERVAL = 6000;

  function goTo(next) {
    var prev = current;
    current = next;
    requestAnimationFrame(function () {
      slides[prev].classList.remove("hero-slide--active");
      if (infoSlides[prev]) {
        infoSlides[prev].classList.remove("hero-info-slide--active");
        infoSlides[prev].style.display = "none";
      }
      slides[next].classList.add("hero-slide--active");
      if (infoSlides[next]) {
        infoSlides[next].style.display = "";
        infoSlides[next].classList.add("hero-info-slide--active");
      }
      if (announce) {
        announce.textContent = "Showing slide " + (next + 1) + " of " + total;
      }
    });
  }

  setInterval(function () {
    goTo((current + 1) % total);
  }, INTERVAL);
})();

// Back to top button
(function () {
  var btn = document.getElementById("back-to-top");
  if (!btn) return;

  var threshold = 300;
  var ticking = false;

  function updateBackToTopVisibility() {
    if (window.scrollY > threshold) {
      btn.classList.remove("opacity-0", "pointer-events-none");
      btn.classList.add("opacity-100");
    } else {
      btn.classList.add("opacity-0", "pointer-events-none");
      btn.classList.remove("opacity-100");
    }
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () {
          updateBackToTopVisibility();
          ticking = false;
        });
      }
    },
    { passive: true }
  );

  // Ensure state is correct on load when landing mid-page.
  updateBackToTopVisibility();

  function pressBackToTop() {
    btn.classList.add("is-pressed");
  }

  function releaseBackToTop() {
    btn.classList.remove("is-pressed");
  }

  if (window.PointerEvent) {
    btn.addEventListener("pointerdown", pressBackToTop, { passive: true });
    btn.addEventListener("pointerup", releaseBackToTop, { passive: true });
    btn.addEventListener("pointercancel", releaseBackToTop, { passive: true });
    btn.addEventListener("pointerleave", releaseBackToTop, { passive: true });
  } else {
    btn.addEventListener("touchstart", pressBackToTop, { passive: true });
    btn.addEventListener("touchend", releaseBackToTop, { passive: true });
    btn.addEventListener("touchcancel", releaseBackToTop, { passive: true });
    btn.addEventListener("mousedown", pressBackToTop);
    btn.addEventListener("mouseup", releaseBackToTop);
    btn.addEventListener("mouseleave", releaseBackToTop);
  }

  function activateBackToTop(e) {
    releaseBackToTop();

    if (e) {
      e.preventDefault();
    }

    var prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  btn.addEventListener("click", activateBackToTop);
})();

// ── Shop RFQ module ──────────────────────────────────────────────────────────
(function () {
  "use strict";

  // Detect which page we're on
  var isShopPage = !!document.getElementById("step-equipment");
  var isCheckoutPage = !!document.getElementById("checkout-form");
  if (!isShopPage && !isCheckoutPage) return;

  // ── State ───────────────────────────────────────────────────────────────────
  var selected = {};
  var rafPending = false;
  var cardCache = {};

  var STORAGE_KEY = "ujiro_shop_selected";

  function saveSelections() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    } catch (e) {}
  }

  function loadSelections() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        selected = JSON.parse(raw);
      }
    } catch (e) {
      selected = {};
    }
  }

  // ── RAF-batched panel update ──────────────────────────────────────────────────
  function scheduleUpdate() {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(function () {
        rafPending = false;
        updatePanel();
      });
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function getCards() {
    return Array.prototype.slice.call(document.querySelectorAll(".shop-card"));
  }

  function totalItems() {
    return Object.keys(selected).length;
  }

  function totalUnits() {
    return Object.keys(selected).reduce(function (sum, k) {
      return sum + (selected[k].qty || 1);
    }, 0);
  }

  // ── Card visuals ─────────────────────────────────────────────────────────────
  function updateCardVisuals(card, isSelected) {
    var id = card.getAttribute("data-item-id");
    var c = cardCache[id];
    if (!c) return;

    var btn = c.selBtn;
    var label = c.label;
    var badge = c.badge;
    var icon = c.icon;
    var panel = c.qtyPanel;

    if (isSelected) {
      card.classList.add("ring-2", "ring-brand-orange");
      card.classList.remove("ring-0");
      if (btn) {
        btn.classList.add(
          "bg-brand-orange",
          "text-white",
          "border-brand-orange"
        );
        btn.classList.remove("text-brand-orange");
        btn.setAttribute("aria-pressed", "true");
      }
      if (label) {
        label.textContent = "\u2713 Added";
      }
      if (badge) {
        badge.classList.remove("hidden");
        badge.classList.add("flex");
      }
      if (icon) {
        icon.classList.remove("hidden");
      }
      if (panel) {
        panel.classList.remove("hidden");
      }
    } else {
      card.classList.remove("ring-2", "ring-brand-orange");
      card.classList.add("ring-0");
      if (btn) {
        btn.classList.remove("bg-brand-orange", "text-white");
        btn.classList.add("text-brand-orange");
        btn.setAttribute("aria-pressed", "false");
      }
      if (label) {
        label.textContent = "Add to RFQ";
      }
      if (badge) {
        badge.classList.add("hidden");
        badge.classList.remove("flex");
      }
      if (icon) {
        icon.classList.add("hidden");
      }
      if (panel) {
        panel.classList.add("hidden");
      }
    }
  }

  // ── Toggle selection ─────────────────────────────────────────────────────────
  function toggleCard(card) {
    var id = card.getAttribute("data-item-id");
    var title = card.getAttribute("data-item-title") || "Item " + id;
    var c = cardCache[id] || {};

    if (selected[id]) {
      delete selected[id];
      if (c.checkbox) c.checkbox.checked = false;
      if (c.qtyInput) c.qtyInput.value = "0";
      updateCardVisuals(card, false);
    } else {
      var initialQty = c.qtyInput ? parseInt(c.qtyInput.value, 10) || 1 : 1;
      var noteInput = card.querySelector("input[name$='[notes]']");
      var notes = noteInput ? noteInput.value : "";
      selected[id] = { title: title, qty: initialQty, notes: notes };
      if (c.checkbox) c.checkbox.checked = true;
      if (c.qtyInput) c.qtyInput.value = String(initialQty);
      if (c.display) c.display.textContent = String(initialQty);
      updateCardVisuals(card, true);
    }

    saveSelections();
    scheduleUpdate();
  }

  // ── Quantity stepper ─────────────────────────────────────────────────────────
  function handleDecrement(card) {
    var id = card.getAttribute("data-item-id");
    var c = cardCache[id] || {};
    if (!selected[id]) return;

    var current = selected[id].qty;
    if (current <= 1) return;
    var next = current - 1;
    selected[id].qty = next;
    if (c.qtyInput) c.qtyInput.value = String(next);
    if (c.display) c.display.textContent = String(next);
    saveSelections();
    scheduleUpdate();
  }

  function handleIncrement(card) {
    var id = card.getAttribute("data-item-id");
    var c = cardCache[id] || {};
    if (!selected[id]) return;

    var next = selected[id].qty + 1;
    selected[id].qty = next;
    if (c.qtyInput) c.qtyInput.value = String(next);
    if (c.display) c.display.textContent = String(next);
    saveSelections();
    scheduleUpdate();
  }

  // ── Wire a single card ───────────────────────────────────────────────────────
  function wireCard(card) {
    var id = card.getAttribute("data-item-id");

    var refs = {
      checkbox: card.querySelector(".shop-card-checkbox"),
      qtyInput: card.querySelector(".shop-qty-input"),
      display: card.querySelector(".shop-qty-display"),
      selBtn: card.querySelector(".shop-select-btn"),
      label: card.querySelector(".shop-select-label"),
      badge: card.querySelector(".shop-check-badge"),
      icon: card.querySelector(".shop-check-icon"),
      qtyPanel: card.querySelector(".shop-qty-panel"),
    };
    cardCache[id] = refs;

    if (refs.checkbox && refs.checkbox.checked) {
      var qty = refs.qtyInput ? parseInt(refs.qtyInput.value, 10) || 1 : 1;
      selected[id] = {
        title: card.getAttribute("data-item-title") || "Item " + id,
        qty: qty,
      };
      if (refs.display) refs.display.textContent = String(qty);
      updateCardVisuals(card, true);
    }

    card.addEventListener("click", function (e) {
      if (
        (refs.qtyPanel && refs.qtyPanel.contains(e.target)) ||
        (refs.selBtn && refs.selBtn === e.target) ||
        (refs.selBtn && refs.selBtn.contains(e.target))
      )
        return;
      toggleCard(card);
    });

    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (
          (refs.qtyPanel && refs.qtyPanel.contains(document.activeElement)) ||
          (refs.selBtn && refs.selBtn === document.activeElement)
        )
          return;
        toggleCard(card);
      }
    });

    if (refs.selBtn) {
      refs.selBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleCard(card);
      });
    }

    var dec = card.querySelector(".shop-qty-decrement");
    var inc = card.querySelector(".shop-qty-increment");
    var noteInput = card.querySelector("input[name$='[notes]']");
    if (dec)
      dec.addEventListener("click", function (e) {
        e.stopPropagation();
        handleDecrement(card);
      });
    if (inc)
      inc.addEventListener("click", function (e) {
        e.stopPropagation();
        handleIncrement(card);
      });
    if (noteInput) {
      noteInput.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      noteInput.addEventListener("input", function () {
        if (selected[id]) {
          selected[id].notes = noteInput.value;
          saveSelections();
        }
      });
    }
  }

  // ── Clear all selections ───────────────────────────────────────────────────
  function clearAllSelections() {
    getCards().forEach(function (card) {
      var id = card.getAttribute("data-item-id");
      if (selected[id]) {
        var c = cardCache[id] || {};
        if (c.checkbox) c.checkbox.checked = false;
        if (c.qtyInput) c.qtyInput.value = "0";
        updateCardVisuals(card, false);
      }
    });
    selected = {};
    saveSelections();
    scheduleUpdate();
  }

  // ── Shop page panel update ─────────────────────────────────────────────────
  function updatePanel() {
    var n = totalItems();

    // Selection banner
    var banner = document.getElementById("selection-banner");
    var bannerCount = document.getElementById("banner-count");
    var bannerLabel = document.getElementById("banner-label");
    if (banner) {
      if (n > 0) {
        banner.classList.remove("hidden");
        banner.classList.add("flex");
      } else {
        banner.classList.add("hidden");
        banner.classList.remove("flex");
      }
    }
    if (bannerCount) bannerCount.textContent = String(n);
    if (bannerLabel)
      bannerLabel.textContent =
        n === 1 ? "1 item selected" : n + " items selected";

    // Sticky panel (desktop)
    var countLabel = document.getElementById("panel-count-label");
    var badge = document.getElementById("panel-badge");
    if (countLabel)
      countLabel.textContent =
        n === 0
          ? "No items selected"
          : n + " item" + (n === 1 ? "" : "s") + " selected";
    if (badge) {
      badge.textContent = String(n);
      if (n > 0) {
        badge.classList.remove("hidden");
        badge.classList.add("flex");
      } else {
        badge.classList.add("hidden");
        badge.classList.remove("flex");
      }
    }

    var empty = document.getElementById("panel-empty");
    var items = document.getElementById("panel-items");
    if (empty) empty.classList.toggle("hidden", n > 0);
    if (items) items.classList.toggle("hidden", n === 0);

    // Items list
    var list = document.getElementById("panel-items-list");
    if (list) {
      list.innerHTML = Object.keys(selected)
        .map(function (id) {
          var it = selected[id];
          return (
            '<li class="flex items-center justify-between px-4 py-3 gap-3 hover:bg-gray-50 transition-colors cursor-pointer" data-panel-item="' +
            escapeHtml(id) +
            '" title="Click to scroll to item">' +
            '<span class="text-sm text-gray-700 font-medium truncate flex-1 mr-2">' +
            escapeHtml(it.title) +
            "</span>" +
            '<span class="text-xs font-bold text-orange-600 whitespace-nowrap bg-orange-50 border border-orange-100 rounded-lg px-2 py-0.5">x' +
            it.qty +
            "</span>" +
            "</li>"
          );
        })
        .join("");

      var panelListItems = list.querySelectorAll("[data-panel-item]");
      for (var pi = 0; pi < panelListItems.length; pi++) {
        panelListItems[pi].addEventListener("click", function () {
          var itemId = this.getAttribute("data-panel-item");
          var targetCard = document.querySelector(
            '.shop-card[data-item-id="' + itemId + '"]'
          );
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
            targetCard.classList.add("ring-4");
            setTimeout(function () {
              targetCard.classList.remove("ring-4");
            }, 1200);
          }
        });
      }
    }

    // Panel clear all button
    var panelClearBtn = document.getElementById("panel-clear-all");
    if (panelClearBtn) {
      panelClearBtn.classList.toggle("hidden", n === 0);
    }

    // Total units
    var units = totalUnits();
    var totalEl = document.getElementById("panel-total-units");
    if (totalEl) totalEl.textContent = String(units);

    // Mobile bar
    var mbar = document.getElementById("mobile-rfq-bar");
    var mcount = document.getElementById("mobile-panel-count");
    if (mbar) {
      mbar.classList.toggle("is-visible", n > 0);
      mbar.setAttribute("aria-hidden", n > 0 ? "false" : "true");
      mbar.setAttribute(
        "aria-label",
        "View RFQ — " + n + (n === 1 ? " item" : " items")
      );
    }
    if (mcount) mcount.textContent = n > 99 ? "99+" : String(n);
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // ── Checkout page logic ───────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════

  function initCheckoutPage() {
    loadSelections();
    var n = Object.keys(selected).length;
    var emptyEl = document.getElementById("checkout-empty");
    var mainEl = document.getElementById("checkout-main");

    if (n === 0) {
      // If server rendered validation errors, keep the form visible
      var errBlock = document.getElementById("checkout-form-errors");
      if (!errBlock) {
        if (emptyEl) emptyEl.classList.remove("hidden");
        if (mainEl) mainEl.classList.add("hidden");
        return;
      }
      // Errors present — show the form even with empty storage
      if (emptyEl) emptyEl.classList.add("hidden");
      if (mainEl) mainEl.classList.remove("hidden");
      return;
    }

    if (emptyEl) emptyEl.classList.add("hidden");
    if (mainEl) mainEl.classList.remove("hidden");

    renderCheckoutItems();
    injectCheckoutHiddenInputs();

    // Wire form submit
    var form = document.getElementById("checkout-form");
    if (form) {
      form.addEventListener("submit", function () {
        injectCheckoutHiddenInputs();
        // Do NOT clear sessionStorage here — if validation fails the page
        // re-renders and needs the selections.  Clear happens on thank-you page.
      });
    }
  }

  function renderCheckoutItems() {
    var container = document.getElementById("checkout-items-list");
    var countEl = document.getElementById("checkout-total-count");
    if (!container) return;

    var ids = Object.keys(selected);
    var totalQty = 0;

    container.innerHTML = ids
      .map(function (id) {
        var it = selected[id];
        totalQty += it.qty;
        return (
          '<div class="flex items-center justify-between px-5 py-3.5 gap-4">' +
          '<div class="flex items-center gap-3 min-w-0 flex-1">' +
          '<span class="w-7 h-7 rounded-lg bg-gray-100 text-gray-400 text-xs font-bold flex items-center justify-center flex-shrink-0">' +
          '<i class="fas fa-box text-[10px]"></i></span>' +
          '<span class="text-sm font-medium text-gray-800 truncate">' +
          escapeHtml(it.title) +
          "</span>" +
          "</div>" +
          '<div class="flex items-center gap-3 flex-shrink-0">' +
          '<div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">' +
          '<button type="button" class="checkout-qty-dec w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 text-xs transition" data-checkout-id="' +
          escapeHtml(id) +
          '"><i class="fas fa-minus text-[9px]"></i></button>' +
          '<span class="w-8 h-7 flex items-center justify-center text-xs font-bold text-gray-900 border-x border-gray-200 bg-gray-50 checkout-qty-val" data-checkout-id="' +
          escapeHtml(id) +
          '">' +
          it.qty +
          "</span>" +
          '<button type="button" class="checkout-qty-inc w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 text-xs transition" data-checkout-id="' +
          escapeHtml(id) +
          '"><i class="fas fa-plus text-[9px]"></i></button>' +
          "</div>" +
          '<button type="button" class="checkout-remove w-7 h-7 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition text-xs" data-checkout-id="' +
          escapeHtml(id) +
          '" title="Remove item"><i class="fas fa-trash-alt text-[10px]"></i></button>' +
          "</div>" +
          "</div>"
        );
      })
      .join("");

    if (countEl)
      countEl.textContent = ids.length + " items · " + totalQty + " units";

    // Wire stepper + remove buttons
    container.querySelectorAll(".checkout-qty-dec").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = this.getAttribute("data-checkout-id");
        if (selected[id] && selected[id].qty > 1) {
          selected[id].qty--;
          saveSelections();
          renderCheckoutItems();
          injectCheckoutHiddenInputs();
        }
      });
    });
    container.querySelectorAll(".checkout-qty-inc").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = this.getAttribute("data-checkout-id");
        if (selected[id]) {
          selected[id].qty++;
          saveSelections();
          renderCheckoutItems();
          injectCheckoutHiddenInputs();
        }
      });
    });
    container.querySelectorAll(".checkout-remove").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = this.getAttribute("data-checkout-id");
        delete selected[id];
        saveSelections();
        // If empty, show empty state
        if (Object.keys(selected).length === 0) {
          var emptyEl = document.getElementById("checkout-empty");
          var mainEl = document.getElementById("checkout-main");
          if (emptyEl) emptyEl.classList.remove("hidden");
          if (mainEl) mainEl.classList.add("hidden");
        } else {
          renderCheckoutItems();
          injectCheckoutHiddenInputs();
        }
      });
    });
  }

  function injectCheckoutHiddenInputs() {
    var container = document.getElementById("checkout-hidden-inputs");
    if (!container) return;
    container.innerHTML = "";

    Object.keys(selected).forEach(function (id) {
      var sel = document.createElement("input");
      sel.type = "hidden";
      sel.name = "items[" + id + "][selected]";
      sel.value = "1";
      var qty = document.createElement("input");
      qty.type = "hidden";
      qty.name = "items[" + id + "][quantity]";
      qty.value = String(selected[id].qty);
      container.appendChild(sel);
      container.appendChild(qty);
      if (selected[id].notes) {
        var note = document.createElement("input");
        note.type = "hidden";
        note.name = "items[" + id + "][notes]";
        note.value = selected[id].notes;
        container.appendChild(note);
      }
    });
  }

  // ── Init ─────────────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", function () {
    if (isCheckoutPage) {
      initCheckoutPage();

      // Error recovery: scroll to error block
      var errBlock = document.getElementById("checkout-form-errors");
      if (errBlock) {
        errBlock.focus();
        errBlock.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(function () {
          var inv = document.querySelector(
            "#checkout-form input.border-red-400"
          );
          if (inv) inv.focus();
        }, 700);
      }
      return;
    }

    // ── Shop catalogue page init ────────────────────────────────────────────
    loadSelections();
    getCards().forEach(wireCard);

    getCards().forEach(function (card) {
      var id = card.getAttribute("data-item-id");
      if (selected[id]) {
        var c = cardCache[id] || {};
        if (c.checkbox) c.checkbox.checked = true;
        if (c.qtyInput) c.qtyInput.value = String(selected[id].qty);
        if (c.display) c.display.textContent = String(selected[id].qty);
        var noteInput = card.querySelector("input[name$='[notes]']");
        if (noteInput && selected[id].notes)
          noteInput.value = selected[id].notes;
        updateCardVisuals(card, true);
      }
    });

    updatePanel();

    // Clear All buttons
    var clearBtns = [
      document.getElementById("banner-clear-all"),
      document.getElementById("panel-clear-all"),
    ];
    clearBtns.forEach(function (btn) {
      if (btn) btn.addEventListener("click", clearAllSelections);
    });

    // Mobile filter toggle
    var filterToggle = document.getElementById("filter-toggle");
    var filterBody = document.getElementById("filter-body");
    var filterIcon = document.getElementById("filter-toggle-icon");
    if (filterToggle && filterBody) {
      filterToggle.addEventListener("click", function () {
        var expanded = filterToggle.getAttribute("aria-expanded") === "true";
        filterToggle.setAttribute("aria-expanded", String(!expanded));
        filterBody.classList.toggle("hidden", expanded);
        if (filterIcon) {
          filterIcon.style.transform = expanded ? "" : "rotate(180deg)";
        }
      });
    }
  });
})();
