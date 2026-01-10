document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Menu ---
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // --- Accordion ---
  const accHeaders = document.querySelectorAll('.accordion-header');
  accHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      const icon = item.querySelector('.acc-icon');

      // Close others
      document.querySelectorAll('.accordion-item').forEach((i) => {
        if (i !== item) {
          const b = i.querySelector('.accordion-body');
          if (b) b.style.display = 'none';
          const ic = i.querySelector('.acc-icon');
          if (ic) ic.innerHTML = '&plus;';
          i.classList.remove('active');
        }
      });

      // Toggle current
      if (body.style.display === 'none' || !body.style.display) {
        body.style.display = 'block';
        icon.innerHTML = '&minus;';
        item.classList.add('active');
      } else {
        body.style.display = 'none';
        icon.innerHTML = '&plus;';
        item.classList.remove('active');
      }
    });
  });

  // --- Product Gallery ---
  const mainImg = document.getElementById('main-img');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const dots = document.querySelectorAll('.g-dot');
  const thumbs = document.querySelectorAll('.thumb-item');

  // Collect all image sources from thumbs for the gallery
  const images = Array.from(thumbs).map(
    (thumb) => thumb.querySelector('img').src
  );
  let currentIndex = 0;

  function updateGallery(index) {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    currentIndex = index;

    // Update Main Image
    mainImg.src = images[currentIndex];

    // Update Dots
    dots.forEach((dot, i) => {
      if (i === currentIndex && i < dots.length) dot.classList.add('active');
      // Safety check if dots are fewer than images
      else dot.classList.remove('active');
    });

    // Update Thumbs
    thumbs.forEach((thumb, i) => {
      if (i === currentIndex) thumb.classList.add('active');
      else thumb.classList.remove('active');
    });
  }

  if (prevBtn)
    prevBtn.addEventListener('click', () => updateGallery(currentIndex - 1));
  if (nextBtn)
    nextBtn.addEventListener('click', () => updateGallery(currentIndex + 1));

  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      if (!isNaN(index)) updateGallery(index);
    });
  });

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => updateGallery(index));
  });

  // --- Stats Counter logic replaced by generic observer below ---

  // --- Cart & Plan Logic ---
  // Initialize Radio Selections
  const fragOptions = document.querySelectorAll('.frag-option');
  fragOptions.forEach((opt) => {
    opt.addEventListener('click', function () {
      // Find parent group (grid)
      const grid = this.closest('.fragrance-grid');
      // Remove selected from siblings
      grid.querySelectorAll('.frag-option').forEach((sib) => {
        sib.classList.remove('selected');
        sib.querySelector('.frag-dot').classList.remove('active');
      });
      // Add selected to clicked
      this.classList.add('selected');
      this.querySelector('.frag-dot').classList.add('active');

      updateAddToCart();
    });
  });

  // Ensure initial state logic runs
  updateAddToCart();

  // --- Reveal Animation Observer ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  // --- Stats Counter Generic Observer ---
  // Observe any section containing counters (like stats-banner)
  const statsSections = document.querySelectorAll('.stats-banner, .hero-stats');
  if (statsSections.length > 0) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Animate counters inside this specific section
          const sectionCounters = entry.target.querySelectorAll('.counter');
          sectionCounters.forEach((counter) => {
            const speed = 200;
            const updateCount = () => {
              const target = +counter.getAttribute('data-target');
              const count = +counter.innerText;
              const inc = target / speed;
              if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
              } else {
                counter.innerText = target;
                if (target === 20000) counter.innerText = '20k+';
              }
            };
            updateCount();
          });
          observer.unobserve(entry.target);
        }
      });
    });
    statsSections.forEach((section) => statsObserver.observe(section));
  }
});

// Exposed function for HTML onclick
function selectPlan(plan) {
  // Toggle UI - Active Class on Card
  document.getElementById('plan-single').classList.remove('active');
  document.getElementById('plan-double').classList.remove('active');

  // Hide all details first
  const detailsSingle = document.getElementById('details-single');
  const detailsDouble = document.getElementById('details-double');
  if (detailsSingle) detailsSingle.style.display = 'none';
  if (detailsDouble) detailsDouble.style.display = 'none';

  // Custom Radios Reset
  document
    .querySelectorAll('.custom-radio-outer')
    .forEach((el) => el.classList.remove('active'));
  document
    .querySelectorAll('.custom-radio-inner')
    .forEach((el) => (el.style.display = 'none'));

  // Activate Selected
  const activePlan = document.getElementById('plan-' + plan);
  if (activePlan) {
    activePlan.classList.add('active');

    // Toggle Radio
    const radioOuter = activePlan.querySelector('.custom-radio-outer');
    const radioInner = activePlan.querySelector('.custom-radio-inner');
    if (radioOuter) radioOuter.classList.add('active');
    if (radioInner) radioInner.style.display = 'block';

    // Show Details
    const activeDetails = document.getElementById('details-' + plan);
    if (activeDetails) activeDetails.style.display = 'block';
  }

  // Update Cart logic
  updateAddToCart();
}

function selectFragrance(element, name) {
  // Find parent grid
  const grid = element.closest('.fragrance-grid');
  if (!grid) return;

  // Remove selected from siblings
  grid.querySelectorAll('.frag-option').forEach((sib) => {
    sib.classList.remove('selected');
    const dot = sib.querySelector('.frag-dot');
    if (dot) dot.classList.remove('active');
  });

  // Add selected to clicked
  element.classList.add('selected');
  const dot = element.querySelector('.frag-dot');
  if (dot) dot.classList.add('active');

  updateAddToCart();
}

function updateAddToCart() {
  let selectedPlan = '';
  if (
    document.getElementById('plan-single') &&
    document.getElementById('plan-single').classList.contains('active')
  ) {
    selectedPlan = 'single';
  } else {
    selectedPlan = 'double';
  }

  const activeDetails = document.getElementById('details-' + selectedPlan);
  if (!activeDetails) return;

  // Get selected fragrances within active details
  const selectedFrags = activeDetails.querySelectorAll(
    '.frag-option.selected .frag-name'
  );
  let fragNames = [];
  selectedFrags.forEach((span) => fragNames.push(span.innerText));

  if (fragNames.length === 0) fragNames.push('None');

  // Find the button specific to this active section
  const cartBtn = activeDetails.querySelector('.submit-cart-btn');
  if (cartBtn) {
    cartBtn.setAttribute('data-plan', selectedPlan);
    cartBtn.setAttribute('data-frags', fragNames.join(','));

    // Update Text based on Plan
    let price = selectedPlan === 'single' ? '$33.00' : '$55.00';
    // Clean formatting for multiple items
    let fragDisplay = fragNames.join(' + ');
    cartBtn.innerText = `Add '${fragDisplay}' to Cart - ${price}`;
  }
}
