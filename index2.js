const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-links a');
const revealEls = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('.counter');
const readMoreButton = document.querySelector('.text-toggle');
const readMorePanel = document.querySelector('.read-more-panel');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevButton = document.querySelector('.slider-btn.prev');
const nextButton = document.querySelector('.slider-btn.next');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox?.querySelector('img');
const lightboxTitle = lightbox?.querySelector('.lightbox-title');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-nav.prev');
const lightboxNext = document.querySelector('.lightbox-nav.next');
const galleryItems = document.querySelectorAll('.gallery-item');
const form = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');

const setHeaderState = () => {
  if (window.scrollY > 24) {
    header?.classList.add('nav-scrolled');
  } else {
    header?.classList.remove('nav-scrolled');
  }
};

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

window.addEventListener('scroll', setHeaderState);
setHeaderState();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => observer.observe(el));

const animateCounter = (element) => {
  const target = Number(element.dataset.target || 0);
  const suffix = element.dataset.suffix || '';
  const duration = 1200;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(progress * target);
    element.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.textContent = `${target}${suffix}`;
    }
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.45 }
);

counters.forEach((counter) => counterObserver.observe(counter));

if (readMoreButton && readMorePanel) {
  readMoreButton.addEventListener('click', () => {
    const isExpanded = readMorePanel.classList.toggle('active');
    readMoreButton.setAttribute('aria-expanded', String(isExpanded));
    readMoreButton.textContent = isExpanded ? 'Read Less' : 'Read More';
  });
}

let testimonialIndex = 0;

const showTestimonial = (index) => {
  testimonialCards.forEach((card, i) => {
    card.classList.toggle('active', i === index);
  });
};

if (testimonialCards.length) {
  prevButton?.addEventListener('click', () => {
    testimonialIndex = (testimonialIndex - 1 + testimonialCards.length) % testimonialCards.length;
    showTestimonial(testimonialIndex);
  });

  nextButton?.addEventListener('click', () => {
    testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
    showTestimonial(testimonialIndex);
  });

  setInterval(() => {
    testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
    showTestimonial(testimonialIndex);
  }, 5000);
}

let galleryImages = [];

galleryItems.forEach((item) => {
  galleryImages.push({
    src: item.dataset.image,
    title: item.dataset.title || 'Campus gallery image'
  });

  item.addEventListener('click', () => {
    const index = galleryImages.findIndex((image) => image.src === item.dataset.image);
    openLightbox(index);
  });
});

const openLightbox = (index) => {
  if (!lightbox || !lightboxImg || !lightboxTitle) return;
  lightboxImg.src = galleryImages[index].src;
  lightboxTitle.textContent = galleryImages[index].title;
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightboxPrev) {
  lightboxPrev.addEventListener('click', () => {
    const currentIndex = galleryImages.findIndex((image) => image.src === lightboxImg?.src);
    const index = currentIndex > 0 ? currentIndex - 1 : galleryImages.length - 1;
    openLightbox(index);
  });
}

if (lightboxNext) {
  lightboxNext.addEventListener('click', () => {
    const currentIndex = galleryImages.findIndex((image) => image.src === lightboxImg?.src);
    const index = currentIndex < galleryImages.length - 1 ? currentIndex + 1 : 0;
    openLightbox(index);
  });
}

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (!lightbox || !lightbox.classList.contains('active')) return;

  if (event.key === 'Escape') {
    closeLightbox();
  }

  if (event.key === 'ArrowRight') {
    const currentIndex = galleryImages.findIndex((image) => image.src === lightboxImg?.src);
    const index = currentIndex < galleryImages.length - 1 ? currentIndex + 1 : 0;
    openLightbox(index);
  }

  if (event.key === 'ArrowLeft') {
    const currentIndex = galleryImages.findIndex((image) => image.src === lightboxImg?.src);
    const index = currentIndex > 0 ? currentIndex - 1 : galleryImages.length - 1;
    openLightbox(index);
  }
});

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();

    if (!name || !email || !message) {
      formStatus.textContent = 'Please complete the required fields before submitting.';
      formStatus.style.color = '#c73a3a';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formStatus.textContent = 'Please enter a valid email address.';
      formStatus.style.color = '#c73a3a';
      return;
    }

    formStatus.textContent = 'Your message has been prepared successfully. Connect the form to a backend to send emails.';
    formStatus.style.color = '#1d8a5a';
    form.reset();
  });
}
