// ===== MOBILE NAVIGATION TOGGLE =====
const initMobileNav = () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }
};

// ===== SLIDER FUNCTIONALITY =====
class ProjectSlider {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.slide');
    this.totalSlides = this.slides.length;
    this.sliderTrack = document.querySelector('.slider-track');
    this.prevButton = document.querySelector('.slider-arrow-left');
    this.nextButton = document.querySelector('.slider-arrow-right');
    
    if (this.slides.length > 0) {
      this.init();
    }
  }

  init() {
    // Add event listeners
    if (this.prevButton && this.nextButton) {
      this.prevButton.addEventListener('click', () => this.prevSlide());
      this.nextButton.addEventListener('click', () => this.nextSlide());
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (this.sliderTrack) {
      this.sliderTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      this.sliderTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe(touchStartX, touchEndX);
      }, { passive: true });
    }

    // Auto-play (optional - uncomment to enable)
    // this.startAutoPlay();
  }

  handleSwipe(startX, endX) {
    if (endX < startX - 50) this.nextSlide();
    if (endX > startX + 50) this.prevSlide();
  }

  updateSlider() {
    const offset = -this.currentSlide * 100;
    if (this.sliderTrack) {
      this.sliderTrack.style.transform = `translateX(${offset}%)`;
    }
    
    // Update active state
    this.slides.forEach((slide, index) => {
      if (index === this.currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateSlider();
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlider();
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.updateSlider();
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

const observeElements = () => {
  const elements = document.querySelectorAll('.project-card, .projects-text-frame, .about-content, .contact-content');
  elements.forEach(element => {
    if (!element.style.animation) {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(element);
    }
  });
};

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
const smoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navHeight = document.querySelector('.main-nav').offsetHeight;
        const targetPosition = target.offsetTop - navHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
};

// ===== PERFORMANCE OPTIMIZATION =====
const optimizeImages = () => {
  const images = document.querySelectorAll('img');
  
  if ('loading' in HTMLImageElement.prototype) {
    images.forEach(img => {
      if (!img.loading) {
        img.loading = 'lazy';
      }
    });
  }
};

// ===== ACTIVE NAV LINK =====
const setActiveNavLink = () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
};

// ===== INITIALIZE ON DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize mobile navigation
  initMobileNav();
  
  // Initialize slider (only on home page)
  const slider = new ProjectSlider();
  
  // Initialize scroll animations
  observeElements();
  
  // Initialize smooth scroll
  smoothScroll();
  
  // Optimize images
  optimizeImages();
  
  // Set active nav link
  setActiveNavLink();
  
  // Add loaded class to body for CSS transitions
  document.body.classList.add('loaded');
  
  console.log('✅ Portfolio initialized successfully');
});

// ===== HANDLE WINDOW RESIZE =====
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Reset slider position on resize
    const slider = document.querySelector('.slider-track');
    if (slider) {
      const currentSlide = document.querySelector('.slide.active');
      if (currentSlide) {
        const slideIndex = Array.from(document.querySelectorAll('.slide')).indexOf(currentSlide);
        slider.style.transform = `translateX(-${slideIndex * 100}%)`;
      }
    }
  }, 250);
});

// ===== PREVENT LAYOUT SHIFT =====
window.addEventListener('load', () => {
  // Calculate and set proper heights after images load
  const sliderWrapper = document.querySelector('.slider-wrapper');
  if (sliderWrapper) {
    const img = sliderWrapper.querySelector('img');
    if (img && img.complete) {
      sliderWrapper.style.minHeight = 'auto';
    }
  }
});

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Preload images for slider
function preloadSliderImages() {
  const slides = document.querySelectorAll('.slide img');
  slides.forEach(img => {
    const newImg = new Image();
    newImg.src = img.src;
  });
}

// Initialize preload
if (document.querySelector('.slider-wrapper')) {
  preloadSliderImages();
}

// Export slider for external access if needed
window.ProjectSlider = ProjectSlider;