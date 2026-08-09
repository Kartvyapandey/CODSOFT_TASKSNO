// Mobile Menu Navigation Toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Floating Back to Top Button Logic
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.remove('opacity-0', 'invisible');
        backToTopBtn.classList.add('opacity-100', 'visible');
    } else {
        backToTopBtn.classList.remove('opacity-100', 'visible');
        backToTopBtn.classList.add('opacity-0', 'invisible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Form Validation Before Submission (PDF Requirement)
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const messageInput = document.getElementById('messageInput');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    if (nameInput.value.trim() === '') {
        document.getElementById('nameError').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('nameError').classList.add('hidden');
    }

    if (!emailInput.value.includes('@') || !emailInput.value.includes('.')) {
        document.getElementById('emailError').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('emailError').classList.add('hidden');
    }

    if (messageInput.value.trim() === '') {
        document.getElementById('messageError').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('messageError').classList.add('hidden');
    }

    if (isValid) {
        alert('Thank you! Your message has been validated and sent.');
        contactForm.reset();
    }
});