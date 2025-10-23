document.getElementById('year').textContent = new Date().getFullYear();

//typewriter effect for intro text
const aboutText = [
  "Hello!",
  "I'm Davier.",
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




// Menu toggle script for mobile view
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  mobileMenu.classList.toggle('active');
});


// Project slider script
const slides = document.querySelector('.slides');
const slideItems = document.querySelectorAll('.project-card');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let index = 0;

function showSlide(i){
if(i < 0) index = slideItems.length - 1;
else if(i >= slideItems.length) index = 0;
else index = i;
slides.style.transform = `translateX(-${index * 100}%)`;
}
prevBtn.addEventListener('click',()=>showSlide(index-1));
nextBtn.addEventListener('click',()=>showSlide(index+1));
setInterval(()=>showSlide(index+1),6000);

// Highlight active dot
const sections = document.querySelectorAll("section");
const dotspage = document.querySelectorAll(".dot-nav a");
window.addEventListener("scroll", () => {
let current = "";
sections.forEach(sec => {
const top = window.scrollY;
if(top >= sec.offsetTop - window.innerHeight/2){
    current = sec.getAttribute("id");
}
});
dotspage.forEach(dot => {
dot.classList.remove("active");
if(dot.getAttribute("href") === `#${current}`){
    dot.classList.add("active");
}
});
});



//Java script for timeline interaction
const yearDisplay = document.getElementById('yearDisplay');
const yearDesc = document.getElementById('yearDesc');
const dots = document.querySelectorAll('.timeline-dot');
const progress = document.getElementById('timelineProgress');
const years = document.querySelectorAll('.timeline-year');
const totalSteps = dots.length - 1;

const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
const el = entry.target;
const year = el.dataset.year;
const text = el.dataset.text;
const dotId = el.dataset.dot;

yearDisplay.style.opacity = 0;
yearDesc.style.opacity = 0;
setTimeout(() => {
    yearDisplay.textContent = year;
    yearDesc.textContent = text;
    yearDisplay.style.opacity = 1;
    yearDesc.style.opacity = 1;
}, 200);

dots.forEach(dot => dot.classList.remove('active'));
document.getElementById(dotId)?.classList.add('active');

const activeIndex = Array.from(dots).findIndex(dot => dot.id === dotId);
progress.style.width = `${(activeIndex / totalSteps) * 100}%`;
}
});
}, {
root: null,
threshold: 0.5,
rootMargin: "-80px 0px -20% 0px"
});

years.forEach(y => observer.observe(y));
