/* =========================================================
   DAVIER TAN — INTERACTIONS
   ========================================================= */

/* Loads the project list managed in Pages CMS */
async function loadProjects() {
  try {
    const res = await fetch("projects.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data.projects) ? data.projects : [];
  } catch (err) {
    console.error("Could not load projects.json", err);
    return [];
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function projectCode(index) {
  return `PROJECT / ${String(index + 1).padStart(2, "0")}`;
}

function renderProjects(projects) {
  const grid = document.getElementById("project-grid");
  if (!grid) return;

  grid.innerHTML = projects.map((p, i) => `
    <article class="project-card${p.featured ? " featured" : ""}" data-category="${escapeHtml(p.categories)}">
      <div class="project-image">
        <div class="image-grid"></div>
        <div class="project-building-shape"></div>
        ${p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" loading="lazy">` : ""}
        <span class="project-stamp mono">${projectCode(i)}</span>
        <span class="project-image-label mono">${escapeHtml(p.imageLabel)}</span>
        <div class="scan-line"></div>
      </div>
      <div class="project-info">
        <div class="project-topline mono">
          <span>${String(i + 1).padStart(2, "0")}</span>
          <span>${escapeHtml(p.duration)}</span>
          <span>${escapeHtml(p.value)}</span>
        </div>
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.summary)}</p>
        <div class="project-tags">
          ${(p.tags || []).map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}
        </div>
        <button class="project-expand" type="button" data-project="${i}">
          <span>View project profile</span><b>↗</b>
        </button>
      </div>
    </article>
  `).join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  const body = document.body;
  const nav = document.getElementById("main-nav");
  const menuToggle = document.getElementById("menu-toggle");
  const progressFill = document.getElementById("progress-fill");
  const year = document.getElementById("year");
  const cursor = document.getElementById("cursor-measure");

  if (year) year.textContent = new Date().getFullYear();

  /* Build the project cards before anything that looks for them */
  const projects = await loadProjects();
  renderProjects(projects);

  /* ---------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------- */
  menuToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  nav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle?.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------------------------------------------------------
     Scroll progress + active navigation + timeline
     --------------------------------------------------------- */
  const sections = [...document.querySelectorAll("main section")];
  const navLinks = [...document.querySelectorAll(".main-nav a")];
  const timelineItems = [...document.querySelectorAll(".timeline-item")];
  const axisFill = document.getElementById("axis-fill");

  function updateScrollUI() {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

    if (progressFill) progressFill.style.height = `${progress * 100}%`;

    let activeSection = sections[0];
    let closest = Infinity;

    sections.forEach(section => {
      const distance = Math.abs(section.getBoundingClientRect().top);
      if (distance < closest) {
        closest = distance;
        activeSection = section;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle("active", link.dataset.nav === activeSection?.id);
    });

    /* Timeline becomes progressively "constructed" as About is viewed. */
    const about = document.getElementById("about");
    if (about && timelineItems.length) {
      const rect = about.getBoundingClientRect();
      const view = Math.min(
        1,
        Math.max(0, (window.innerHeight * 0.72 - rect.top) / (rect.height * 0.72))
      );

      const activeIndex = Math.min(
        timelineItems.length - 1,
        Math.max(0, Math.floor(view * timelineItems.length))
      );

      timelineItems.forEach((item, index) => {
        item.classList.toggle("active", index <= activeIndex);
      });

      if (axisFill) {
        axisFill.style.height = `${Math.min(100, view * 100)}%`;
      }
    }
  }

  let scrollTick = false;
  window.addEventListener("scroll", () => {
    if (!scrollTick) {
      window.requestAnimationFrame(() => {
        updateScrollUI();
        scrollTick = false;
      });
      scrollTick = true;
    }
  }, { passive: true });

  updateScrollUI();

  /* ---------------------------------------------------------
     Hero mouse parallax / construction drawing
     --------------------------------------------------------- */
  const hero = document.querySelector(".hero");

  if (hero && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    hero.addEventListener("pointermove", event => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      hero.style.setProperty("--mx", `${x * -18}px`);
      hero.style.setProperty("--my", `${y * -12}px`);
    });

    hero.addEventListener("pointerleave", () => {
      hero.style.setProperty("--mx", "0px");
      hero.style.setProperty("--my", "0px");
    });
  }

  /* ---------------------------------------------------------
     Cursor construction crosshair
     --------------------------------------------------------- */
  if (cursor && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    window.addEventListener("pointermove", event => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    });

    document.querySelectorAll("a, button, input, select, textarea").forEach(el => {
      el.addEventListener("mouseenter", () => cursor.classList.add("cursor-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-hover"));
    });
  }

  /* ---------------------------------------------------------
     Counter animation
     --------------------------------------------------------- */
  const counters = document.querySelectorAll("[data-counter]");

  function animateCounter(element) {
    const target = Number(element.dataset.counter);
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const elapsed = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      element.textContent = Math.round(target * eased);

      if (elapsed < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = "true";
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(counter => counterObserver.observe(counter));

  /* ---------------------------------------------------------
     Reveal-on-scroll utility
     --------------------------------------------------------- */
  const revealTargets = [
    ".section-heading",
    ".about-statement",
    ".timeline-item",
    ".project-card",
    ".toolkit-details",
    ".contact-copy",
    ".brief-form"
  ];

  const revealElements = document.querySelectorAll(revealTargets.join(","));
  revealElements.forEach(el => el.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------
     Project filtering (works on the cards rendered from projects.json)
     --------------------------------------------------------- */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      projectCards.forEach(card => {
        const categories = card.dataset.category?.split(" ") || [];
        const show = filter === "all" || categories.includes(filter);

        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ---------------------------------------------------------
     Toolkit interactive nodes
     --------------------------------------------------------- */
  const toolNodes = document.querySelectorAll(".tool-node");
  const toolDetails = document.querySelectorAll(".tool-detail");

  function activateTool(name) {
    toolNodes.forEach(node => {
      node.classList.toggle("active", node.dataset.tool === name);
    });

    toolDetails.forEach(detail => {
      detail.classList.toggle("active", detail.dataset.detail === name);
    });
  }

  toolNodes.forEach(node => {
    node.addEventListener("mouseenter", () => activateTool(node.dataset.tool));
    node.addEventListener("focus", () => activateTool(node.dataset.tool));
    node.addEventListener("click", () => activateTool(node.dataset.tool));
  });

  const orbit = document.getElementById("toolkit-orbit");

  if (orbit && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    orbit.addEventListener("pointermove", event => {
      const rect = orbit.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      orbit.style.setProperty("--orbit-rotation", `${x * 4 - y * 2}deg`);
    });

    orbit.addEventListener("pointerleave", () => {
      orbit.style.setProperty("--orbit-rotation", "0deg");
    });
  }

  /* ---------------------------------------------------------
     Project modal (content comes from projects.json)
     --------------------------------------------------------- */
  const modal = document.getElementById("project-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const modalCode = document.getElementById("modal-code");
  const modalStats = document.getElementById("modal-stats");
  const modalRole = document.getElementById("modal-role");

  function openProject(index) {
    const data = projects[index];
    if (!data || !modal) return;

    modalCode.textContent = projectCode(index);
    modalTitle.textContent = data.title || "";
    modalDescription.textContent = data.writeup || "";
    modalRole.textContent = data.role || "";

    const stats = [
      ["DURATION", data.duration],
      ["PROJECT", data.value],
      ["TYPE", data.type]
    ].filter(stat => stat[1]);

    modalStats.innerHTML = stats.map(stat => `
      <div class="modal-stat">
        <small class="mono">${escapeHtml(stat[0])}</small>
        <strong>${escapeHtml(stat[1])}</strong>
      </div>
    `).join("");

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
  }

  function closeProject() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
  }

  /* Delegated listener, because project cards are rendered after load */
  document.getElementById("project-grid")?.addEventListener("click", event => {
    const button = event.target.closest(".project-expand");
    if (button) openProject(Number(button.dataset.project));
  });

  document.querySelectorAll("[data-close-modal]").forEach(el => {
    el.addEventListener("click", closeProject);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeProject();
  });

  /* ---------------------------------------------------------
     Contact form → mailto
     --------------------------------------------------------- */
  const form = document.getElementById("brief-form");
  const formSuccess = document.getElementById("form-success");

  form?.addEventListener("submit", event => {
    event.preventDefault();

    const data = new FormData(form);
    const name = data.get("name");
    const email = data.get("email");
    const project = data.get("project");
    const message = data.get("message");

    const subject = encodeURIComponent(`Project enquiry — ${project}`);
    const bodyText = [
      `Hi Davier,`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      `Project type: ${project}`,
      ``,
      `Brief:`,
      `${message}`,
      ``,
      `Sent from daviertangr.github.io portfolio.`
    ].join("\n");

    window.location.href =
      `mailto:daviertgr+collab@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;

    if (formSuccess) {
      formSuccess.textContent = "Opening your email client…";
    }
  });

  /* ---------------------------------------------------------
     Smooth anchor fallback for fixed header
     --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", event => {
      const id = anchor.getAttribute("href");
      const target = document.querySelector(id);

      if (!target) return;

      event.preventDefault();

      const y = target.getBoundingClientRect().top + window.scrollY - 4;

      window.scrollTo({
        top: y,
        behavior: "smooth"
      });
    });
  });
});
