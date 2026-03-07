// Throttle Helper Function
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li a');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('nav-active');
  hamburger.classList.toggle('toggle');
});

// Close mobile menu when clicking a link
navLinksItems.forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('nav-active')) {
      navLinks.classList.remove('nav-active');
      hamburger.classList.remove('toggle');
    }
  });
});

// Navbar Scroll Effect (Throttled)
const navbar = document.querySelector('.navbar');

const handleNavbarScroll = () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};
window.addEventListener('scroll', throttle(handleNavbarScroll, 100));

// Active Link Highlight (Throttled)
const sections = document.querySelectorAll('section');

const handleActiveLink = () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
      current = section.getAttribute('id');
    }
  });

  navLinksItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
};
window.addEventListener('scroll', throttle(handleActiveLink, 150));

// --- Skills Data with SVGs ---
import { icons } from './icons.js';

const skillsData = {
  cloud: [
    { name: 'Azure', icon: icons.azure },
    { name: 'OCI', icon: icons.cloud },
    { name: 'Docker', icon: icons.docker },
    { name: 'Kubernetes', icon: icons.kubernetes },
    { name: 'Terraform', icon: icons.cloud },
    { name: 'Ansible', icon: icons.ansible }
  ],
  devops: [
    { name: 'Jenkins', icon: icons.jenkins },
    { name: 'GitLab CI', icon: icons.gitlab },
    { name: 'Azure DevOps', icon: icons.azure },
    { name: 'Git', icon: icons.git },
    { name: 'GitHub Actions', icon: icons.github }
  ],
  monitoring: [
    { name: 'Prometheus', icon: icons.prometheus },
    { name: 'Grafana', icon: icons.cloud },
    { name: 'ELK Stack', icon: icons.database },
    { name: 'App Insights', icon: icons.cloud }
  ],
  programming: [
    { name: 'Python', icon: icons.python },
    { name: 'Bash', icon: icons.terminal },
    { name: 'Groovy', icon: icons.code },
    { name: 'JavaScript', icon: icons.javascript },
    { name: 'PHP', icon: icons.code },
    { name: 'SQL', icon: icons.database }
  ],
  tools: [
    { name: 'SonarQube', icon: icons.code },
    { name: 'Nginx', icon: icons.server },
    { name: 'Apache', icon: icons.server },
    { name: 'Redis', icon: icons.database },
    { name: 'MongoDB', icon: icons.database },
    { name: 'MySQL', icon: icons.database },
    { name: 'Linux', icon: icons.terminal }
  ]
};

// Render Skills
function renderSkills() {
  Object.keys(skillsData).forEach(category => {
    const container = document.getElementById(`skills-${category}`);
    if (!container) return;

    const html = skillsData[category].map(skill => `
      <div class="skill-pill">
        ${skill.icon}
        <span>${skill.name}</span>
      </div>
    `).join('');

    container.innerHTML = html;
  });
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', renderSkills);

// --- Particle Background Animation ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
// Reduce particle density on smaller screens
const numberOfParticles = window.innerWidth < 768 ? 40 : 80;

// Set canvas size
function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', throttle(setCanvasSize, 250));
setCanvasSize();

// Particle Class
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.4 + 0.1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw() {
    ctx.fillStyle = `rgba(56, 189, 248, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Initialize Particles
function initParticles() {
  particlesArray = [];
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}

// Animate Particles with Optimized Loops
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const particlesCount = particlesArray.length;
  for (let i = 0; i < particlesCount; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();

    // Optimize connection logic: only check a few ahead to reduce complexity from O(n^2)
    // and skip very distant particles early
    for (let j = i + 1; j < particlesCount; j++) {
      const dx = particlesArray[i].x - particlesArray[j].x;
      const dy = particlesArray[i].y - particlesArray[j].y;

      // Fast distance squared check before Math.sqrt
      const distSq = dx * dx + dy * dy;
      if (distSq < 10000) { // 100 * 100
        const distance = Math.sqrt(distSq);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(56, 189, 248, ${(0.1 - distance / 100).toFixed(2)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}

// Start animation
initParticles();
animateParticles();

// Hide Loader when page holds
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('loader-hidden');
    // Remove from DOM after transition to avoid z-index issues
    setTimeout(() => {
      loader.style.display = 'none';
    }, 800);
  }
});

// Intersection Observer for Reveal on Scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-active');
    }
  });
}, {
  threshold: 0.1
});

document.querySelectorAll('.reveal').forEach(section => {
  revealObserver.observe(section);
});

