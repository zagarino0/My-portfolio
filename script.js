(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- ciel étoilé du hero ---------- */

  var sky = document.querySelector(".hero-sky");
  if (sky) {
    var ctx = sky.getContext("2d");
    var stars = [];
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      var rect = sky.parentElement.getBoundingClientRect();
      sky.width = rect.width * dpr;
      sky.height = rect.height * dpr;
      sky.style.width = rect.width + "px";
      sky.style.height = rect.height + "px";
      var count = Math.round((rect.width * rect.height) / 9000);
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * sky.width,
          y: Math.random() * sky.height,
          r: (Math.random() * 1.1 + 0.3) * dpr,
          base: Math.random() * 0.5 + 0.25,
          speed: Math.random() * 0.015 + 0.004,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, sky.width, sky.height);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var a = reduced ? s.base : s.base + Math.sin(t * s.speed + s.phase) * 0.28;
        ctx.beginPath();
        ctx.fillStyle = "rgba(243,245,247," + Math.max(a, 0.06).toFixed(3) + ")";
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(draw);
  }

  /* ---------- panneau de code qui s'écrit ---------- */
const authorName = "Zagarino";
const authorEmail = "rrazafindrafita@gmail.com";
const authorRole = "Full Stack Developer";

var codeLines = [
  {
    text: "// api/routes/Full Stack Developer.js",
    html: '<span class="tok-com">// api/routes/developpeur-full-stack.js</span>'
  },

  {
    text: `const author = "${authorName} — ${authorEmail}";`,
    html: `<span class="tok-kw">const</span> author = <span class="tok-str">"${authorName} — ${authorEmail}"</span>;`
  },

  {
    text: `const role = "${authorRole}";`,
    html: `<span class="tok-kw">const</span> role = <span class="tok-str">"${authorRole}"</span>;`
  },

  {
    text: "",
    html: ""
  },

  {
    text: "router.get(",
    html: '<span class="tok-fn">router</span>.<span class="tok-fn">get</span>('
  },

  {
    text: '  "/developer/:id",',
    html: '  <span class="tok-str">"/developer/:id"</span>,'
  },

  {
    text: '  requireRole(["frontend", "backend"]),',
    html: '  <span class="tok-fn">requireRole</span>([<span class="tok-str">"frontend"</span>, <span class="tok-str">"backend"</span>]),'
  },

  {
    text: "  async (req, res) => {",
    html: '  <span class="tok-kw">async</span> (req, res) =&gt; {'
  },

  {
    text: "    const id = req.params.id;",
    html: '    <span class="tok-kw">const</span> id = req.params.<span class="tok-prop">id</span>;'
  },

  {
    text: "    const developer = await db.developers.findById(id);",
    html: '    <span class="tok-kw">const</span> developer = <span class="tok-kw">await</span> db.developers.<span class="tok-fn">findById</span>(<span class="tok-prop">id</span>);'
  },

  {
    text: "    res.json(developer);",
    html: '    res.<span class="tok-fn">json</span>(developer);'
  },

  {
    text: "  }",
    html: "  }"
  },

  {
    text: ");",
    html: ");"
  }
];

  var codeEl = document.getElementById("codeType");
  if (codeEl) {
    if (reduced) {
      codeEl.innerHTML = codeLines.map(function (l) {
        return '<span class="code-line">' + l.html + "</span>";
      }).join("\n") + '\n<span class="code-cursor"></span>';
    } else {
      (function typeLines(root, lines) {
        var li = 0;
        function nextLine() {
          if (li >= lines.length) return;
          var line = lines[li];
          var lineEl = document.createElement("span");
          lineEl.className = "code-line";
          root.appendChild(lineEl);
          var cursor = document.createElement("span");
          cursor.className = "code-cursor";
          root.appendChild(cursor);
          var ci = 0;
          function typeChar() {
            if (ci <= line.text.length) {
              lineEl.textContent = line.text.slice(0, ci);
              ci++;
              setTimeout(typeChar, 12 + Math.random() * 20);
            } else {
              lineEl.innerHTML = line.html;
              cursor.remove();
              root.appendChild(document.createTextNode("\n"));
              li++;
              setTimeout(nextLine, 80);
            }
          }
          typeChar();
        }
        nextLine();
      })(codeEl, codeLines);
    }
  }

  /* ---------- barre de navigation au scroll ---------- */

  var topbar = document.querySelector(".topbar");
  if (topbar) {
    var onScroll = function () {
      topbar.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- registre : ouverture d'une ligne ---------- */

  var heads = document.querySelectorAll(".row-head");

  function close(head) {
    var body = document.getElementById(head.getAttribute("aria-controls"));
    head.setAttribute("aria-expanded", "false");
    if (reduced) { body.hidden = true; body.style.height = ""; return; }
    body.style.height = body.scrollHeight + "px";
    requestAnimationFrame(function () {
      body.style.transition = "height .26s ease";
      body.style.height = "0px";
    });
    body.addEventListener("transitionend", function done() {
      body.removeEventListener("transitionend", done);
      body.hidden = true;
      body.style.transition = "";
      body.style.height = "";
    });
  }

  function open(head) {
    var body = document.getElementById(head.getAttribute("aria-controls"));
    head.setAttribute("aria-expanded", "true");
    body.hidden = false;
    if (reduced) return;
    body.style.height = "0px";
    requestAnimationFrame(function () {
      body.style.transition = "height .26s ease";
      body.style.height = body.scrollHeight + "px";
    });
    body.addEventListener("transitionend", function done() {
      body.removeEventListener("transitionend", done);
      body.style.transition = "";
      body.style.height = "";
    });
  }

  Array.prototype.forEach.call(heads, function (head) {
    head.addEventListener("click", function () {
      var isOpen = head.getAttribute("aria-expanded") === "true";
      Array.prototype.forEach.call(heads, function (other) {
        if (other !== head && other.getAttribute("aria-expanded") === "true") close(other);
      });
      if (isOpen) close(head); else open(head);
    });
  });

  /* ---------- filtres par technologie ---------- */

  var chips = document.querySelectorAll(".chip");
  var rows = document.querySelectorAll(".row");
  var empty = document.querySelector(".ledger-empty");

  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener("click", function () {
      var want = chip.dataset.filter;
      var shown = 0;

      Array.prototype.forEach.call(chips, function (c) {
        var on = c === chip;
        c.classList.toggle("is-on", on);
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });

      Array.prototype.forEach.call(rows, function (row) {
        var match = want === "tout" || row.dataset.tags.split(" ").indexOf(want) !== -1;
        row.classList.toggle("is-hidden", !match);
        if (match) shown++;
        var head = row.querySelector(".row-head");
        if (!match && head.getAttribute("aria-expanded") === "true") close(head);
      });

      empty.hidden = shown !== 0;
    });
  });

  /* ---------- copie de l'adresse e-mail ---------- */

  var toast = document.querySelector(".toast");
  var toastTimer;

  function say(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 2600);
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"), function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.dataset.copy;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(
          function () { say("Adresse copiée"); },
          function () { window.location.href = "mailto:" + value; }
        );
      } else {
        window.location.href = "mailto:" + value;
      }
    });
  });

  /* ---------- section courante dans la navigation ---------- */

  var links = document.querySelectorAll(".nav a");
  var targets = [];

  Array.prototype.forEach.call(links, function (link) {
    var section = document.querySelector(link.getAttribute("href"));
    if (section) targets.push({ link: link, section: section });
  });

  if ("IntersectionObserver" in window && targets.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var found = targets.filter(function (t) { return t.section === entry.target; })[0];
        if (!found) return;
        if (entry.isIntersecting) {
          targets.forEach(function (t) { t.link.removeAttribute("aria-current"); });
          found.link.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    targets.forEach(function (t) { observer.observe(t.section); });
  }
})();