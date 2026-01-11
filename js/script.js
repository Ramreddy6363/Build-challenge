document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when the close button is clicked
    const closeBtn = document.getElementById('mobile-menu-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    }

    // Close menu when a navigation link is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  const accHeaders = document.querySelectorAll('.accordion-header');
  accHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      const icon = item.querySelector('.acc-icon');

      document.querySelectorAll('.accordion-item').forEach((i) => {
        if (i !== item) {
          const b = i.querySelector('.accordion-body');
          if (b) b.style.display = 'none';
          const ic = i.querySelector('.acc-icon');
          if (ic) ic.innerHTML = '&plus;';
          i.classList.remove('active');
        }
      });

      // Toggle visibility of the current item
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

  const mainImg = document.getElementById('main-img');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const dots = document.querySelectorAll('.g-dot');
  const thumbs = document.querySelectorAll('.thumb-item');

  // Map all image sources for navigation
  const images = Array.from(thumbs).map(
    (thumb) => thumb.querySelector('img').src
  );
  let currentIndex = 0;

  function updateGallery(index) {
    // Handle circular navigation
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    currentIndex = index;

    mainImg.src = images[currentIndex];

    dots.forEach((dot, i) => {
      if (i === currentIndex && i < dots.length) dot.classList.add('active');
      else dot.classList.remove('active');
    });

    thumbs.forEach((thumb, i) => {
      if (i === currentIndex) thumb.classList.add('active');
      else thumb.classList.remove('active');
    });
  }

  // Attach Event Listeners for Gallery Controls
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

  const fragOptions = document.querySelectorAll('.frag-option');
  fragOptions.forEach((opt) => {
    opt.addEventListener('click', function () {
      const grid = this.closest('.fragrance-grid');

      grid.querySelectorAll('.frag-option').forEach((sib) => {
        sib.classList.remove('selected');
        sib.querySelector('.frag-dot').classList.remove('active');
      });

      this.classList.add('selected');
      this.querySelector('.frag-dot').classList.add('active');

      updateAddToCart();
    });
  });

  // Initial call to set correct button state
  updateAddToCart();

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

  const statsSections = document.querySelectorAll('.stats-banner, .hero-stats');
  if (statsSections.length > 0) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Find and animate counters within the visible section
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
                if (target === 20000) counter.innerText = '20k+'; // Specific format for large number
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

// Handles switching between Single/Double plans
function selectPlan(plan) {
  // Reset both plans to inactive
  document.getElementById('plan-single').classList.remove('active');
  document.getElementById('plan-double').classList.remove('active');

  // Hide detail sections
  const detailsSingle = document.getElementById('details-single');
  const detailsDouble = document.getElementById('details-double');
  if (detailsSingle) detailsSingle.style.display = 'none';
  if (detailsDouble) detailsDouble.style.display = 'none';

  // Reset custom radio buttons
  document
    .querySelectorAll('.custom-radio-outer')
    .forEach((el) => el.classList.remove('active'));
  document
    .querySelectorAll('.custom-radio-inner')
    .forEach((el) => (el.style.display = 'none'));

  // Activate the selected plan
  const activePlan = document.getElementById('plan-' + plan);
  if (activePlan) {
    activePlan.classList.add('active');

    // Activate the radio button
    const radioOuter = activePlan.querySelector('.custom-radio-outer');
    const radioInner = activePlan.querySelector('.custom-radio-inner');
    if (radioOuter) radioOuter.classList.add('active');
    if (radioInner) radioInner.style.display = 'block';

    // Show plan details
    const activeDetails = document.getElementById('details-' + plan);
    if (activeDetails) activeDetails.style.display = 'block';
  }

  // Refresh cart button text
  updateAddToCart();
}

// Handles fragrance selection within a plan
function selectFragrance(element, name) {
  const grid = element.closest('.fragrance-grid');
  if (!grid) return;

  // Deselect siblings
  grid.querySelectorAll('.frag-option').forEach((sib) => {
    sib.classList.remove('selected');
    const dot = sib.querySelector('.frag-dot');
    if (dot) dot.classList.remove('active');
  });

  // Select clicked element
  element.classList.add('selected');
  const dot = element.querySelector('.frag-dot');
  if (dot) dot.classList.add('active');

  updateAddToCart();
}

// Updates the 'Add to Cart' button text based on selection
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

  // Retrieve names of selected fragrances
  const selectedFrags = activeDetails.querySelectorAll(
    '.frag-option.selected .frag-name'
  );
  let fragNames = [];
  selectedFrags.forEach((span) => fragNames.push(span.innerText));

  if (fragNames.length === 0) fragNames.push('None');

  // Update button text and attributes
  const cartBtn = document.querySelector(
    '.subscription-plans .submit-cart-btn'
  );
  if (cartBtn) {
    cartBtn.setAttribute('data-plan', selectedPlan);
    cartBtn.setAttribute('data-frags', fragNames.join(','));

    // Set pricing based on plan type
    let price = selectedPlan === 'single' ? '$33.00' : '$169.99';

    if (selectedPlan === 'double') price = '$169.99';

    let fragDisplay = fragNames.join(' + ');
    cartBtn.innerText = `Add '${fragDisplay}' to Cart - ${price}`;
  }
}
