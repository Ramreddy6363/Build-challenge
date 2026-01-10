document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking links
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }
});

function selectPlan(plan) {
  // Reset both plans
  document.getElementById('plan-single').classList.remove('active');
  document.getElementById('plan-double').classList.remove('active');

  // Hide details
  document.getElementById('details-single').style.display = 'none';
  document.getElementById('details-double').style.display = 'none';

  // Reset Radios (hide inner dots)
  document
    .querySelector('#plan-single .custom-radio-outer')
    .classList.remove('active');
  document.querySelector('#plan-single .custom-radio-inner').style.display =
    'none';
  document
    .querySelector('#plan-double .custom-radio-outer')
    .classList.remove('active');
  document.querySelector('#plan-double .custom-radio-inner').style.display =
    'none';

  // Activate Selected
  document.getElementById('plan-' + plan).classList.add('active');
  document.getElementById('details-' + plan).style.display = 'block';

  // Show Inner Dot for Selected
  document
    .querySelector('#plan-' + plan + ' .custom-radio-outer')
    .classList.add('active');
  document.querySelector(
    '#plan-' + plan + ' .custom-radio-inner'
  ).style.display = 'block';
}
