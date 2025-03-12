document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-links a');

    burger.addEventListener('click', () => {
        // Toggle active class on burger and nav overlay
        burger.classList.toggle('active');
        navOverlay.classList.toggle('active');

        // Prevent body scrolling when menu is open
        document.body.style.overflow = navOverlay.classList.contains('active') 
            ? 'hidden' 
            : 'auto';
    });

    // Close menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Close menu if clicked outside
    navOverlay.addEventListener('click', (e) => {
        if (e.target === navOverlay) {
            burger.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});