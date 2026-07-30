(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  /* Header shrink on scroll ------------------------------------------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Mobile navigation ---------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      navLinks.classList.toggle("is-open", !open);
      document.body.style.overflow = !open ? "hidden" : "";
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* Scroll reveal ---------------------------------------------------------*/
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Lightbox gallery ------------------------------------------------------*/
  var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (triggers.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Bildansicht");
    lb.innerHTML =
      '<button class="lightbox-nav prev" aria-label="Vorheriges Bild">&#8249;</button>' +
      '<img alt="">' +
      '<button class="lightbox-nav next" aria-label="Nächstes Bild">&#8250;</button>' +
      '<p class="lightbox-caption"></p>' +
      '<button class="lightbox-close" aria-label="Schließen">&times;</button>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector("img");
    var lbCaption = lb.querySelector(".lightbox-caption");
    var current = 0;
    var lastFocused = null;

    function openLightbox(index) {
      current = index;
      var t = triggers[current];
      lbImg.src = t.getAttribute("href") || t.dataset.full || t.querySelector("img").src;
      lbImg.alt = t.dataset.caption || t.querySelector("img").alt || "";
      lbCaption.textContent = t.dataset.caption || "";
      lb.classList.add("is-open");
      lastFocused = document.activeElement;
      lb.querySelector(".lightbox-close").focus();
      document.body.style.overflow = "hidden";
    }
    function closeLightbox() {
      lb.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }
    function step(delta) {
      current = (current + delta + triggers.length) % triggers.length;
      openLightbox(current);
    }

    triggers.forEach(function (t, i) {
      t.addEventListener("click", function (e) {
        e.preventDefault();
        openLightbox(i);
      });
    });
    lb.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    lb.querySelector(".prev").addEventListener("click", function () { step(-1); });
    lb.querySelector(".next").addEventListener("click", function () { step(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }

  /* Booking / Calendly graceful fallback ----------------------------------*/
  var bookingEmbed = document.querySelector("[data-booking-embed]");
  if (bookingEmbed) {
    var cfg = window.HIVIN_CONFIG || {};
    var calendlyUrl = cfg.CALENDLY_URL || "";
    var isPlaceholder = !calendlyUrl || calendlyUrl.indexOf("YOUR-CALENDLY-LINK") !== -1;

    if (isPlaceholder) {
      bookingEmbed.innerHTML =
        '<div class="booking-fallback">' +
        '<div class="icon" aria-hidden="true">&#128197;</div>' +
        "<h3>Online-Terminbuchung folgt in Kürze</h3>" +
        "<p>Die direkte Kalenderbuchung wird aktuell eingerichtet (Calendly-Platzhalter). " +
        "Bis dahin erreichen Sie uns telefonisch oder über Instagram – wir vereinbaren gerne " +
        "gemeinsam Ihren Wunschtermin.</p>" +
        '<a class="btn btn-primary" href="tel:+491735678256">Termin telefonisch anfragen</a>' +
        "</div>";
    } else {
      var widget = document.createElement("div");
      widget.className = "calendly-inline-widget";
      widget.setAttribute("data-url", calendlyUrl);
      bookingEmbed.innerHTML = "";
      bookingEmbed.appendChild(widget);
      var script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }

  /* Google Maps: interactive JS API if key present, else keyless fallback */
  var mapEl = document.querySelector("[data-map]");
  if (mapEl) {
    var mcfg = window.HIVIN_CONFIG || {};
    var key = mcfg.GOOGLE_MAPS_API_KEY || "";
    var hasKey = key && key.indexOf("YOUR_GOOGLE_MAPS_API_KEY") === -1;

    if (hasKey) {
      window.initHivinMap = function () {
        var geocoder = new google.maps.Geocoder();
        var map = new google.maps.Map(mapEl, {
          zoom: 15,
          center: { lat: 47.7595, lng: 8.8425 },
          disableDefaultUI: false,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#F7F1E8" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#F7F1E8" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#5C4A3A" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#E8DCC8" }] }
          ]
        });
        geocoder.geocode({ address: mcfg.MAPS_QUERY }, function (results, status) {
          if (status === "OK" && results[0]) {
            map.setCenter(results[0].geometry.location);
            new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              title: "Hivin Friseursalon"
            });
          }
        });
      };
      var gmScript = document.createElement("script");
      gmScript.src =
        "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(key) + "&callback=initHivinMap";
      gmScript.async = true;
      document.body.appendChild(gmScript);
    } else {
      var iframe = document.createElement("iframe");
      iframe.title = "Standort Hivin Friseursalon auf Google Maps";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.src = "https://www.google.com/maps?q=" + encodeURIComponent(mcfg.MAPS_QUERY) + "&output=embed";
      mapEl.appendChild(iframe);
    }
  }

  /* Current year in footer ------------------------------------------------*/
  var yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
