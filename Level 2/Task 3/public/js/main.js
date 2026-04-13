/* ═══════════════════════════════════════════════════════════════
   Aether — Main JavaScript
   Dark mode, mobile menu, scroll effects, animations
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Dark Mode Toggle ────────────────────────────────────────
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Initialize theme from localStorage or system preference
  function initTheme() {
    const saved = localStorage.getItem('Aether-theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  initTheme();

  themeToggle?.addEventListener('click', () => {
    // Add smooth transition class
    html.classList.add('transitioning');

    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('Aether-theme', 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem('Aether-theme', 'dark');
    }

    // Remove transition class after animation
    setTimeout(() => html.classList.remove('transitioning'), 600);

    // Add a subtle rotation to the toggle button
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      themeToggle.style.transform = '';
    }, 500);
  });

  // ─── Mobile Menu ─────────────────────────────────────────────
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = mobileMenuBtn?.querySelector('.hamburger-icon');
  const closeIcon = mobileMenuBtn?.querySelector('.close-icon');

  mobileMenuBtn?.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');

    if (isOpen) {
      mobileMenu.classList.add('hidden');
      hamburgerIcon?.classList.remove('hidden');
      closeIcon?.classList.add('hidden');
    } else {
      mobileMenu.classList.remove('hidden');
      hamburgerIcon?.classList.add('hidden');
      closeIcon?.classList.remove('hidden');
    }
  });

  // Close mobile menu on link click
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      hamburgerIcon?.classList.remove('hidden');
      closeIcon?.classList.add('hidden');
    });
  });

  // ─── Navbar Scroll Effect ───────────────────────────────────
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar?.classList.add('shadow-md', 'shadow-gray-900/5', 'dark:shadow-black/20');
    } else {
      navbar?.classList.remove('shadow-md', 'shadow-gray-900/5', 'dark:shadow-black/20');
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // ─── Intersection Observer for Scroll Animations ─────────────
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        entry.target.style.opacity = '1';
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with data-animate attribute
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = '0';
    scrollObserver.observe(el);
  });

  // ─── Progress Bar Animation on Scroll ────────────────────────
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.style.width;
        bar.style.width = '0%';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            bar.style.width = width;
          });
        });
        progressObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[style*="width:"]').forEach(bar => {
    if (bar.classList.contains('rounded-full') && bar.parentElement?.classList.contains('rounded-full')) {
      progressObserver.observe(bar);
    }
  });

  // ─── Keyboard Navigation Enhancement ────────────────────────
  document.addEventListener('keydown', (e) => {
    // Escape closes mobile menu
    if (e.key === 'Escape') {
      mobileMenu?.classList.add('hidden');
      hamburgerIcon?.classList.remove('hidden');
      closeIcon?.classList.add('hidden');
    }

    // 'D' toggles dark mode (when not typing)
    if (e.key === 'd' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
      themeToggle?.click();
    }
  });

  // ─── Smooth hover sound feedback (optional visual) ──────────
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.willChange = 'transform, box-shadow';
    });
    el.addEventListener('mouseleave', () => {
      el.style.willChange = 'auto';
    });
  });

  // ─── Feature Modal Logic ────────────────────────────────────
  const modal = document.getElementById('feature-modal');
  const modalContent = modal?.querySelector('.modal-content');
  const modalOverlay = modal?.querySelector('.modal-overlay');
  const modalCloseBtns = modal?.querySelectorAll('.modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalDetails = document.getElementById('modal-details');
  const modalIconWrapper = document.getElementById('modal-icon-wrapper');

  window.openFeatureModal = function(title, details, iconSvg) {
    if (!modal) return;

    // Set content
    modalTitle.textContent = title;
    modalDetails.textContent = details;
    modalIconWrapper.innerHTML = iconSvg;

    // Show modal container
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Trigger animations after a small delay
    requestAnimationFrame(() => {
      modalOverlay.classList.replace('opacity-0', 'opacity-100');
      modalContent.classList.replace('scale-90', 'scale-100');
      modalContent.classList.replace('opacity-0', 'opacity-100');
      modalContent.classList.replace('translate-y-4', 'translate-y-0');
    });

    // Disable scroll
    document.body.style.overflow = 'hidden';
  };

  const closeFeatureModal = () => {
    modalOverlay.classList.replace('opacity-100', 'opacity-0');
    modalContent.classList.replace('scale-100', 'scale-90');
    modalContent.classList.replace('opacity-100', 'opacity-0');
    modalContent.classList.replace('translate-y-0', 'translate-y-4');

    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }, 300);
  };

  modalCloseBtns?.forEach(btn => btn.addEventListener('click', closeFeatureModal));
  modalOverlay?.addEventListener('click', closeFeatureModal);

  // ─── Console branding ───────────────────────────────────────
  console.log(
    '%c⚡ Aether %cv2.0',
    'font-size: 24px; font-weight: bold; color: #7c3aed; font-family: Inter, sans-serif;',
    'font-size: 14px; color: #6366f1; font-family: Inter, sans-serif;'
  );
  console.log('%cThe Modern Workspace', 'font-size: 12px; color: #9ca3af; font-family: Inter, sans-serif;');

})();
