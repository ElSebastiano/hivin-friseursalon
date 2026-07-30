/**
 * Hero 2.5D-Inszenierung (Variante C, siehe docs/hero-implementation.md).
 * Mehrere CSS-Ebenen (Foto, Farb-Blobs, Partikel) reagieren mit
 * unterschiedlicher Geschwindigkeit auf Maus-/Touch-Bewegung – dezente
 * Parallaxe statt einer echten 3D-Segmentierung des Referenzbildes.
 */
(function () {
  "use strict";

  var hero = document.querySelector(".hero");
  if (!hero) return;

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  var isSmallScreen = window.innerWidth < 760;

  var layers = Array.prototype.slice.call(hero.querySelectorAll("[data-depth]"));

  if (prefersReducedMotion || isCoarsePointer || isSmallScreen || !layers.length) {
    hero.classList.add("reduce-parallax");
    return;
  }

  var targetX = 0, targetY = 0, curX = 0, curY = 0;
  var ticking = false;

  function onPointerMove(e) {
    var rect = hero.getBoundingClientRect();
    var px = (e.clientX - rect.left) / rect.width - 0.5;
    var py = (e.clientY - rect.top) / rect.height - 0.5;
    targetX = px;
    targetY = py;
    requestTick();
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  function update() {
    curX += (targetX - curX) * 0.06;
    curY += (targetY - curY) * 0.06;

    layers.forEach(function (layer) {
      var depth = parseFloat(layer.dataset.depth) || 0;
      var x = curX * depth;
      var y = curY * depth;
      layer.style.transform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0)";
    });

    if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
      requestAnimationFrame(update);
    } else {
      ticking = false;
    }
  }

  hero.addEventListener("pointermove", onPointerMove);
  hero.addEventListener("pointerleave", function () {
    targetX = 0;
    targetY = 0;
    requestTick();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth < 760) {
      hero.classList.add("reduce-parallax");
      hero.removeEventListener("pointermove", onPointerMove);
    }
  });
})();
