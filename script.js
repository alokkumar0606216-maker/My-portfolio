/**
 * Portfolio JavaScript
 * Handles Theme Toggle, Mobile Menu, Typing Effect, Scroll Events, and Contact Form
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==================== CURRENT YEAR ==================== */
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    /* ==================== MOBILE NAVIGATION ==================== */
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-link');

    // Show menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }

    // Hide menu
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    });

    /* ==================== THEME TOGGLE (DARK / LIGHT) ==================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const darkThemeClass = 'dark-theme';
    const iconSun = 'fa-sun';
    const iconMoon = 'fa-moon';

    // Retrieve saved theme preference from localStorage
    const selectedTheme = localStorage.getItem('selected-theme');

    if (selectedTheme === 'dark') {
        document.body.classList.add(darkThemeClass);
        themeIcon.classList.remove(iconMoon);
        themeIcon.classList.add(iconSun);
    } else {
        document.body.classList.remove(darkThemeClass);
        themeIcon.classList.remove(iconSun);
        themeIcon.classList.add(iconMoon);
    }

    // Toggle theme on button click
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle(darkThemeClass);
            const isDark = document.body.classList.contains(darkThemeClass);

            if (isDark) {
                themeIcon.classList.remove(iconMoon);
                themeIcon.classList.add(iconSun);
                localStorage.setItem('selected-theme', 'dark');
            } else {
                themeIcon.classList.remove(iconSun);
                themeIcon.classList.add(iconMoon);
                localStorage.setItem('selected-theme', 'light');
            }
        });
    }

    /* ==================== TYPING TEXT EFFECT ==================== */
    const typingElement = document.querySelector('.typing-text');
    const words = [
        'Frontend Developer',
        'Backend Developer',
        'Python Developer',
        'Django & FastAPI Developer'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 120;
    let erasingDelay = 60;
    let newWordDelay = 1500;

    function typeEffect() {
        if (!typingElement) return;

        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? erasingDelay : typingDelay;

        if (!isDeleting && charIndex === currentWord.length) {
            delay = newWordDelay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 400;
        }

        setTimeout(typeEffect, delay);
    }

    typeEffect();

    /* ==================== SCROLL HEADER & SCROLL-TOP ==================== */
    const header = document.getElementById('header');
    const scrollTop = document.getElementById('scroll-top');
    const sections = document.querySelectorAll('section[id]');

    function handleScroll() {
        const scrollY = window.pageYOffset;

        // Sticky header background
        if (header) {
            if (scrollY >= 50) {
                header.classList.add('scroll-header');
            } else {
                header.classList.remove('scroll-header');
            }
        }

        // Show / Hide Scroll-To-Top button
        if (scrollTop) {
            if (scrollY >= 400) {
                scrollTop.classList.add('show-scroll');
            } else {
                scrollTop.classList.remove('show-scroll');
            }
        }

        // Active link highlighting on scroll
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-menu a[href*='${sectionId}']`);

            if (correspondingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    correspondingLink.classList.add('active');
                } else {
                    correspondingLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', handleScroll);

    /* ==================== CONTACT FORM SUBMISSION ==================== */
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        const formStatus = document.getElementById('contact-form-status');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const submitButtonText = submitButton.querySelector('span');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                formStatus.textContent = 'Please fill out all fields.';
                formStatus.className = 'form-status error';
                return;
            }

            submitButton.disabled = true;
            submitButtonText.textContent = 'Sending...';
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            try {
                const response = await fetch('https://formsubmit.co/ajax/alokkumar0606216@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        message,
                        _replyto: email,
                        _subject: `Portfolio contact from ${name}`
                    })
                });
                const result = await response.json();

                if (!response.ok || result.success !== 'true' && result.success !== true) {
                    throw new Error(result.message || 'The message could not be sent. Please try again.');
                }

                contactForm.reset();
                formStatus.textContent = 'Thanks! Your message has been sent. If this is your first message, check your inbox or spam folder for FormSubmit’s activation email.';
                formStatus.className = 'form-status success';
            } catch (error) {
                formStatus.textContent = error.message || 'Unable to send your message. Please try again later.';
                formStatus.className = 'form-status error';
            } finally {
                submitButton.disabled = false;
                submitButtonText.textContent = 'Send Message';
            }
        });
    }

    /* ==================== RESUME MODAL & DOWNLOAD HANDLER ==================== */
    const resumeBtn = document.getElementById('resume-btn');
    const heroResumeBtn = document.getElementById('hero-resume-btn');
    const resumeModal = document.getElementById('resume-modal');
    const resumeModalOverlay = document.getElementById('resume-modal-overlay');
    const resumeModalClose = document.getElementById('resume-modal-close');
    const printResumeBtn = document.getElementById('print-resume-btn');

    function openResumeModal(e) {
        if (e) e.preventDefault();
        if (resumeModal) {
            resumeModal.classList.add('active');
            resumeModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }
    }

    function closeResumeModal() {
        if (resumeModal) {
            resumeModal.classList.remove('active');
            resumeModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Restore background scroll
        }
    }

    if (resumeBtn) {
        resumeBtn.addEventListener('click', openResumeModal);
    }

    if (heroResumeBtn) {
        heroResumeBtn.addEventListener('click', openResumeModal);
    }

    if (resumeModalClose) {
        resumeModalClose.addEventListener('click', closeResumeModal);
    }

    if (resumeModalOverlay) {
        resumeModalOverlay.addEventListener('click', closeResumeModal);
    }

    // Close modal when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('active')) {
            closeResumeModal();
        }
    });

    // Print Resume / Save as PDF
    if (printResumeBtn) {
        printResumeBtn.addEventListener('click', () => {
            window.print();
        });
    }

});
