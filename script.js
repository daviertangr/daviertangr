document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     GLOBAL ELEMENTS
     ========================================================= */

  const body = document.body;

  const nav = document.getElementById("main-nav");
  const menu = document.getElementById("menu-toggle");
  const progress = document.getElementById("progress-fill");
  const cursor = document.getElementById("cursor-measure");

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* =========================================================
     MOBILE NAVIGATION
     ========================================================= */

  menu?.addEventListener("click", () => {

    const open = nav.classList.toggle("open");

    menu.classList.toggle("open", open);

    menu.setAttribute(
      "aria-expanded",
      String(open)
    );

  });


  nav?.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

      nav.classList.remove("open");

      menu?.classList.remove("open");

      menu?.setAttribute(
        "aria-expanded",
        "false"
      );

    });

  });


  /* =========================================================
     SCROLL PROGRESS
     ========================================================= */

  const sections = [
    ...document.querySelectorAll("main section")
  ];

  const navLinks = [
    ...document.querySelectorAll(".main-nav a")
  ];

  const timelineItems = [
    ...document.querySelectorAll(".timeline-item")
  ];

  const axisFill =
    document.getElementById("axis-fill");


  function updateScrollUI() {

    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const scrollProgress =
      maxScroll > 0
        ? window.scrollY / maxScroll
        : 0;

    if (progress) {

      progress.style.height =
        `${scrollProgress * 100}%`;

    }


    /* ---------------------------------------------------------
       ACTIVE NAVIGATION
       --------------------------------------------------------- */

    let activeSection = sections[0];

    let closestDistance = Infinity;


    sections.forEach(section => {

      const distance =
        Math.abs(
          section.getBoundingClientRect().top
        );

      if (distance < closestDistance) {

        closestDistance = distance;

        activeSection = section;

      }

    });


    navLinks.forEach(link => {

      link.classList.toggle(
        "active",
        link.dataset.nav === activeSection?.id
      );

    });


    /* ---------------------------------------------------------
       TIMELINE
       --------------------------------------------------------- */

    const about =
      document.getElementById("about");


    if (about && timelineItems.length) {

      const rect =
        about.getBoundingClientRect();


      const timelineProgress =
        Math.max(
          0,
          Math.min(
            1,
            (
              window.innerHeight * 0.72 -
              rect.top
            ) /
            (rect.height * 0.72)
          )
        );


      const activeIndex =
        Math.min(
          timelineItems.length - 1,
          Math.max(
            0,
            Math.floor(
              timelineProgress *
              timelineItems.length
            )
          )
        );


      timelineItems.forEach(
        (item, index) => {

          item.classList.toggle(
            "active",
            index <= activeIndex
          );

        }
      );


      if (axisFill) {

        axisFill.style.height =
          `${timelineProgress * 100}%`;

      }

    }

  }


  window.addEventListener(
    "scroll",
    updateScrollUI,
    {
      passive: true
    }
  );


  updateScrollUI();


  /* =========================================================
     HERO MOUSE PARALLAX
     ========================================================= */

  const hero =
    document.querySelector(".hero");


  if (
    hero &&
    window.matchMedia(
      "(hover:hover) and (pointer:fine)"
    ).matches
  ) {

    hero.addEventListener(
      "pointermove",
      event => {

        const rect =
          hero.getBoundingClientRect();


        const x =
          (event.clientX - rect.left) /
          rect.width -
          0.5;


        const y =
          (event.clientY - rect.top) /
          rect.height -
          0.5;


        hero.style.setProperty(
          "--mx",
          `${x * -18}px`
        );


        hero.style.setProperty(
          "--my",
          `${y * -12}px`
        );

      }
    );


    hero.addEventListener(
      "pointerleave",
      () => {

        hero.style.setProperty(
          "--mx",
          "0px"
        );

        hero.style.setProperty(
          "--my",
          "0px"
        );

      }
    );

  }


  /* =========================================================
     CUSTOM ENGINEERING CURSOR
     ========================================================= */

  if (
    cursor &&
    window.matchMedia(
      "(hover:hover) and (pointer:fine)"
    ).matches
  ) {

    window.addEventListener(
      "pointermove",
      event => {

        cursor.style.left =
          `${event.clientX}px`;

        cursor.style.top =
          `${event.clientY}px`;

      }
    );


    document
      .querySelectorAll(
        "a, button, input, select, textarea"
      )
      .forEach(element => {

        element.addEventListener(
          "mouseenter",
          () => {

            cursor.classList.add(
              "cursor-hover"
            );

          }
        );


        element.addEventListener(
          "mouseleave",
          () => {

            cursor.classList.remove(
              "cursor-hover"
            );

          }
        );

      });

  }


  /* =========================================================
     COUNTER ANIMATION
     ========================================================= */

  const counters =
    document.querySelectorAll(
      "[data-counter]"
    );


  const counterObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (
            entry.isIntersecting &&
            !entry.target.dataset.done
          ) {

            entry.target.dataset.done =
              "true";


            const target =
              Number(
                entry.target.dataset.counter
              );


            const start =
              performance.now();


            const duration =
              900;


            function animateCounter(now) {

              const progress =
                Math.min(
                  1,
                  (now - start) /
                  duration
                );


              const eased =
                1 -
                Math.pow(
                  1 - progress,
                  3
                );


              entry.target.textContent =
                Math.round(
                  target * eased
                );


              if (progress < 1) {

                requestAnimationFrame(
                  animateCounter
                );

              }

            }


            requestAnimationFrame(
              animateCounter
            );

          }

        });

      },
      {
        threshold: 0.6
      }
    );


  counters.forEach(
    counter =>
      counterObserver.observe(counter)
  );


  /* =========================================================
     REVEAL ANIMATIONS
     ========================================================= */

  const revealElements = [
    ...document.querySelectorAll(
      ".section-heading, " +
      ".timeline-item, " +
      ".project-card, " +
      ".toolkit-details, " +
      ".contact-copy, " +
      ".brief-form"
    )
  ];


  revealElements.forEach(
    element =>
      element.classList.add("reveal")
  );


  const revealObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "visible"
            );


            revealObserver.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.08
      }
    );


  revealElements.forEach(
    element =>
      revealObserver.observe(element)
  );


  /* =========================================================
     =========================================================
        TOWER CRANE PROJECT INTERACTION
     =========================================================
     ========================================================= */

  const craneStage =
    document.getElementById(
      "crane-stage"
    );


  const projectCards = [
    ...document.querySelectorAll(
      ".project-card"
    )
  ];


  const craneBoom =
    document.getElementById(
      "crane-boom"
    );


  const craneTrolley =
    document.getElementById(
      "crane-trolley"
    );


  const craneCable =
    document.getElementById(
      "crane-cable"
    );


  const craneStatus =
    document.getElementById(
      "crane-status"
    );


  let selectedCard = null;

  let craneIsLifting = false;


  /* ---------------------------------------------------------
     Move crane to selected card
     --------------------------------------------------------- */

  function moveCraneToCard(card) {

    if (
      !craneStage ||
      craneIsLifting
    ) {
      return;
    }


    const stageRect =
      craneStage.getBoundingClientRect();


    const cardRect =
      card.getBoundingClientRect();


    const cardCenter =
      cardRect.left +
      cardRect.width / 2 -
      stageRect.left;


    const trolleyX =
      Math.max(
        90,
        Math.min(
          stageRect.width * 0.84,
          cardCenter
        )
      );


    const craneBaseX =
      stageRect.width * 0.11;


    const distance =
      trolleyX -
      craneBaseX;


    const angle =
      Math.max(
        -7,
        Math.min(
          7,
          Math.atan2(
            cardRect.top -
              stageRect.top -
              35,
            distance
          ) *
          180 /
          Math.PI *
          0.15
        )
      );


    craneTrolley.style.left =
      `${trolleyX}px`;


    craneCable.style.left =
      `${trolleyX + 6}px`;


    craneCable.style.height =
      `${Math.max(
        130,
        cardRect.top -
          stageRect.top -
          45
      )}px`;


    craneBoom.style.transform =
      `rotate(${angle}deg)`;


    const projectNumber =
      String(
        projectCards.indexOf(card) + 1
      ).padStart(2, "0");


    craneStatus.textContent =
      `CRANE / LOAD ${projectNumber}`;

  }


  /* ---------------------------------------------------------
     Project hover / focus
     --------------------------------------------------------- */

  projectCards.forEach(card => {

    card.addEventListener(
      "pointerenter",
      () => {

        if (!craneIsLifting) {

          moveCraneToCard(card);

        }

      }
    );


    card.addEventListener(
      "focus",
      () => {

        if (!craneIsLifting) {

          moveCraneToCard(card);

        }

      }
    );


    card.addEventListener(
      "click",
      () => {

        liftProject(card);

      }
    );

  });


  /* ---------------------------------------------------------
     Mouse movement across crane stage
     --------------------------------------------------------- */

  craneStage?.addEventListener(
    "pointermove",
    event => {

      if (craneIsLifting) {
        return;
      }


      const stageRect =
        craneStage.getBoundingClientRect();


      const mouseX =
        (
          event.clientX -
          stageRect.left
        ) /
        stageRect.width;


      const clampedX =
        Math.max(
          0.12,
          Math.min(
            0.88,
            mouseX
          )
        );


      const trolleyX =
        clampedX *
        stageRect.width;


      craneTrolley.style.left =
        `${trolleyX}px`;


      craneCable.style.left =
        `${trolleyX + 6}px`;


      const boomRotation =
        (clampedX - 0.5) * 6;


      craneBoom.style.transform =
        `rotate(${boomRotation}deg)`;

    }
  );


  craneStage?.addEventListener(
    "pointerleave",
    () => {

      if (!craneIsLifting) {

        craneStatus.textContent =
          "CRANE / STANDBY";

      }

    }
  );


  /* =========================================================
     PROJECT MODAL
     ========================================================= */

  const modal =
    document.getElementById(
      "project-modal"
    );


  const modalTitle =
    document.getElementById(
      "modal-title"
    );


  const modalDescription =
    document.getElementById(
      "modal-description"
    );


  const modalCode =
    document.getElementById(
      "modal-code"
    );


  const modalStats =
    document.getElementById(
      "modal-stats"
    );


  const modalRole =
    document.getElementById(
      "modal-role"
    );


  /* ---------------------------------------------------------
     Project information
     --------------------------------------------------------- */

  const projectData = {

    warehouse: {

      code: "PROJECT / 01",

      title:
        "Katoen Natie Warehouse",

      description:
        "A major warehouse project involving structural and construction coordination, with focus on translating engineering requirements into buildable site outcomes.",

      stats: [

        [
          "DURATION",
          "12 months"
        ],

        [
          "PROJECT",
          "$40M"
        ],

        [
          "TYPE",
          "Warehouse"
        ]

      ],

      role:
        "Structural aspects, project coordination and construction delivery support."

    },


    bendemeer: {

      code: "PROJECT / 02",

      title:
        "A&A at 80 Bendemeer Road",

      description:
        "An additions and alterations project requiring careful coordination between existing conditions, new works and construction sequencing.",

      stats: [

        [
          "DURATION",
          "10 months"
        ],

        [
          "PROJECT",
          "$25M"
        ],

        [
          "TYPE",
          "A&A"
        ]

      ],

      role:
        "Project management, coordination and structural/construction interface."

    },


    bayshore: {

      code: "PROJECT / 03",

      title:
        "T310 Bayshore MRT Station",

      description:
        "Infrastructure project exposure involving construction coordination and delivery within a technically complex MRT environment.",

      stats: [

        [
          "DURATION",
          "8 months"
        ],

        [
          "PROJECT",
          "$15M"
        ],

        [
          "TYPE",
          "MRT"
        ]

      ],

      role:
        "Construction coordination, project delivery and digital workflow exposure."

    }

  };


  /* =========================================================
     OPEN PROJECT MODAL
     ========================================================= */

  function openProjectModal(
    projectKey
  ) {

    const project =
      projectData[projectKey];


    if (
      !project ||
      !modal
    ) {
      return;
    }


    modalCode.textContent =
      project.code;


    modalTitle.textContent =
      project.title;


    modalDescription.textContent =
      project.description;


    modalRole.textContent =
      project.role;


    modalStats.innerHTML =
      project.stats
        .map(
          stat => `
            <div class="modal-stat">

              <small class="mono">
                ${stat[0]}
              </small>

              <strong>
                ${stat[1]}
              </strong>

            </div>
          `
        )
        .join("");


    modal.classList.add("open");


    modal.setAttribute(
      "aria-hidden",
      "false"
    );


    body.classList.add(
      "modal-open"
    );

  }


  /* =========================================================
     CLOSE PROJECT MODAL
     ========================================================= */

  function closeProjectModal() {

    if (!modal) {
      return;
    }


    modal.classList.remove(
      "open"
    );


    modal.setAttribute(
      "aria-hidden",
      "true"
    );


    body.classList.remove(
      "modal-open"
    );


    craneIsLifting =
      false;


    projectCards.forEach(
      card => {

        card.classList.remove(
          "is-lifted"
        );


        card.classList.remove(
          "is-hooked"
        );


        card.style.removeProperty(
          "transform"
        );


        card.style.removeProperty(
          "opacity"
        );

      }
    );


    craneStatus.textContent =
      "CRANE / STANDBY";


    craneCable.style.height =
      "200px";

  }


  /* =========================================================
     LIFT PROJECT
     ========================================================= */

  function liftProject(card) {

    if (
      craneIsLifting ||
      !craneStage
    ) {
      return;
    }


    craneIsLifting =
      true;


    selectedCard =
      card;


    const stageRect =
      craneStage.getBoundingClientRect();


    const cardRect =
      card.getBoundingClientRect();


    const cardCenter =
      cardRect.left +
      cardRect.width / 2 -
      stageRect.left;


    /* ---------------------------------------------------------
       Move crane directly above project
       --------------------------------------------------------- */

    craneTrolley.style.left =
      `${cardCenter}px`;


    craneCable.style.left =
      `${cardCenter + 6}px`;


    craneCable.style.height =
      `${Math.max(
        80,
        cardRect.top -
          stageRect.top -
          45
      )}px`;


    card.classList.add(
      "is-hooked"
    );


    craneStatus.textContent =
      "CRANE / HOOK ENGAGED";


    /* ---------------------------------------------------------
       Small delay before lifting
       --------------------------------------------------------- */

    setTimeout(
      () => {

        card.classList.add(
          "is-lifted"
        );


        const horizontalMovement =
          stageRect.width / 2 -
          cardCenter;


        const verticalMovement =
          -(
            cardRect.top -
            stageRect.top
          ) -
          cardRect.height -
          55;


        card.style.transform =
          `
            translate(
              ${horizontalMovement}px,
              ${verticalMovement}px
            )
            rotate(-2deg)
            scale(.92)
          `;


        craneCable.style.height =
          "55px";


        craneStatus.textContent =
          "CRANE / LIFTING";

      },
      180
    );


    /* ---------------------------------------------------------
       Open project information
       --------------------------------------------------------- */

    setTimeout(
      () => {

        card.style.opacity =
          "0";


        craneStatus.textContent =
          "CRANE / LOAD SECURED";


        openProjectModal(
          card.dataset.project
        );

      },
      1050
    );

  }


  /* =========================================================
     MODAL EVENTS
     ========================================================= */

  document
    .querySelectorAll(
      "[data-close-modal]"
    )
    .forEach(element => {

      element.addEventListener(
        "click",
        event => {

          /*
             If the user clicks the
             "Discuss a Project" button,
             close the modal first.
          */

          closeProjectModal();

        }
      );

    });


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        modal?.classList.contains("open")
      ) {

        closeProjectModal();

      }

    }
  );


  /* =========================================================
     TOOLKIT INTERACTION
     ========================================================= */

  const orbit =
    document.getElementById(
      "toolkit-orbit"
    );


  const toolNodes =
    document.querySelectorAll(
      ".tool-node"
    );


  const toolDetails =
    document.querySelectorAll(
      ".tool-detail"
    );


  function activateTool(
    toolName
  ) {

    toolNodes.forEach(
      node => {

        node.classList.toggle(
          "active",
          node.dataset.tool ===
          toolName
        );

      }
    );


    toolDetails.forEach(
      detail => {

        detail.classList.toggle(
          "active",
          detail.dataset.detail ===
          toolName
        );

      }
    );

  }


  toolNodes.forEach(
    node => {

      node.addEventListener(
        "mouseenter",
        () => {

          activateTool(
            node.dataset.tool
          );

        }
      );


      node.addEventListener(
        "focus",
        () => {

          activateTool(
            node.dataset.tool
          );

        }
      );


      node.addEventListener(
        "click",
        () => {

          activateTool(
            node.dataset.tool
          );

        }
      );

    }
  );


  /* ---------------------------------------------------------
     Toolkit mouse parallax
     --------------------------------------------------------- */

  orbit?.addEventListener(
    "pointermove",
    event => {

      const rect =
        orbit.getBoundingClientRect();


      const x =
        (
          event.clientX -
          rect.left
        ) /
        rect.width -
        0.5;


      const y =
        (
          event.clientY -
          rect.top
        ) /
        rect.height -
        0.5;


      orbit.style.setProperty(
        "--orbit-rotation",
        `${x * 4 - y * 2}deg`
      );

    }
  );


  /* =========================================================
     CONTACT FORM
     ========================================================= */

  const contactForm =
    document.getElementById(
      "brief-form"
    );


  const formSuccess =
    document.getElementById(
      "form-success"
    );


  contactForm?.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const formData =
        new FormData(
          contactForm
        );


      const name =
        formData.get("name");


      const email =
        formData.get("email");


      const project =
        formData.get("project");


      const message =
        formData.get("message");


      const subject =
        encodeURIComponent(
          `Project enquiry — ${project}`
        );


      const emailBody = [

        "Hi Davier,",

        "",

        `Name: ${name}`,

        `Email: ${email}`,

        `Project type: ${project}`,

        "",

        "Brief:",

        message,

        "",

        "Sent from daviertangr.github.io portfolio."

      ].join("\n");


      window.location.href =
        `mailto:daviertgr+collab@gmail.com` +
        `?subject=${subject}` +
        `&body=${encodeURIComponent(
          emailBody
        )}`;


      if (formSuccess) {

        formSuccess.textContent =
          "Opening your email client…";

      }

    }
  );


  /* =========================================================
     SMOOTH ANCHOR SCROLL
     ========================================================= */

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(anchor => {

      anchor.addEventListener(
        "click",
        event => {

          const target =
            document.querySelector(
              anchor.getAttribute("href")
            );


          if (!target) {
            return;
          }


          event.preventDefault();


          const targetPosition =
            target.getBoundingClientRect()
              .top +
            window.scrollY;


          window.scrollTo({

            top:
              targetPosition,

            behavior:
              "smooth"

          });

        }
      );

    });

});