/* ==========================================================================
   Shefa' Atef Portfolio - Interactive Scripts
   Features: ReactBits-inspired Spotlight, Platform Switcher (App Icon vs Web Fill),
   Lightbox, Mobile Drawer, Toast Notifications, & Scroll Spy
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect & Active section indicator (Scroll Spy)
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking a nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // 3. ReactBits-Style Spotlight Card Effect (Mouse position tracking)
  const spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 4. Dual-Platform Project View Switcher (App Icon Full Contain vs React Web Full Fill)
  const projectMediaWraps = document.querySelectorAll('.project-media-wrap[data-has-dual]');
  projectMediaWraps.forEach(wrap => {
    const switchBtns = wrap.querySelectorAll('.switch-btn');
    const projectImg = wrap.querySelector('.project-img');

    switchBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent lightbox trigger
        const platform = btn.getAttribute('data-platform');
        
        switchBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (platform === 'app') {
          const appSrc = wrap.getAttribute('data-app-src');
          if (appSrc) {
            projectImg.style.opacity = '0.2';
            setTimeout(() => {
              projectImg.src = appSrc;
              projectImg.alt = `${wrap.getAttribute('data-project-name')} Flutter App`;
              projectImg.classList.remove('cover-fit');
              projectImg.classList.add('contain-fit');
              projectImg.style.opacity = '1';
            }, 120);
          }
        } else if (platform === 'web') {
          const webSrc = wrap.getAttribute('data-web-src');
          if (webSrc) {
            projectImg.style.opacity = '0.2';
            setTimeout(() => {
              projectImg.src = webSrc;
              projectImg.alt = `${wrap.getAttribute('data-project-name')} React Website`;
              projectImg.classList.remove('contain-fit');
              projectImg.classList.add('cover-fit');
              projectImg.style.opacity = '1';
            }, 120);
          }
        }
      });
    });
  });

  // 5. Interactive Lightbox Modal for Artworks and Projects
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, title) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxTitle.textContent = title || 'Artwork Preview';
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // Bind all gallery items and project preview images to lightbox
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.getAttribute('data-title') || (img ? img.alt : 'Gallery Image');
      if (img) openLightbox(img.src, title);
    });
  });

  document.querySelectorAll('.project-img').forEach(img => {
    img.addEventListener('click', () => {
      openLightbox(img.src, img.alt || 'Project Preview');
    });
  });

  // 6. Copy to Clipboard with Toast Notification
  const toastNotice = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMsg');
  let toastTimer = null;

  function showToast(message) {
    if (!toastNotice || !toastMsg) return;
    toastMsg.textContent = message;
    toastNotice.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3000);
  }

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const copyVal = btn.getAttribute('data-copy');
      if (copyVal) {
        navigator.clipboard.writeText(copyVal).then(() => {
          showToast(`Copied "${copyVal}" to clipboard!`);
        }).catch(() => {
          showToast(`Copied to clipboard!`);
        });
      }
    });
  });

  // 7. Intersection Observer for Scroll Reveals
  const revealElements = document.querySelectorAll('.spotlight-card, .section-header, .gallery-item, .contact-item-box');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });
});
