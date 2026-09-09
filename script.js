/* ==========================================================================
   GREENSCART - Main JavaScript Application File
   Standard Vanilla JavaScript (No Frameworks / No External Dependencies)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. STICKY HEADER & NAVBAR SCROLL DETECTOR
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('backToTop');

  const handleScroll = () => {
    const scrollPos = window.scrollY;
    
    if (scrollPos > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    if (scrollPos > 400) {
      backToTopBtn?.classList.add('show');
    } else {
      backToTopBtn?.classList.remove('show');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // 2. MOBILE MENU HAMBURGER TOGGLE
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMobileMenu = () => {
    const isActive = mobileToggle?.classList.toggle('active');
    navMenu?.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
    mobileToggle?.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  };

  mobileToggle?.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when a navigation link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu?.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // 3. SMOOTH SCROLLING FOR NAVIGATION LINKS
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 4. ACTIVE SECTION LINK HIGHLIGHTER ON SCROLL
  const sections = document.querySelectorAll('section[id]');
  
  const highlightActiveNav = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navItem = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        navItem?.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', highlightActiveNav, { passive: true });

  // 5. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  const revealElements = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for browsers without IntersectionObserver support
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // 6. ANIMATED COUNTERS FOR FOUNDER SECTION
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let animated = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target') || '0', 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      let count = 0;
      const duration = 2000; // ms
      const increment = Math.ceil(target / (duration / 30));

      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          stat.textContent = target + suffix;
          clearInterval(timer);
        } else {
          stat.textContent = count + suffix;
        }
      }, 30);
    });
  };

  const founderSection = document.getElementById('founder');
  if (founderSection && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animateCounters();
          animated = true;
        }
      });
    }, { threshold: 0.3 });

    counterObserver.observe(founderSection);
  }

  // 7. PARTNER WITH US INTERACTIVE MODAL
  const modalOverlay = document.getElementById('partnerModal');
  const modalCloseBtn = document.getElementById('modalClose');
  const modalOpenBtns = document.querySelectorAll('.open-modal');
  const partnerForm = document.getElementById('partnerForm');

  const openModal = () => {
    modalOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  modalOpenBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  modalCloseBtn?.addEventListener('click', closeModal);

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) {
      closeModal();
    }
  });

  // Interactive Form Submit Feedback
  partnerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = partnerForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending Details...';
      submitBtn.disabled = true;

      setTimeout(() => {
        partnerForm.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem;">
            <div style="width: 60px; height: 60px; background: var(--primary-100); color: var(--primary-800); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h4 style="font-size: 1.5rem; color: var(--primary-950); margin-bottom: 0.5rem;">Partnership Inquiry Received!</h4>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">Thank you for reaching out to Greenscart. Our corporate development team in Madurai will get in touch with you shortly.</p>
            <button class="btn btn-primary" onclick="location.reload()">Done</button>
          </div>
        `;
      }, 1200);
    }
  });

  // Back to top scroll handler
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 8. AUTOMATIC OPENING POPUP MODAL (10-SECOND TIMER & CLOSE LOGIC)
  const openingPopup = document.getElementById('openingPopup');
  const popupCloseBtn = document.getElementById('popupClose');
  let popupTimer = null;

  const closeOpeningPopup = () => {
    if (popupTimer) {
      clearTimeout(popupTimer);
      popupTimer = null;
    }
    openingPopup?.classList.remove('active');
    document.body.style.overflow = '';
  };

  const showOpeningPopup = () => {
    if (!openingPopup) return;
    openingPopup.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Auto-close after exactly 10 seconds (10,000 ms)
    popupTimer = setTimeout(() => {
      closeOpeningPopup();
    }, 10000);
  };

  // Trigger popup shortly after DOM is ready
  setTimeout(showOpeningPopup, 400);

  // Close handlers: Button click, backdrop overlay click, and Escape key
  popupCloseBtn?.addEventListener('click', closeOpeningPopup);

  openingPopup?.addEventListener('click', (e) => {
    if (e.target === openingPopup) {
      closeOpeningPopup();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openingPopup?.classList.contains('active')) {
      closeOpeningPopup();
    }
  });
});
