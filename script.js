document.getElementById('year').textContent = new Date().getFullYear();

//typewriter effect for intro text
const aboutText = [
  "Hey there!",
  "I'm Davier!",
  "A passionate Civil Engineer about construction, innovation, and problem-solving.",
  "Welcome to my portfolio!",
];

let aboutIndex = 0;
let charIndex = 0;
const aboutEl = document.getElementById("aboutme");

function type() {
  if (!aboutEl) return;
  if (charIndex < aboutText[aboutIndex].length) {
    aboutEl.textContent += aboutText[aboutIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, 80);
  } else {
    setTimeout(erase, 1500);
  }
}

function erase() {
  if (charIndex > 0) {
    aboutEl.textContent = aboutText[aboutIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, 40);
  } else {
    aboutIndex = (aboutIndex + 1) % aboutText.length;
    setTimeout(type, 300);
  }
}
type();


// Mobile menu toggle (hamburger <-> slide-down nav)
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the mobile menu automatically once a link is tapped
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}


// Highlight active dot in the side dot-nav as the user scrolls
const sections = document.querySelectorAll("section");
const dotspage = document.querySelectorAll(".dot-nav a");

function updateActiveDot() {
  let current = "";
  sections.forEach(sec => {
    const top = window.scrollY;
    if (top >= sec.offsetTop - window.innerHeight / 2) {
      current = sec.getAttribute("id");
    }
  });
  dotspage.forEach(dot => {
    dot.classList.remove("active");
    if (dot.getAttribute("href") === `#${current}`) {
      dot.classList.add("active");
    }
  });
}
window.addEventListener("scroll", updateActiveDot);
updateActiveDot();


// Fade-in-up reveal animation for sections as they enter the viewport
const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -10% 0px"
  });

  revealEls.forEach(el => revealObserver.observe(el));
}
